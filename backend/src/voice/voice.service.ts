import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsageService } from '../usage/usage.service';
import * as crypto from 'crypto';

@Injectable()
export class VoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usage: UsageService,
  ) {}

  async createSession(userId: string, companyId: string) {
    const providerToken = this.signVoiceToken(userId, companyId);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const session = await this.prisma.voiceSession.create({
      data: { userId, providerToken, expiresAt },
    });

    await this.usage.record(companyId, session.id, 'VOICE_MINUTES', 0, 'minutes');

    return {
      sessionId: session.id,
      providerToken: session.providerToken,
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  async endSession(sessionId: string, userId: string, durationSeconds: number) {
    const session = await this.prisma.voiceSession.findFirst({ where: { id: sessionId, userId } });
    if (!session) return { message: 'Session not found' };

    const minutes = durationSeconds / 60;
    await this.prisma.voiceSession.update({
      where: { id: sessionId },
      data: { status: 'ended', durationSeconds, endedAt: new Date() },
    });

    const sub = await this.prisma.subscription.findUnique({
      where: { companyId: (await this.prisma.user.findUnique({ where: { id: userId }, select: { companyId: true } }))!.companyId },
    });

    if (sub) {
      await this.usage.record(
        (await this.prisma.user.findUnique({ where: { id: userId }, select: { companyId: true } }))!.companyId,
        sub.id,
        'VOICE_MINUTES',
        minutes,
        'minutes',
      );
    }

    return { message: 'Session ended', durationSeconds };
  }

  async listSessions(userId: string) {
    return this.prisma.voiceSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  private signVoiceToken(userId: string, companyId: string): string {
    const payload = `${userId}:${companyId}:${Date.now()}`;
    const secret = process.env.VOICE_PROVIDER_SECRET ?? 'dev_voice_secret';
    return crypto.createHmac('sha256', secret).update(payload).digest('hex') + '.' + Buffer.from(payload).toString('base64');
  }
}
