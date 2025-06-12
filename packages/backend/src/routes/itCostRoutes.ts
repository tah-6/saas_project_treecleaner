import { Router, Request, Response, RequestHandler } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { ITCostController } from '../controllers/itCostController';
import { WithAuthProp } from '@clerk/clerk-sdk-node';

const router = Router();
const itCostController = new ITCostController();

// Apply authentication middleware to all routes
router.use(ClerkExpressRequireAuth({}));

// Create a new IT cost
router.post('/', (itCostController.createCost as unknown as RequestHandler));

// Get all IT costs for the authenticated user
router.get('/', (itCostController.getCostsByUserId as unknown as RequestHandler));

// Get IT costs by category
router.get('/category/:category', (itCostController.getCostsByCategory as unknown as RequestHandler));

// Get IT costs by date range
router.get('/date-range', (itCostController.getCostsByDateRange as unknown as RequestHandler));

// Get a specific IT cost
router.get('/:id', (itCostController.getCostById as unknown as RequestHandler));

// Update an IT cost
router.put('/:id', (itCostController.updateCost as unknown as RequestHandler));

// Delete an IT cost
router.delete('/:id', (itCostController.deleteCost as unknown as RequestHandler));

export default router; 