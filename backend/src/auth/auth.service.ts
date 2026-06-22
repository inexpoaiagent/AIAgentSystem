import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AgentTier, RiskLevel, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const slug = dto.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60);

    const uniqueSlug = `${slug}-${uuidv4().substring(0, 6)}`;

    const company = await this.prisma.company.create({
      data: {
        name: dto.companyName,
        slug: uniqueSlug,
        industry: dto.industry,
        locale: dto.locale ?? 'en',
      },
    });

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        companyId: company.id,
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: 'OWNER',
        status: 'ACTIVE',
        locale: dto.locale ?? 'en',
      },
    });

    // Default workspace
    await this.prisma.workspace.create({
      data: { companyId: company.id, name: 'Main Workspace' },
    });

    // 14-day trial subscription
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await this.prisma.subscription.create({
      data: {
        companyId: company.id,
        plan: SubscriptionPlan.STARTER,
        status: SubscriptionStatus.TRIALING,
        trialEndsAt: trialEnd,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEnd,
      },
    });

    // Seed default agent registry
    await this.seedAgents(company.id);

    const tokens = await this.issueTokens(user.id, company.id, user.role);
    return { user: this.sanitize(user), company, ...tokens };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const tokens = await this.issueTokens(user.id, user.companyId, user.role, ipAddress, userAgent);
    return { user: this.sanitize(user), company: user.company, ...tokens };
  }

  async refresh(refreshToken: string) {
    const sessions = await this.prisma.userSession.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: { include: { company: true } } },
    });

    const matched = await (async () => {
      for (const s of sessions) {
        if (await bcrypt.compare(refreshToken, s.refreshTokenHash)) return s;
      }
      return null;
    })();

    if (!matched) throw new UnauthorizedException('Invalid or expired refresh token');

    await this.prisma.userSession.update({ where: { id: matched.id }, data: { revokedAt: new Date() } });

    const { user } = matched;
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('Account inactive');

    const tokens = await this.issueTokens(user.id, user.companyId, user.role);
    return { user: this.sanitize(user), company: user.company, ...tokens };
  }

  async logout(sessionRefreshToken: string) {
    const sessions = await this.prisma.userSession.findMany({
      where: { revokedAt: null },
    });
    for (const s of sessions) {
      if (await bcrypt.compare(sessionRefreshToken, s.refreshTokenHash)) {
        await this.prisma.userSession.update({ where: { id: s.id }, data: { revokedAt: new Date() } });
        return { message: 'Logged out successfully' };
      }
    }
    return { message: 'Logged out' };
  }

  private async issueTokens(
    userId: string,
    companyId: string,
    role: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const payload = { sub: userId, companyId, role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = uuidv4() + '-' + uuidv4();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.userSession.create({
      data: { userId, refreshTokenHash, ipAddress, userAgent, expiresAt },
    });

    return { accessToken, refreshToken, expiresAt };
  }

  private sanitize(user: { id: string; email: string; name: string; role: string; companyId: string; avatarUrl: string | null; locale: string }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      avatarUrl: user.avatarUrl,
      locale: user.locale,
    };
  }

  private async seedAgents(companyId: string) {
    const defs = [
      { slug: 'ceo', name: 'CEO Agent', tier: AgentTier.CEO, goals: ['approve final plans', 'resolve conflicts'], tools: ['meeting.moderate', 'approval.request'], kpis: ['plan_roi'], costProfile: 'premium', riskLevel: RiskLevel.MEDIUM },
      { slug: 'planner', name: 'Planner Agent', tier: AgentTier.MANAGER, goals: ['decompose objectives', 'route work'], tools: ['memory.search', 'workflow.dispatch'], kpis: ['plan_acceptance_rate'], costProfile: 'balanced', riskLevel: RiskLevel.MEDIUM },
      { slug: 'seo', name: 'SEO Agent', tier: AgentTier.SPECIALIST, goals: ['increase organic traffic'], tools: ['browser.audit', 'keyword.research'], kpis: ['ranking_delta'], costProfile: 'economy', riskLevel: RiskLevel.LOW },
      { slug: 'content', name: 'Content Agent', tier: AgentTier.SPECIALIST, goals: ['create content assets'], tools: ['document.generate'], kpis: ['content_acceptance_rate'], costProfile: 'economy', riskLevel: RiskLevel.LOW },
      { slug: 'social', name: 'Social Media Agent', tier: AgentTier.SPECIALIST, goals: ['plan calendars', 'improve engagement'], tools: ['social.schedule'], kpis: ['engagement_rate'], costProfile: 'economy', riskLevel: RiskLevel.MEDIUM },
      { slug: 'sales', name: 'Sales Agent', tier: AgentTier.SPECIALIST, goals: ['qualify leads'], tools: ['crm.update', 'email.send'], kpis: ['lead_response_time'], costProfile: 'balanced', riskLevel: RiskLevel.HIGH },
      { slug: 'finance', name: 'Financial Agent', tier: AgentTier.SPECIALIST, goals: ['track costs', 'forecast profit'], tools: ['billing.read', 'invoice.generate'], kpis: ['forecast_accuracy'], costProfile: 'balanced', riskLevel: RiskLevel.HIGH },
      { slug: 'qa', name: 'QA Agent', tier: AgentTier.QA, goals: ['review outputs', 'catch defects'], tools: ['test.run', 'content.review'], kpis: ['defect_escape_rate'], costProfile: 'economy', riskLevel: RiskLevel.LOW },
      { slug: 'security', name: 'Security Agent', tier: AgentTier.SECURITY, goals: ['block unsafe actions'], tools: ['policy.evaluate', 'audit.write'], kpis: ['unsafe_action_blocks'], costProfile: 'economy', riskLevel: RiskLevel.CRITICAL },
      { slug: 'website-designer', name: 'Website Designer Agent', tier: AgentTier.SPECIALIST, goals: ['generate websites'], tools: ['code.generate', 'seo.audit'], kpis: ['lighthouse_score'], costProfile: 'premium', riskLevel: RiskLevel.MEDIUM },
    ];

    await this.prisma.agent.createMany({
      data: defs.map((d) => ({ companyId, ...d })),
      skipDuplicates: true,
    });
  }
}
