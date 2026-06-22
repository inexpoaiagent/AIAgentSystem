import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuditService } from '../audit/audit.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class AgentTasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly events: EventsGateway,
  ) {}

  async create(companyId: string, userId: string, dto: CreateTaskDto) {
    // Resolve agent IDs from slugs
    let agentId: string | undefined;
    if (dto.agentSlugs && dto.agentSlugs.length > 0) {
      const agent = await this.prisma.agent.findFirst({
        where: { companyId, slug: dto.agentSlugs[0] },
      });
      agentId = agent?.id;
    }

    const task = await this.prisma.agentTask.create({
      data: {
        companyId,
        requestedById: userId,
        agentId,
        title: dto.message.substring(0, 100),
        objective: dto.message,
        agentSlugs: dto.agentSlugs ?? [],
        approvalMode: dto.approvalMode,
        status: dto.approvalMode === 'AUTONOMOUS' ? 'RUNNING' : 'QUEUED',
      },
    });

    this.events.emitToCompany(companyId, 'task:created', {
      taskId: task.id,
      status: task.status,
      title: task.title,
    });

    await this.audit.log({
      companyId,
      actorId: userId,
      action: 'CREATE',
      target: 'AgentTask',
      targetId: task.id,
      riskLevel: 'LOW',
    });

    // Simulate async dispatch to AI engine (non-blocking)
    void this.dispatchToAiEngine(companyId, task.id, dto);

    return { taskId: task.id, status: task.status };
  }

  async findAll(companyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.agentTask.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { requestedBy: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      this.prisma.agentTask.count({ where: { companyId } }),
    ]);
    return { items, total, page, limit };
  }

  async findOne(companyId: string, id: string) {
    const task = await this.prisma.agentTask.findFirst({
      where: { companyId, id },
      include: {
        requestedBy: { select: { id: true, name: true, avatarUrl: true } },
        agent: true,
        meeting: { include: { agents: { include: { agent: true } } } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async approve(companyId: string, taskId: string, approverId: string) {
    const task = await this.prisma.agentTask.findFirst({ where: { companyId, id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.status !== 'NEEDS_APPROVAL') {
      throw new ForbiddenException('Task is not pending approval');
    }

    const updated = await this.prisma.agentTask.update({
      where: { id: taskId },
      data: { status: 'APPROVED', approvedAt: new Date(), approvedById: approverId },
    });

    this.events.emitToCompany(companyId, 'task:approved', { taskId, approverId });

    await this.audit.log({
      companyId,
      actorId: approverId,
      action: 'APPROVE',
      target: 'AgentTask',
      targetId: taskId,
      riskLevel: 'MEDIUM',
    });

    return updated;
  }

  async reject(companyId: string, taskId: string, actorId: string, reason?: string) {
    const task = await this.prisma.agentTask.findFirst({ where: { companyId, id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const updated = await this.prisma.agentTask.update({
      where: { id: taskId },
      data: { status: 'REJECTED', errorMessage: reason ?? 'Rejected by user' },
    });

    this.events.emitToCompany(companyId, 'task:rejected', { taskId });

    await this.audit.log({
      companyId,
      actorId,
      action: 'REJECT',
      target: 'AgentTask',
      targetId: taskId,
      riskLevel: 'MEDIUM',
    });

    return updated;
  }

  async cancel(companyId: string, taskId: string, actorId: string) {
    const task = await this.prisma.agentTask.findFirst({ where: { companyId, id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.agentTask.update({
      where: { id: taskId },
      data: { status: 'CANCELLED' },
    });
  }

  private async dispatchToAiEngine(companyId: string, taskId: string, dto: CreateTaskDto) {
    try {
      const aiUrl = process.env.AI_ENGINE_URL ?? 'http://localhost:8000';
      const res = await fetch(`${aiUrl}/orchestrator/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: companyId,
          user_id: 'system',
          message: dto.message,
          approval_mode: dto.approvalMode.toLowerCase(),
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (res.ok) {
        const plan = await res.json() as { tasks?: unknown[] };
        await this.prisma.agentTask.update({
          where: { id: taskId },
          data: {
            status: dto.approvalMode === 'MANUAL' ? 'NEEDS_APPROVAL' : 'RUNNING',
            result: plan as object,
          },
        });
        this.events.emitToCompany(companyId, 'task:planned', { taskId, plan });
      }
    } catch {
      // AI engine unavailable — task stays QUEUED, operator can retry
      await this.prisma.agentTask.update({
        where: { id: taskId },
        data: { status: 'NEEDS_APPROVAL', errorMessage: 'AI engine unreachable — manual review required' },
      });
    }
  }
}
