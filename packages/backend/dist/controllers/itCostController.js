import { ITCostService } from '../services/itCostService';
const itCostService = new ITCostService();
export class ITCostController {
    async createCost(req, res) {
        try {
            const userId = req.auth?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const data = {
                ...req.body,
                userId,
            };
            const cost = await itCostService.createCost(data);
            res.status(201).json(cost);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to create IT cost' });
        }
    }
    async getCostById(req, res) {
        try {
            const userId = req.auth?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'ID is required' });
            }
            const cost = await itCostService.getCostById(id);
            if (!cost)
                return res.status(404).json({ error: 'IT cost not found' });
            if (cost.userId !== userId)
                return res.status(403).json({ error: 'Forbidden' });
            res.json(cost);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to get IT cost' });
        }
    }
    async getCostsByUserId(req, res) {
        try {
            const userId = req.auth?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const costs = await itCostService.getCostsByUserId(userId);
            res.json(costs);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to get IT costs' });
        }
    }
    async updateCost(req, res) {
        try {
            const userId = req.auth?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'ID is required' });
            }
            const cost = await itCostService.getCostById(id);
            if (!cost)
                return res.status(404).json({ error: 'IT cost not found' });
            if (cost.userId !== userId)
                return res.status(403).json({ error: 'Forbidden' });
            const data = {
                id: id,
                ...req.body,
            };
            const updatedCost = await itCostService.updateCost(data);
            res.json(updatedCost);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to update IT cost' });
        }
    }
    async deleteCost(req, res) {
        try {
            const userId = req.auth?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'ID is required' });
            }
            const cost = await itCostService.getCostById(id);
            if (!cost)
                return res.status(404).json({ error: 'IT cost not found' });
            if (cost.userId !== userId)
                return res.status(403).json({ error: 'Forbidden' });
            await itCostService.deleteCost(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to delete IT cost' });
        }
    }
    async getCostsByCategory(req, res) {
        try {
            const userId = req.auth?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const { category } = req.params;
            if (!category || typeof category !== 'string') {
                return res.status(400).json({ error: 'Category is required' });
            }
            const costs = await itCostService.getCostsByCategory(userId, category);
            res.json(costs);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to get IT costs by category' });
        }
    }
    async getCostsByDateRange(req, res) {
        try {
            const userId = req.auth?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Start date and end date are required' });
            }
            const costs = await itCostService.getCostsByDateRange(userId, new Date(startDate), new Date(endDate));
            res.json(costs);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to get IT costs by date range' });
        }
    }
}
