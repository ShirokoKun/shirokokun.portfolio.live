import { Request, Response, NextFunction } from 'express';
import { MindscapeService } from '../services/mindscape.service';

const mindscapeService = new MindscapeService();

/**
 * GET /api/mindscape/public
 * Fetch public mindscape nodes and connections for visualization
 */
export async function getPublicMindscape(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log('📊 API: Getting public mindscape data');

    // Try to get data - service will initialize on first call
    const data = await mindscapeService.getPublicMindscape();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/mindscape/all
 * Fetch all mindscape nodes (admin only)
 */
export async function getAllNodes(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log('📊 API: Getting all mindscape nodes (admin)');

    // Try to get data - service will initialize on first call
    const nodes = await mindscapeService.getAllNodes();

    res.json({
      success: true,
      data: { nodes },
    });
  } catch (error) {
    next(error);
  }
}
