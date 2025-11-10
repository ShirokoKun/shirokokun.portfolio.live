import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/api/spotify/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Authorization Error</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #000;
              color: #fff;
            }
            .error-box {
              background: #1a1a1a;
              padding: 30px;
              border-radius: 12px;
              border: 2px solid #ff4444;
            }
            h1 { color: #ff4444; margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h1>❌ No Authorization Code</h1>
            <p>Please visit <a href="/api/spotify/auth" style="color: #1DB954;">/api/spotify/auth</a> to get the authorization URL first.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  try {
    // Exchange code for tokens
    const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();

    // Return beautiful HTML page with tokens
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Authorization Success</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 900px;
              margin: 50px auto;
              padding: 20px;
              background: #000;
              color: #fff;
              line-height: 1.6;
            }
            .success-box {
              background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
              padding: 40px;
              border-radius: 16px;
              border: 2px solid #1DB954;
              box-shadow: 0 8px 32px rgba(29, 185, 84, 0.2);
            }
            h1 {
              color: #1DB954;
              margin-top: 0;
              font-size: 2.5em;
              text-align: center;
            }
            .token-section {
              background: #111;
              padding: 24px;
              border-radius: 12px;
              margin: 24px 0;
              border: 1px solid #333;
            }
            .token-section h2 {
              color: #1DB954;
              margin-top: 0;
              font-size: 1.3em;
            }
            .token-value {
              background: #000;
              padding: 16px;
              border-radius: 8px;
              color: #1DB954;
              word-break: break-all;
              font-family: 'Courier New', monospace;
              font-size: 0.9em;
              border: 1px solid #1DB954;
              margin: 12px 0;
              position: relative;
            }
            .copy-btn {
              position: absolute;
              top: 8px;
              right: 8px;
              background: #1DB954;
              color: #000;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-size: 0.85em;
              transition: all 0.2s;
            }
            .copy-btn:hover {
              background: #1ed760;
              transform: scale(1.05);
            }
            .copy-btn:active {
              transform: scale(0.95);
            }
            .steps {
              background: #111;
              padding: 24px;
              border-radius: 12px;
              margin: 24px 0;
              border: 1px solid #333;
            }
            .steps h2 {
              color: #fff;
              margin-top: 0;
            }
            .steps ol {
              padding-left: 24px;
            }
            .steps li {
              margin: 12px 0;
              color: #ccc;
            }
            .steps code {
              background: #000;
              padding: 2px 8px;
              border-radius: 4px;
              color: #1DB954;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #2a1a00;
              border: 1px solid #ff9800;
              padding: 16px;
              border-radius: 8px;
              color: #ffb84d;
              margin: 16px 0;
            }
            .info {
              background: #001a2a;
              border: 1px solid #2196f3;
              padding: 16px;
              border-radius: 8px;
              color: #64b5f6;
              margin: 16px 0;
            }
            .env-example {
              background: #000;
              padding: 16px;
              border-radius: 8px;
              border: 1px solid #1DB954;
              font-family: 'Courier New', monospace;
              font-size: 0.9em;
              color: #1DB954;
              margin: 16px 0;
            }
          </style>
        </head>
        <body>
          <div class="success-box">
            <h1>✅ Spotify Authorization Successful!</h1>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> Keep these tokens secure! Never commit them to git or share them publicly.
            </div>

            <div class="token-section">
              <h2>🔑 Refresh Token (Copy This!)</h2>
              <p>This is what you need to add to your <code>.env.local</code> file. It never expires.</p>
              <div class="token-value" id="refresh-token">
                ${data.refresh_token}
                <button class="copy-btn" onclick="copyToken('refresh-token')">📋 Copy</button>
              </div>
            </div>

            <div class="token-section">
              <h2>⏱️ Access Token (Temporary)</h2>
              <p>This token expires in ${data.expires_in / 60} minutes. The refresh token will automatically get new access tokens.</p>
              <div class="token-value" id="access-token">
                ${data.access_token}
                <button class="copy-btn" onclick="copyToken('access-token')">📋 Copy</button>
              </div>
            </div>

            <div class="steps">
              <h2>📝 Next Steps:</h2>
              <ol>
                <li>Click the "📋 Copy" button above to copy your <strong>Refresh Token</strong></li>
                <li>Open your file: <code>portfolio-website/.env.local</code></li>
                <li>Find the line: <code>SPOTIFY_REFRESH_TOKEN=</code></li>
                <li>Paste your refresh token after the equals sign</li>
                <li>Save the file</li>
                <li>Restart your dev server (<code>npm run dev</code>)</li>
                <li>Test it: Visit <a href="/api/spotify/now-playing" style="color: #1DB954;">localhost:3000/api/spotify/now-playing</a></li>
              </ol>
            </div>

            <div class="info">
              <strong>💡 Example .env.local entry:</strong>
              <div class="env-example">
SPOTIFY_REFRESH_TOKEN=${data.refresh_token.substring(0, 50)}...
              </div>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #666; font-size: 0.9em;">
                You can close this window after copying the refresh token.
              </p>
            </div>
          </div>

          <script>
            function copyToken(elementId) {
              const element = document.getElementById(elementId);
              const text = element.textContent.replace('📋 Copy', '').trim();
              
              navigator.clipboard.writeText(text).then(() => {
                const btn = element.querySelector('.copy-btn');
                const originalText = btn.textContent;
                btn.textContent = '✅ Copied!';
                btn.style.background = '#1ed760';
                
                setTimeout(() => {
                  btn.textContent = originalText;
                  btn.style.background = '#1DB954';
                }, 2000);
              }).catch(err => {
                alert('Failed to copy. Please select and copy manually.');
              });
            }

            // Auto-select refresh token on page load
            window.onload = function() {
              const refreshToken = document.getElementById('refresh-token');
              if (window.getSelection && document.createRange) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(refreshToken);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            };
          </script>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Spotify callback error:', error);
    
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Authorization Error</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #000;
              color: #fff;
            }
            .error-box {
              background: #1a1a1a;
              padding: 30px;
              border-radius: 12px;
              border: 2px solid #ff4444;
            }
            h1 { color: #ff4444; margin-top: 0; }
            pre {
              background: #000;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              color: #ff6666;
            }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h1>❌ Token Exchange Failed</h1>
            <p>There was an error getting your Spotify tokens.</p>
            <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
            <p>Please try visiting <a href="/api/spotify/auth" style="color: #1DB954;">/api/spotify/auth</a> again.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
