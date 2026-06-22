import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { EventsGateway } from '../events/events.gateway';
import { WorkflowStatus } from '@prisma/client';

export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  trigger?: Record<string, unknown>;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  policies?: Record<string, unknown>;
}

@Injectable()
export class WorkflowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly events: EventsGateway,
  ) {}

  async findAll(companyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.workflow.findMany({
        where: { companyId },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.workflow.count({ where: { companyId } }),
    ]);
    return { items, total, page, limit };
  }

  async findOne(companyId: string, id: string) {
    const wf = await this.prisma.workflow.findFirst({ where: { companyId, id } });
    if (!wf) throw new NotFoundException('Workflow not found');
    return wf;
  }

  async create(companyId: string, userId: string, dto: CreateWorkflowDto) {
    const wf = await this.prisma.workflow.create({
      data: {
        companyId,
        name: dto.name,
        description: dto.description,
        trigger: (dto.trigger as object) ?? {},
        nodes: (dto.nodes as object[]) ?? [],
        edges: (dto.edges as object[]) ?? [],
        policies: (dto.policies as object) ?? {},
      },
    });

    await this.audit.log({ companyId, actorId: userId, action: 'CREATE', target: 'Workflow', targetId: wf.id, riskLevel: 'LOW' });
    return wf;
  }

  async update(companyId: string, id: string, userId: string, dto: Partial<CreateWorkflowDto & { status: WorkflowStatus }>) {
    const wf = await this.prisma.workflow.findFirst({ where: { companyId, id } });
    if (!wf) throw new NotFoundException('Workflow not found');

    const updated = await this.prisma.workflow.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.trigger !== undefined && { trigger: dto.trigger as object }),
        ...(dto.nodes !== undefined && { nodes: dto.nodes as object[] }),
        ...(dto.edges !== undefined && { edges: dto.edges as object[] }),
        ...(dto.policies !== undefined && { policies: dto.policies as object }),
        ...(dto.status !== undefined && { status: dto.status }),
        version: { increment: 1 },
      },
    });

    await this.audit.log({ companyId, actorId: userId, action: 'UPDATE', target: 'Workflow', targetId: id, riskLevel: 'LOW' });
    return updated;
  }

  async delete(companyId: string, id: string, userId: string) {
    const wf = await this.prisma.workflow.findFirst({ where: { companyId, id } });
    if (!wf) throw new NotFoundException('Workflow not found');

    await this.prisma.workflow.update({ where: { id }, data: { status: 'ARCHIVED' } });
    await this.audit.log({ companyId, actorId: userId, action: 'DELETE', target: 'Workflow', targetId: id, riskLevel: 'MEDIUM' });
    return { message: 'Workflow archived' };
  }

  async run(companyId: string, workflowId: string, userId: string) {
    const wf = await this.prisma.workflow.findFirst({ where: { companyId, id: workflowId } });
    if (!wf) throw new NotFoundException('Workflow not found');

    const run = await this.prisma.workflowRun.create({
      data: { workflowId, status: 'PENDING', startedAt: new Date() },
    });

    this.events.emitToCompany(companyId, 'workflow:run:started', { runId: run.id, workflowId });

    await this.audit.log({ companyId, actorId: userId, action: 'EXECUTE', target: 'WorkflowRun', targetId: run.id, riskLevel: 'MEDIUM' });

    // Simulate execution (in production this goes to queue workers)
    void this.simulateRun(companyId, run.id, wf.nodes as unknown as WorkflowNode[]);

    return run;
  }

  async getRuns(companyId: string, workflowId: string) {
    const wf = await this.prisma.workflow.findFirst({ where: { companyId, id: workflowId } });
    if (!wf) throw new NotFoundException('Workflow not found');

    return this.prisma.workflowRun.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  private async simulateRun(companyId: string, runId: string, nodes: WorkflowNode[]) {
    await new Promise((r) => setTimeout(r, 2000));
    const nodeStatuses: Record<string, string> = {};
    for (const node of nodes) nodeStatuses[node.id] = 'completed';

    await this.prisma.workflowRun.update({
      where: { id: runId },
      data: { status: 'COMPLETED', nodeStatuses: nodeStatuses as object, completedAt: new Date() },
    });

    this.events.emitToCompany(companyId, 'workflow:run:completed', { runId });
  }
}
