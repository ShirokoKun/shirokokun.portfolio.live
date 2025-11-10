import { Request, Response } from 'express';
import { GoogleSheetsService } from '../services/sheets.service';
import emailService from '../services/email.service';
import type { ContactFormData } from '../middlewares/validation.middleware';

let sheetsServiceInstance: GoogleSheetsService | null = null;

// Lazy initialization to ensure env vars are loaded
const getSheetsService = (): GoogleSheetsService => {
  if (!sheetsServiceInstance) {
    sheetsServiceInstance = new GoogleSheetsService();
  }
  return sheetsServiceInstance;
};

/**
 * POST /api/contact
 * Submit contact form
 */
export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const formData: ContactFormData = req.body;

    // Get sheets service instance
    const sheetsService = getSheetsService();
    
    // Save to Google Sheets
    await sheetsService.saveMessage(formData);
    
    // Send email notification (non-blocking)
    emailService.sendContactNotification({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      timestamp: new Date().toISOString(),
    }).catch(err => {
      console.error('Failed to send email notification:', err);
      // Don't fail the request if email fails
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to submit contact form',
      });
    }
  }
};

/**
 * GET /api/contact/test
 * Test Google Sheets connection
 */
export const testConnection = async (_req: Request, res: Response) => {
  try {
    const isConnected = await getSheetsService().testConnection();

    if (isConnected) {
      res.status(200).json({
        success: true,
        message: 'Google Sheets connection successful',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Google Sheets connection failed',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to test connection',
    });
  }
};
