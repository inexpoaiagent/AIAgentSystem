import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Users ──────────────────────────────────────────────────────────────────

  async listUsers(search?: string, page = 1, limit = 20) {
    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { name: { contains: search } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, role: true, status: true,
          locale: true, lastLoginAt: true, createdAt: true,
          company: { select: { id: true, name: true, industry: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async updateUser(id: string, data: Partial<{ status: UserStatus; role: UserRole }>) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, status: true },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
    return { success: true, message: 'User deleted' };
  }

  // ── Companies ──────────────────────────────────────────────────────────────

  async listCompanies(search?: string, page = 1, limit = 20) {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { domain: { contains: search } },
            { industry: { contains: search } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
              agents: true,
              agentTasks: true,
              memories: true,
            },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getCompanyDetail(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, role: true, status: true } },
        agents: { select: { id: true, name: true, tier: true, status: true } },
        _count: { select: { agentTasks: true, workflows: true, memories: true } },
      },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async assignPack(companyId: string, packId: string) {
    await this.prisma.company.update({
      where: { id: companyId },
      data: { industry: packId },
    });
    await this.prisma.agent.updateMany({
      where: { companyId },
      data: { status: 'ACTIVE' },
    });
    return { success: true, message: `Pack ${packId} assigned to company` };
  }

  // ── Business Categories ────────────────────────────────────────────────────

  async listCategories() {
    const cats = await this.prisma.businessCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { companies: true } } },
    });
    return cats;
  }

  async createCategory(data: { name: string; slug: string; description?: string; icon?: string; sortOrder?: number }) {
    return this.prisma.businessCategory.create({ data });
  }

  async updateCategory(id: string, data: Partial<{ name: string; description: string; icon: string; isActive: boolean; sortOrder: number }>) {
    const cat = await this.prisma.businessCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.businessCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    const cat = await this.prisma.businessCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    await this.prisma.businessCategory.delete({ where: { id } });
    return { success: true, message: 'Category deleted' };
  }

  // ── Platform stats ─────────────────────────────────────────────────────────

  async platformStats() {
    const [
      totalUsers, totalCompanies, totalAgents,
      totalTasks, totalWorkflows, totalMemories,
      activeUsers, recentSignups,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.agent.count({ where: { status: 'ACTIVE' } }),
      this.prisma.agentTask.count(),
      this.prisma.workflow.count({ where: { status: 'ACTIVE' } }),
      this.prisma.memory.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.company.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, industry: true, createdAt: true },
      }),
    ]);

    // Count companies per industry pack
    const packDistribution = await this.prisma.company.groupBy({
      by: ['industry'],
      _count: { _all: true },
      where: { industry: { not: null } },
    });

    return {
      totalUsers, totalCompanies, totalAgents, totalTasks,
      totalWorkflows, totalMemories, activeUsers, recentSignups,
      packDistribution: packDistribution.map((p) => ({
        pack: p.industry,
        count: p._count._all,
      })),
    };
  }
}
