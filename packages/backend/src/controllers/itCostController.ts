import { Request, Response } from 'express';
import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { ITCostService, CreateITCostInput, UpdateITCostInput } from '../services/itCostService';

const itCostService = new ITCostService();

export class ITCostController {
  async createCost(req: WithAuthProp<Request>, res: Response) {
    try {
      const data: CreateITCostInput = {
        ...req.body,
        userId: req.auth.userId,
      };
      const cost = await itCostService.createCost(data);
      res.status(201).json(cost);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create IT cost' });
    }
  }

  async getCostById(req: WithAuthProp<Request>, res: Response) {
    try {
      const cost = await itCostService.getCostById(req.params.id);
      if (!cost) {
        return res.status(404).json({ error: 'IT cost not found' });
      }
      if (cost.userId !== req.auth.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      res.json(cost);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get IT cost' });
    }
  }

  async getCostsByUserId(req: WithAuthProp<Request>, res: Response) {
    try {
      const costs = await itCostService.getCostsByUserId(req.auth.userId);
      res.json(costs);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get IT costs' });
    }
  }

  async updateCost(req: WithAuthProp<Request>, res: Response) {
    try {
      const cost = await itCostService.getCostById(req.params.id);
      if (!cost) {
        return res.status(404).json({ error: 'IT cost not found' });
      }
      if (cost.userId !== req.auth.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const data: UpdateITCostInput = {
        id: req.params.id,
        ...req.body,
      };
      const updatedCost = await itCostService.updateCost(data);
      res.json(updatedCost);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update IT cost' });
    }
  }

  async deleteCost(req: WithAuthProp<Request>, res: Response) {
    try {
      const cost = await itCostService.getCostById(req.params.id);
      if (!cost) {
        return res.status(404).json({ error: 'IT cost not found' });
      }
      if (cost.userId !== req.auth.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await itCostService.deleteCost(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete IT cost' });
    }
  }

  async getCostsByCategory(req: WithAuthProp<Request>, res: Response) {
    try {
      const costs = await itCostService.getCostsByCategory(
        req.auth.userId,
        req.params.category
      );
      res.json(costs);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get IT costs by category' });
    }
  }

  async getCostsByDateRange(req: WithAuthProp<Request>, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const costs = await itCostService.getCostsByDateRange(
        req.auth.userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(costs);
    } catch (error) {
      res.status(400).json({ error: 'Failed to get IT costs by date range' });
    }
  }
} 