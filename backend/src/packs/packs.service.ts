import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PacksService {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.industryPack.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { companies: true } } },
    });
  }

  listAll() {
    return this.prisma.industryPack.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { companies: true } } },
    });
  }

  getBySlug(slug: string) {
    return this.prisma.industryPack.findUnique({
      where: { slug },
      include: { _count: { select: { companies: true } } },
    });
  }

  getById(id: string) {
    return this.prisma.industryPack.findUnique({
      where: { id },
      include: { _count: { select: { companies: true } } },
    });
  }

  create(data: Partial<{
    slug: string; name: string; emoji: string; tagline: string;
    valueProposition: string; targetCustomers: object; painPoints: object;
    agents: object; outcomes: object; kpis: object;
    tier: string; price: number; color: string;
    gradientFrom: string; gradientTo: string; sortOrder: number;
  }>) {
    return this.prisma.industryPack.create({ data: data as any });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.industryPack.update({ where: { id }, data: data as any });
  }

  delete(id: string) {
    return this.prisma.industryPack.delete({ where: { id } });
  }
}
