import { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { ITCostController } from '../controllers/itCostController';
const router = Router();
const itCostController = new ITCostController();
// Apply authentication middleware to all routes
router.use(ClerkExpressRequireAuth({}));
// Create a new IT cost
router.post('/', itCostController.createCost);
// Get all IT costs for the authenticated user
router.get('/', itCostController.getCostsByUserId);
// Get IT costs by category
router.get('/category/:category', itCostController.getCostsByCategory);
// Get IT costs by date range
router.get('/date-range', itCostController.getCostsByDateRange);
// Get a specific IT cost
router.get('/:id', itCostController.getCostById);
// Update an IT cost
router.put('/:id', itCostController.updateCost);
// Delete an IT cost
router.delete('/:id', itCostController.deleteCost);
export default router;
