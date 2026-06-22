import { PrismaClient, AgentTier, RiskLevel, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Demo company
  const company = await prisma.company.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo-company',
      industry: 'Technology',
      locale: 'en',
      domain: 'demo.ai-business-os.com',
    },
  });

  // Admin user
  const hash = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ai-business-os.com' },
    update: {},
    create: {
      companyId: company.id,
      email: 'admin@ai-business-os.com',
      name: 'Admin User',
      passwordHash: hash,
      role: 'OWNER',
      status: 'ACTIVE',
    },
  });

  // Default workspace
  await prisma.workspace.upsert({
    where: { id: company.id },
    update: {},
    create: {
      id: company.id,
      companyId: company.id,
      name: 'Main Workspace',
      description: 'Default AI Business OS workspace',
    },
  });

  // Subscription
  await prisma.subscription.upsert({
    where: { companyId: company.id },
    update: {},
    create: {
      companyId: company.id,
      plan: SubscriptionPlan.PROFESSIONAL,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Agent registry
  const agentDefs = [
    { slug: 'ceo', name: 'CEO Agent', tier: AgentTier.CEO, personality: 'decisive, strategic, concise', goals: ['approve final plans', 'resolve conflicts', 'protect business outcomes'], tools: ['meeting.moderate', 'approval.request', 'report.generate'], kpis: ['plan_roi', 'risk_adjusted_success', 'approval_quality'], costProfile: 'premium', riskLevel: RiskLevel.MEDIUM },
    { slug: 'planner', name: 'Planner Agent', tier: AgentTier.MANAGER, personality: 'structured, careful, routing-focused', goals: ['decompose objectives', 'route work', 'request approvals'], tools: ['memory.search', 'meeting.start', 'workflow.dispatch'], kpis: ['plan_acceptance_rate', 'cycle_time'], costProfile: 'balanced', riskLevel: RiskLevel.MEDIUM },
    { slug: 'seo', name: 'SEO Agent', tier: AgentTier.SPECIALIST, personality: 'analytical, evidence-driven, search-native', goals: ['increase qualified organic traffic', 'publish optimized content'], tools: ['browser.audit', 'wordpress.publish', 'keyword.research', 'serp.analyze'], kpis: ['ranking_delta', 'organic_leads', 'content_velocity'], costProfile: 'economy', riskLevel: RiskLevel.LOW },
    { slug: 'content', name: 'Content Agent', tier: AgentTier.SPECIALIST, personality: 'clear, brand-aware, multilingual', goals: ['create content assets', 'rewrite and translate', 'preserve brand voice'], tools: ['document.generate', 'image.prompt', 'memory.search'], kpis: ['content_acceptance_rate', 'publishing_speed'], costProfile: 'economy', riskLevel: RiskLevel.LOW },
    { slug: 'social', name: 'Social Media Agent', tier: AgentTier.SPECIALIST, personality: 'trend-aware, practical, campaign-minded', goals: ['plan calendars', 'generate captions', 'improve engagement'], tools: ['social.schedule', 'hashtag.research', 'competitor.monitor'], kpis: ['engagement_rate', 'posting_consistency'], costProfile: 'economy', riskLevel: RiskLevel.MEDIUM },
    { slug: 'sales', name: 'Sales Agent', tier: AgentTier.SPECIALIST, personality: 'commercial, responsive, empathetic', goals: ['qualify leads', 'improve response time', 'book meetings'], tools: ['crm.update', 'whatsapp.send', 'email.send'], kpis: ['lead_response_time', 'qualified_rate', 'meetings_booked'], costProfile: 'balanced', riskLevel: RiskLevel.HIGH },
    { slug: 'finance', name: 'Financial Agent', tier: AgentTier.SPECIALIST, personality: 'conservative, precise, compliance-aware', goals: ['estimate budget', 'track costs', 'forecast profit'], tools: ['billing.read', 'invoice.generate', 'wallet.read'], kpis: ['forecast_accuracy', 'cost_variance'], costProfile: 'balanced', riskLevel: RiskLevel.HIGH },
    { slug: 'project-manager', name: 'Project Manager Agent', tier: AgentTier.MANAGER, personality: 'organized, deadline-aware, pragmatic', goals: ['create tasks', 'sequence work', 'track delivery'], tools: ['workflow.dispatch', 'task.create', 'calendar.schedule'], kpis: ['on_time_delivery', 'blocked_task_rate'], costProfile: 'economy', riskLevel: RiskLevel.MEDIUM },
    { slug: 'qa', name: 'QA Agent', tier: AgentTier.QA, personality: 'skeptical, test-driven, quality-focused', goals: ['review outputs', 'catch defects', 'request retries'], tools: ['test.run', 'content.review', 'accessibility.check'], kpis: ['defect_escape_rate', 'review_coverage'], costProfile: 'economy', riskLevel: RiskLevel.LOW },
    { slug: 'security', name: 'Security Agent', tier: AgentTier.SECURITY, personality: 'cautious, policy-first, adversarial', goals: ['block unsafe actions', 'review secrets', 'enforce approvals'], tools: ['policy.evaluate', 'audit.write', 'secrets.scan'], kpis: ['unsafe_action_blocks', 'policy_latency'], costProfile: 'economy', riskLevel: RiskLevel.CRITICAL },
    { slug: 'cost-optimizer', name: 'Cost Optimizer Agent', tier: AgentTier.COST, personality: 'frugal, latency-aware, quality-sensitive', goals: ['route models', 'cache responses', 'estimate cost'], tools: ['model.route', 'cache.lookup', 'usage.record'], kpis: ['cost_per_task', 'quality_per_dollar'], costProfile: 'economy', riskLevel: RiskLevel.LOW },
    { slug: 'website-designer', name: 'Website Designer Agent', tier: AgentTier.SPECIALIST, personality: 'product-minded, visual, accessibility-aware', goals: ['generate websites', 'optimize UX', 'export clean code'], tools: ['code.generate', 'preview.render', 'seo.audit', 'accessibility.check'], kpis: ['lighthouse_score', 'conversion_readiness'], costProfile: 'premium', riskLevel: RiskLevel.MEDIUM },
  ];

  for (const def of agentDefs) {
    await prisma.agent.upsert({
      where: { companyId_slug: { companyId: company.id, slug: def.slug } },
      update: {},
      create: { companyId: company.id, ...def },
    });
  }

  console.log('✅ Seed complete');
  console.log(`   Company: ${company.name} (${company.id})`);
  console.log(`   Admin:   ${admin.email} / Admin@123456`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
