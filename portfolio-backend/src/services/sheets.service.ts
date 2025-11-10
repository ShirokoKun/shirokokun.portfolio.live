import { google, sheets_v4 } from 'googleapis';
import { ApiError } from '../middlewares/error.middleware';
import type { ContactFormData } from '../middlewares/validation.middleware';

export interface ContactMessage extends ContactFormData {
  timestamp: string;
  source: string;
}

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets | null = null;
  private spreadsheetId: string;
  private range: string;
  private isConfigured: boolean = false;

  constructor() {
    // Validate required environment variables
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || '';
    this.range = process.env.GOOGLE_SHEETS_RANGE || 'Responses!A:E';

    // Debug logging
    console.log('🔍 Google Sheets Configuration Check:');
    console.log('  - Email:', clientEmail ? clientEmail.substring(0, 30) + '...' : 'NOT SET');
    console.log('  - Private Key:', privateKey ? 'SET (' + privateKey.substring(0, 30) + '...)' : 'NOT SET');
    console.log('  - Sheet ID:', this.spreadsheetId ? this.spreadsheetId : 'NOT SET');

    // Check if credentials are properly configured
    const hasValidEmail = clientEmail && !clientEmail.includes('your-service-account');
    const hasValidKey = privateKey && !privateKey.includes('YOUR_PRIVATE_KEY_HERE');
    const hasValidSheetId = this.spreadsheetId && !this.spreadsheetId.includes('your-spreadsheet-id');

    console.log('  - Valid Email:', hasValidEmail);
    console.log('  - Valid Key:', hasValidKey);
    console.log('  - Valid Sheet ID:', hasValidSheetId);

    if (!hasValidEmail || !hasValidKey || !hasValidSheetId) {
      console.warn('⚠️  Google Sheets not configured - contact form will log to console only');
      this.isConfigured = false;
      return;
    }

    try {
      // Handle different private key formats
      let formattedKey = privateKey;
      // Remove quotes if present
      formattedKey = formattedKey.replace(/^["']|["']$/g, '');
      // Replace literal \n with actual newlines
      formattedKey = formattedKey.replace(/\\n/g, '\n');
      
      // Validate key format
      if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Invalid private key format');
      }

      // Initialize Google Auth
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: formattedKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      // Initialize Sheets API
      this.sheets = google.sheets({ version: 'v4', auth });
      this.isConfigured = true;
      console.log('✅ Google Sheets service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Save contact form message to Google Sheets
   */
  async saveMessage(message: ContactFormData): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // If not configured, just log the message
    if (!this.isConfigured || !this.sheets) {
      console.log('📝 [DEV MODE] Contact form submission:');
      console.log(JSON.stringify({
        timestamp,
        ...message
      }, null, 2));
      return;
    }

    try {
      const row = [
        timestamp,
        message.name,
        message.email,
        message.subject,
        message.message,
      ];

      console.log('📝 Saving message to Google Sheets...');

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: this.range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      });

      if (response.status !== 200) {
        throw new Error(`Google Sheets API returned status ${response.status}`);
      }

      console.log('✅ Message saved successfully');
    } catch (error) {
      console.error('❌ Error saving to Google Sheets:', error);
      
      if (error instanceof Error) {
        throw new ApiError(500, `Failed to save message: ${error.message}`);
      }
      
      throw new ApiError(500, 'Failed to save message to Google Sheets');
    }
  }

  /**
   * Test connection to Google Sheets
   */
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured || !this.sheets) {
      return false;
    }

    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      return response.status === 200;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }

  /**
   * Check if Google Sheets is configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }
}
