import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemoryType } from '@prisma/client';

export interface CreateMemoryDto {
  type: MemoryType;
  title: string;
  content: string;
  tags?: string[];
  source?: string;
  importance?: number;
}

@Injectable()
export class MemoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: string, type?: MemoryType, search?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = {
      companyId,
      ...(type && { type }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.memory.findMany({ where, orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }], skip, take: limit }),
      this.prisma.memory.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async create(companyId: string, dto: CreateMemoryDto) {
    return this.prisma.memory.create({
      data: {
        companyId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
        tags: dto.tags ?? [],
        source: dto.source,
        importance: dto.importance ?? 5,
      },
    });
  }

  async update(companyId: string, id: string, dto: Partial<CreateMemoryDto>) {
    const mem = await this.prisma.memory.findFirst({ where: { companyId, id } });
    if (!mem) throw new NotFoundException('Memory not found');
    return this.prisma.memory.update({ where: { id }, data: dto });
  }

  async delete(companyId: string, id: string) {
    const mem = await this.prisma.memory.findFirst({ where: { companyId, id } });
    if (!mem) throw new NotFoundException('Memory not found');
    await this.prisma.memory.delete({ where: { id } });
    return { message: 'Memory deleted' };
  }
}
