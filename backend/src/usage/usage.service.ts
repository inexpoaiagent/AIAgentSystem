import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsageType } from '@prisma/client';

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async record(companyId: string, subscriptionId: string, type: UsageType, quantity: number, unit: string, traceId?: string) {
    return this.prisma.usageRecord.create({
      data: { companyId, subscriptionId, type, quantity, unit, traceId },
    });
  }

  async getSummary(companyId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { companyId } });
    if (!subscription) return null;

    const start = subscription.currentPeriodStart;
    const end = subscription.currentPeriodEnd;

    const records = await this.prisma.usageRecord.groupBy({
      by: ['type'],
      where: { companyId, recordedAt: { gte: start, lte: end } },
      _sum: { quantity: true },
      _count: true,
    });

    const summary: Record<string, unknown> = {};
    for (const r of records) {
      summary[r.type] = { total: r._sum.quantity, count: r._count };
    }

    return { period: { start, end }, summary, plan: subscription.plan };
  }

  async getHistory(companyId: string, type?: UsageType, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where = { companyId, ...(type && { type }) };

    const [items, total] = await Promise.all([
      this.prisma.usageRecord.findMany({ where, orderBy: { recordedAt: 'desc' }, skip, take: limit }),
      this.prisma.usageRecord.count({ where }),
    ]);

    return { items, total, page, limit };
  }
}
