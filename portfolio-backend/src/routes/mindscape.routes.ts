import { Router } from 'express';
import { getPublicMindscape, getAllNodes } from '../controllers/mindscape.controller';

const router = Router();

/**
 * Public Routes
 */

// GET /api/mindscape/public - Get public nodes and connections for visualization
router.get('/public', getPublicMindscape);

/**
 * Admin Routes (will be protected with auth middleware later)
 */

// GET /api/admin/mindscape/all - Get all nodes (public + private)
router.get('/admin/all', getAllNodes);

export default router;
