import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, requestingCompanyId: string, data: Partial<{ name: string; industry: string; domain: string; website: string; instagram: string; facebook: string; youtube: string; brandVoice: string; locale: string }>) {
    if (id !== requestingCompanyId) throw new ForbiddenException('Cannot modify other companies');
    return this.prisma.company.update({ where: { id }, data });
  }

  async activatePack(companyId: string, packSlug: string) {
    // Resolve pack from DB by slug or id
    const pack = await this.prisma.industryPack.findFirst({
      where: { OR: [{ slug: packSlug }, { id: packSlug }] },
    });

    if (!pack) {
      throw new NotFoundException(`Industry pack "${packSlug}" not found`);
    }

    // Link company to the DB pack record
    await this.prisma.company.update({
      where: { id: companyId },
      data: { industryPackId: pack.id, industry: pack.slug },
    });

    await this.prisma.agent.updateMany({
      where: { companyId },
      data: { status: 'ACTIVE' },
    });

    const agentCount = await this.prisma.agent.count({ where: { companyId } });
    return {
      success: true,
      packId: pack.id,
      packSlug: pack.slug,
      packName: pack.name,
      message: `${pack.name} pack activated — ${agentCount} agents are now active for your business.`,
    };
  }

  async getStats(companyId: string) {
    const [agents, tasks, workflows, memories] = await Promise.all([
      this.prisma.agent.count({ where: { companyId, status: 'ACTIVE' } }),
      this.prisma.agentTask.count({ where: { companyId } }),
      this.prisma.workflow.count({ where: { companyId, status: 'ACTIVE' } }),
      this.prisma.memory.count({ where: { companyId } }),
    ]);
    return { activeAgents: agents, totalTasks: tasks, activeWorkflows: workflows, totalMemories: memories };
  }
}
