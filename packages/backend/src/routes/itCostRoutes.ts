import { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { ITCostController } from '../controllers/itCostController';

const router = Router();
const itCostController = new ITCostController();

// Apply authentication middleware to all routes
router.use(ClerkExpressRequireAuth({}));

// Create a new IT cost
router.post('/', itCostController.createCost.bind(itCostController));

// Get all IT costs for the authenticated user
router.get('/', itCostController.getCostsByUserId.bind(itCostController));

// Get IT costs by category
router.get('/category/:category', itCostController.getCostsByCategory.bind(itCostController));

// Get IT costs by date range
router.get('/date-range', itCostController.getCostsByDateRange.bind(itCostController));

// Get a specific IT cost
router.get('/:id', itCostController.getCostById.bind(itCostController));

// Update an IT cost
router.put('/:id', itCostController.updateCost.bind(itCostController));

// Delete an IT cost
router.delete('/:id', itCostController.deleteCost.bind(itCostController));

export default router; 