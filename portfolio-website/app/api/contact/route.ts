import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const sheetsScopes = ['https://www.googleapis.com/auth/spreadsheets'];

const getSheetsClient = async () => {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Google service account credentials are not configured.');
  }

  // Handle different private key formats
  // Remove quotes if present
  privateKey = privateKey.replace(/^["']|["']$/g, '');
  // Replace literal \n with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');
  // Ensure proper formatting
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Invalid private key format');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: sheetsScopes,
  });

  await auth.authorize();
  return google.sheets({ version: 'v4', auth });
};

const sendEmailNotification = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPass) {
    console.warn('⚠️  Email not configured, skipping notification');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      subject: `🔔 New Portfolio Contact: ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              border-radius: 12px 12px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
            }
            .content {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-top: none;
              border-radius: 0 0 12px 12px;
              padding: 30px;
            }
            .field {
              margin-bottom: 24px;
            }
            .field-label {
              font-size: 12px;
              font-weight: 600;
              color: #9ca3af;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            .field-value {
              font-size: 16px;
              color: #ffffff;
              line-height: 1.6;
            }
            .message-box {
              background: rgba(0, 0, 0, 0.3);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 16px;
              margin-top: 8px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              margin-top: 32px;
              padding-top: 24px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              color: #9ca3af;
              font-size: 12px;
            }
            .reply-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">${data.name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">
                  <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">
                    ${data.email}
                  </a>
                </div>
              </div>
              
              <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">${data.subject}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Received</div>
                <div class="field-value">${new Date(data.timestamp).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${data.message}</div>
              </div>
              
              <div style="text-align: center;">
                <a href="mailto:${data.email}?subject=Re: ${data.subject}" class="reply-button">
                  Reply to ${data.name} →
                </a>
              </div>
              
              <div class="footer">
                📊 View all submissions in your <a href="https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}" style="color: #667eea;">Google Sheet</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Portfolio Contact Form Submission

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Received: ${new Date(data.timestamp).toLocaleString()}

Message:
${data.message}

---
Reply to: ${data.email}
View all submissions: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}
      `.trim(),
    });

    console.log('✅ Email notification sent');
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const targetRange = process.env.GOOGLE_SHEETS_RANGE || 'Responses!A:E';

    if (!spreadsheetId) {
      throw new Error('Google Sheets ID is not configured.');
    }

    const sheets = await getSheetsClient();
    const timestamp = new Date().toISOString();

    // Save to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: targetRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp,
          name,
          email,
          subject,
          message,
        ]],
      },
    });

    // Send email notification (non-blocking)
    sendEmailNotification({
      name,
      email,
      subject,
      message,
      timestamp,
    }).catch(err => {
      console.error('Email notification failed:', err);
      // Don't fail the request if email fails
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}


