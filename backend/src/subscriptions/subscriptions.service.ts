import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, BillingCycle } from '@prisma/client';

const PLAN_LIMITS: Record<SubscriptionPlan, { agents: number; tasks: number; voiceMinutes: number }> = {
  STARTER: { agents: 3, tasks: 50, voiceMinutes: 60 },
  PROFESSIONAL: { agents: 12, tasks: 500, voiceMinutes: 600 },
  ENTERPRISE: { agents: -1, tasks: -1, voiceMinutes: -1 },
};

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(companyId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { companyId },
      include: { invoices: { orderBy: { createdAt: 'desc' }, take: 12 } },
    });
    if (!sub) throw new NotFoundException('Subscription not found');

    return { ...sub, limits: PLAN_LIMITS[sub.plan] };
  }

  async changePlan(companyId: string, plan: SubscriptionPlan, billingCycle: BillingCycle) {
    const sub = await this.prisma.subscription.findUnique({ where: { companyId } });
    if (!sub) throw new NotFoundException('Subscription not found');

    return this.prisma.subscription.update({
      where: { companyId },
      data: { plan, billingCycle },
    });
  }

  async cancel(companyId: string) {
    return this.prisma.subscription.update({
      where: { companyId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
  }

  async getInvoices(companyId: string) {
    return this.prisma.invoice.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 24,
    });
  }
}
