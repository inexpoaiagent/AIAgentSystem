import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getForCompany(companyId: string) {
    const workspace = await this.prisma.workspace.findFirst({ where: { companyId } });
    if (!workspace) throw new NotFoundException('Workspace not found');

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    const subscription = await this.prisma.subscription.findUnique({ where: { companyId } });

    return {
      companyId,
      workspaceId: workspace.id,
      locale: company?.locale ?? 'en',
      plan: (subscription?.plan ?? 'STARTER').toLowerCase() as 'starter' | 'professional' | 'enterprise',
      companyName: company?.name,
      industry: company?.industry,
      settings: workspace.settings,
    };
  }

  async updateSettings(companyId: string, settings: Record<string, unknown>) {
    const workspace = await this.prisma.workspace.findFirst({ where: { companyId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return this.prisma.workspace.update({
      where: { id: workspace.id },
      data: { settings: settings as object },
    });
  }
}
