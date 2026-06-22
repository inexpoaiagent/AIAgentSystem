import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface BusinessDoctorInput {
  industry: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

@Injectable()
export class BusinessDoctorService {
  private readonly logger = new Logger(BusinessDoctorService.name);
  private readonly AI_ENGINE = process.env.AI_ENGINE_URL ?? 'http://localhost:8000';

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Full analysis — proxies to AI engine, saves result to company memory */
  async analyze(companyId: string, userId: string, dto: BusinessDoctorInput): Promise<object> {
    try {
      const res = await fetch(`${this.AI_ENGINE}/business-doctor/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: companyId, ...dto }),
        signal: AbortSignal.timeout(120_000),
      });

      if (!res.ok) throw new Error(`AI engine ${res.status}`);
      const result = await res.json() as { diagnosis?: { business_health_score?: number } };

      // Update company with social channels
      await this.prisma.company.update({
        where: { id: companyId },
        data: {
          website: dto.website || undefined,
          instagram: dto.instagram || undefined,
          facebook: dto.facebook || undefined,
          youtube: dto.youtube || undefined,
          industry: dto.industry || undefined,
        },
      });

      // Save diagnosis to company memory
      const score = (result.diagnosis as Record<string, unknown>)?.business_health_score ?? 0;
      await this.prisma.memory.create({
        data: {
          companyId,
          type: 'COMPANY',
          title: `Business Doctor Analysis — Score: ${score}/100`,
          content: JSON.stringify(result).substring(0, 5000),
          tags: ['business-doctor', 'diagnosis', dto.industry ?? 'general'],
          source: 'ai-business-doctor',
          importance: 9,
        },
      });

      await this.audit.log({
        companyId,
        actorId: userId,
        action: 'EXECUTE',
        target: 'BusinessDoctor',
        payload: { website: dto.website, score },
        riskLevel: 'LOW',
      });

      return result;
    } catch (err) {
      this.logger.error('Business Doctor analysis failed', err);
      return {
        error: 'AI engine unavailable',
        message: 'Start AI engine: cd ai-engine && uvicorn app.main:app --reload',
        diagnosis: { business_health_score: 0, diagnosis: [] },
        llm: { configured: false, mode: 'offline' },
      };
    }
  }

  /** Streaming analysis — proxies SSE from AI engine */
  async *streamAnalysis(companyId: string, dto: BusinessDoctorInput): AsyncGenerator<string> {
    let response: Response;
    try {
      response = await fetch(`${this.AI_ENGINE}/business-doctor/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: companyId, ...dto }),
        signal: AbortSignal.timeout(120_000),
      });
    } catch {
      yield `data: ${JSON.stringify({ type: 'error', message: 'AI engine unreachable' })}\n\n`;
      yield `data: ${JSON.stringify({ type: 'done' })}\n\n`;
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: d } = await reader.read();
      done = d;
      if (value) yield decoder.decode(value, { stream: !done });
    }
  }

  /** CEO question — growth strategy */
  async askCeo(
    companyId: string,
    question: string,
    healthScore: number,
    diagnosisSummary: string,
  ): Promise<object> {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });

    try {
      const res = await fetch(`${this.AI_ENGINE}/growth/strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: companyId,
          industry: company?.industry ?? '',
          website: company?.website ?? '',
          instagram: company?.instagram ?? '',
          facebook: company?.facebook ?? '',
          youtube: company?.youtube ?? '',
          question,
          health_score: healthScore,
          diagnosis_summary: diagnosisSummary,
        }),
        signal: AbortSignal.timeout(90_000),
      });
      if (!res.ok) throw new Error(`AI engine ${res.status}`);
      return await res.json() as object;
    } catch {
      return { error: 'AI engine unavailable', question };
    }
  }

  /** Get last analysis from company memory */
  async getLastAnalysis(companyId: string) {
    return this.prisma.memory.findFirst({
      where: { companyId, source: 'ai-business-doctor' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
