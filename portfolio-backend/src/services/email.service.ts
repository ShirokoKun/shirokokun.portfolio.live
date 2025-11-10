import nodemailer from 'nodemailer';

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;
  private initialized = false;

  private initialize() {
    if (this.initialized) return;
    this.initialized = true;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPass) {
      console.warn('⚠️  Email service not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD in .env');
      this.isConfigured = false;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      this.isConfigured = true;
      console.log('✅ Email service configured successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Send notification email when a new contact form is submitted
   */
  async sendContactNotification(data: ContactEmailData): Promise<boolean> {
    this.initialize(); // Lazy initialization
    
    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️  Email service not configured, skipping notification');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
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
                  <a href="mailto:${data.email}?subject=Re: Your message on my portfolio" class="reply-button">
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
        // Plain text fallback
        text: `
New Portfolio Contact Form Submission

From: ${data.name}
Email: ${data.email}
Received: ${new Date(data.timestamp).toLocaleString()}

Message:
${data.message}

---
Reply to: ${data.email}
View all submissions: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}
        `.trim(),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email notification:', error);
      return false;
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    this.initialize(); // Lazy initialization
    
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email verification failed:', error);
      return false;
    }
  }
}

export default new EmailService();
