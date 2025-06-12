import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();
// Define enums locally since they might not be exported from Prisma
export var CostCategory;
(function (CostCategory) {
    CostCategory["SOFTWARE"] = "SOFTWARE";
    CostCategory["HARDWARE"] = "HARDWARE";
    CostCategory["CLOUD"] = "CLOUD";
    CostCategory["SUBSCRIPTION"] = "SUBSCRIPTION";
    CostCategory["MAINTENANCE"] = "MAINTENANCE";
    CostCategory["OTHER"] = "OTHER";
})(CostCategory || (CostCategory = {}));
export var BillingFrequency;
(function (BillingFrequency) {
    BillingFrequency["MONTHLY"] = "MONTHLY";
    BillingFrequency["QUARTERLY"] = "QUARTERLY";
    BillingFrequency["YEARLY"] = "YEARLY";
    BillingFrequency["ONE_TIME"] = "ONE_TIME";
})(BillingFrequency || (BillingFrequency = {}));
export class ITCostService {
    async createCost(data) {
        return prisma.iTCost.create({
            data: {
                ...data,
                amount: new Decimal(data.amount),
            },
        });
    }
    async getCostById(id) {
        return prisma.iTCost.findUnique({
            where: { id },
        });
    }
    async getCostsByUserId(userId) {
        return prisma.iTCost.findMany({
            where: { userId },
            orderBy: { billingDate: 'desc' },
        });
    }
    async updateCost(data) {
        const { id, ...updateData } = data;
        return prisma.iTCost.update({
            where: { id },
            data: updateData.amount ? { ...updateData, amount: new Decimal(updateData.amount) } : updateData,
        });
    }
    async deleteCost(id) {
        return prisma.iTCost.delete({
            where: { id },
        });
    }
    async getCostsByCategory(userId, category) {
        return prisma.iTCost.findMany({
            where: {
                userId,
                category,
            },
            orderBy: { billingDate: 'desc' },
        });
    }
    async getCostsByDateRange(userId, startDate, endDate) {
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
    async getCostAnalytics(userId, startDate, endDate) {
        const costs = await prisma.iTCost.findMany({
            where: {
                userId,
                billingDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalCost = costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
        const costsByCategory = costs.reduce((acc, cost) => {
            const category = cost.category;
            acc[category] = (acc[category] || 0) + Number(cost.amount);
            return acc;
        }, {});
        const costsByFrequency = costs.reduce((acc, cost) => {
            const frequency = cost.billingFrequency;
            acc[frequency] = (acc[frequency] || 0) + Number(cost.amount);
            return acc;
        }, {});
        return {
            totalCost,
            costsByCategory,
            costsByFrequency,
        };
    }
}
