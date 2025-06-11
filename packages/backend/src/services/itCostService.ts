import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export interface CreateITCostInput {
  serviceName: string;
  amount: number;
  category: string;
  billingDate: Date;
  userId: string;
  metadata?: Record<string, any>;
}

export interface UpdateITCostInput extends Partial<CreateITCostInput> {
  id: string;
}

export class ITCostService {
  async createCost(data: CreateITCostInput) {
    return prisma.iTCost.create({
      data: {
        ...data,
        amount: new Decimal(data.amount),
      },
    });
  }

  async getCostById(id: string) {
    return prisma.iTCost.findUnique({
      where: { id },
    });
  }

  async getCostsByUserId(userId: string) {
    return prisma.iTCost.findMany({
      where: { userId },
      orderBy: { billingDate: 'desc' },
    });
  }

  async updateCost(data: UpdateITCostInput) {
    const { id, ...updateData } = data;
    return prisma.iTCost.update({
      where: { id },
      data: updateData.amount ? { ...updateData, amount: new Decimal(updateData.amount) } : updateData,
    });
  }

  async deleteCost(id: string) {
    return prisma.iTCost.delete({
      where: { id },
    });
  }

  async getCostsByCategory(userId: string, category: string) {
    return prisma.iTCost.findMany({
      where: {
        userId,
        category,
      },
      orderBy: { billingDate: 'desc' },
    });
  }

  async getCostsByDateRange(userId: string, startDate: Date, endDate: Date) {
    return prisma.iTCost.findMany({
      where: {
        userId,
        billingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { billingDate: 'desc' },
    });
  }
} 