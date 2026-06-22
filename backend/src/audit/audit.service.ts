import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, Prisma, RiskLevel } from '@prisma/client';

export interface AuditLogInput {
  companyId: string;
  actorId?: string;
  action: AuditAction;
  target?: string;
  targetId?: string;
  payload?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  traceId?: string;
  riskLevel?: RiskLevel;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    return this.prisma.auditLog.create({ data: input as Prisma.AuditLogUncheckedCreateInput });
  }

  async findAll(companyId: string, action?: AuditAction, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where = { companyId, ...(action && { action }) };

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { actor: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, total, page, limit };
  }
}
