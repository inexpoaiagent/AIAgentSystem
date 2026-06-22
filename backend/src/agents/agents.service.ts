import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AgentStatus } from '@prisma/client';
import { subDays, startOfDay } from 'date-fns';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.agent.findMany({
      where: { companyId },
      orderBy: [{ tier: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(companyId: string, id: string) {
    const agent = await this.prisma.agent.findFirst({ where: { companyId, id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async setStatus(companyId: string, id: string, status: AgentStatus) {
    const agent = await this.prisma.agent.findFirst({ where: { companyId, id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return this.prisma.agent.update({ where: { id }, data: { status } });
  }

  async updateConfig(companyId: string, id: string, config: Record<string, unknown>) {
    const agent = await this.prisma.agent.findFirst({ where: { companyId, id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return this.prisma.agent.update({ where: { id }, data: { config: config as object } });
  }

  async getSummary(companyId: string) {
    const agents = await this.prisma.agent.findMany({
      where: { companyId },
      orderBy: [{ tier: 'asc' }, { name: 'asc' }],
    });

    const todayStart = startOfDay(new Date());
    const weekAgo = subDays(new Date(), 7);

    const enriched = await Promise.all(
      agents.map(async (agent) => {
        const [activeTasks, completedToday, totalTasks, failedTotal, recentTasks] = await Promise.all([
          this.prisma.agentTask.count({
            where: { companyId, agentId: agent.id, status: { in: ['RUNNING', 'QUEUED', 'NEEDS_APPROVAL'] } },
          }),
          this.prisma.agentTask.count({
            where: { companyId, agentId: agent.id, status: 'COMPLETED', completedAt: { gte: todayStart } },
          }),
          this.prisma.agentTask.count({ where: { companyId, agentId: agent.id } }),
          this.prisma.agentTask.count({ where: { companyId, agentId: agent.id, status: 'FAILED' } }),
          this.prisma.agentTask.findMany({
            where: { companyId, agentId: agent.id, createdAt: { gte: weekAgo } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, title: true, status: true, createdAt: true, completedAt: true },
          }),
        ]);

        const completedTotal = await this.prisma.agentTask.count({
          where: { companyId, agentId: agent.id, status: 'COMPLETED' },
        });

        const successRate = totalTasks > 0 ? Math.round((completedTotal / totalTasks) * 100) : 100;

        return {
          ...agent,
          goals: agent.goals as string[],
          tools: agent.tools as string[],
          kpis: agent.kpis as string[],
          stats: {
            activeTasks,
            completedToday,
            totalTasks,
            successRate,
            failedTotal,
          },
          recentTasks,
        };
      }),
    );

    return enriched;
  }

  async getKpis(companyId: string, id: string) {
    const agent = await this.prisma.agent.findFirst({ where: { companyId, id } });
    if (!agent) throw new NotFoundException('Agent not found');

    const tasks = await this.prisma.agentTask.findMany({
      where: { companyId, agentId: id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const completed = tasks.filter((t) => t.status === 'COMPLETED');
    const failed = tasks.filter((t) => t.status === 'FAILED');

    return {
      agent,
      kpis: {
        totalTasks: tasks.length,
        completedTasks: completed.length,
        failedTasks: failed.length,
        successRate: tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0,
        avgCostUsd: completed.reduce((a, t) => a + Number(t.costUsd ?? 0), 0) / (completed.length || 1),
      },
    };
  }
}
