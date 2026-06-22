import { PrismaClient, AgentTier, RiskLevel, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Ensure utf8mb4 for emoji support
  await prisma.$executeRawUnsafe('SET NAMES utf8mb4');

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

  // ─── Industry Packs ───────────────────────────────────────────────────────
  const packs = [
    {
      slug: 'construction', name: 'Construction', emoji: '🏗️',
      tagline: 'Your AI Construction Management Team',
      valueProposition: 'Deliver projects on time, control costs, and win more contracts — all managed by AI agents working 24/7.',
      targetCustomers: JSON.stringify(['Construction Companies', 'General Contractors', 'Real Estate Developers', 'Builders & Subcontractors']),
      painPoints: JSON.stringify(['Project delays costing thousands per day', 'Uncontrolled procurement & material costs', 'Weak lead pipeline and sales follow-up', 'No real-time project progress visibility', 'Manual reporting takes hours every week']),
      agents: JSON.stringify([
        { slug: 'project-manager', name: 'AI Project Manager', role: 'MANAGER', description: 'Tracks milestones, flags delays, updates stakeholders automatically', icon: '📋' },
        { slug: 'procurement-manager', name: 'AI Procurement Manager', role: 'SPECIALIST', description: 'Compares supplier prices, manages POs, tracks material delivery', icon: '🛒' },
        { slug: 'cost-controller', name: 'AI Cost Controller', role: 'SPECIALIST', description: 'Monitors budget vs actuals, flags overruns, forecasts final cost', icon: '💰' },
        { slug: 'sales-agent', name: 'AI Sales Agent', role: 'SPECIALIST', description: 'Qualifies construction leads, sends proposals, follows up automatically', icon: '🤝' },
        { slug: 'crm-agent', name: 'AI CRM Agent', role: 'WORKER', description: 'Manages client relationships, tracks communication history', icon: '📞' },
        { slug: 'marketing-agent', name: 'AI Marketing Agent', role: 'WORKER', description: 'Creates project showcases, LinkedIn posts, before/after content', icon: '📣' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Synthesises project portfolio health and strategic decisions', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '30% fewer delays', description: 'AI monitors every milestone and escalates early' },
        { metric: '15% cost savings', description: 'Better procurement and early overrun detection' },
        { metric: '3× more leads', description: 'Automated outreach and follow-up pipeline' },
        { metric: '10h/week saved', description: 'Automated reporting and stakeholder updates' },
      ]),
      kpis: JSON.stringify(['Active Projects', 'On-Time Rate', 'Budget Variance', 'New Leads', 'Proposals Sent', 'Win Rate']),
      tier: 'professional', price: 299, color: '#F59E0B', gradientFrom: '#78350F', gradientTo: '#B45309', sortOrder: 1,
    },
    {
      slug: 'real-estate', name: 'Real Estate', emoji: '🏠',
      tagline: 'Your AI Real Estate Sales Force',
      valueProposition: 'Generate more qualified leads, close deals faster, and dominate your local market with 8 AI agents working non-stop.',
      targetCustomers: JSON.stringify(['Real Estate Agencies', 'Property Developers', 'Brokers & Agents', 'Property Management Companies']),
      painPoints: JSON.stringify(['Inconsistent lead generation month to month', 'Slow follow-up causes leads to go cold', 'No time to create property marketing content', 'CRM data is outdated and incomplete', 'Poor Google / social media visibility']),
      agents: JSON.stringify([
        { slug: 'lead-hunter', name: 'AI Lead Hunter', role: 'SPECIALIST', description: 'Finds buyer and seller leads from social, web, and portals 24/7', icon: '🎯' },
        { slug: 'sales-agent', name: 'AI Sales Agent', role: 'SPECIALIST', description: 'Qualifies leads, schedules viewings, sends personalised proposals', icon: '🤝' },
        { slug: 'crm-agent', name: 'AI CRM Agent', role: 'WORKER', description: 'Keeps every contact updated, follow-up reminders automated', icon: '📇' },
        { slug: 'property-marketing', name: 'AI Property Marketing', role: 'SPECIALIST', description: 'Creates listing descriptions, social posts, email campaigns per property', icon: '📸' },
        { slug: 'call-center', name: 'AI Call Center', role: 'SPECIALIST', description: 'Answers inbound inquiries, qualifies callers, books appointments', icon: '📞' },
        { slug: 'seo-agent', name: 'AI SEO Agent', role: 'SPECIALIST', description: 'Optimises agency website and property listings for Google search', icon: '🔍' },
        { slug: 'social-agent', name: 'AI Social Media Agent', role: 'WORKER', description: 'Publishes daily property content on Instagram, Facebook, LinkedIn', icon: '📱' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Weekly business performance review and 90-day growth strategy', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '5× more leads', description: 'Multi-channel AI prospecting never stops' },
        { metric: '60% faster follow-up', description: 'AI responds to inquiries in under 60 seconds' },
        { metric: '40% more listings', description: 'Content creation at scale attracts sellers' },
        { metric: 'Top 3 Google rank', description: 'AI SEO for local property searches' },
      ]),
      kpis: JSON.stringify(['New Leads', 'Viewings Booked', 'Active Listings', 'Deals Closed', 'Avg Days on Market', 'Revenue']),
      tier: 'professional', price: 299, color: '#3B82F6', gradientFrom: '#1E3A5F', gradientTo: '#1D4ED8', sortOrder: 2,
    },
    {
      slug: 'clinic', name: 'Medical Clinic', emoji: '🏥',
      tagline: 'Your AI Medical Practice Manager',
      valueProposition: 'Fill your appointment calendar, reduce no-shows, and grow patient reviews — while your staff focuses on care.',
      targetCustomers: JSON.stringify(['Medical Clinics', 'Dental Clinics', 'Specialist Doctors', 'Physiotherapy Centers']),
      painPoints: JSON.stringify(['Empty appointment slots wasting clinic capacity', 'High no-show rate without reminders', 'Negative reviews going unmanaged', 'Marketing budget wasted on wrong channels', 'Reception staff overwhelmed with calls']),
      agents: JSON.stringify([
        { slug: 'receptionist', name: 'AI Receptionist', role: 'SPECIALIST', description: 'Answers calls, books appointments, handles inquiries 24/7', icon: '🗓️' },
        { slug: 'appointment-agent', name: 'AI Appointment Agent', role: 'WORKER', description: 'Sends reminders, reduces no-shows, manages cancellations', icon: '⏰' },
        { slug: 'call-center', name: 'AI Call Center', role: 'SPECIALIST', description: 'Handles patient follow-up calls and post-visit check-ins', icon: '📞' },
        { slug: 'marketing-agent', name: 'AI Marketing Agent', role: 'SPECIALIST', description: 'Creates health content, seasonal campaigns, patient education posts', icon: '📣' },
        { slug: 'crm-agent', name: 'AI CRM Agent', role: 'WORKER', description: 'Tracks patient history, visit frequency, and re-engagement', icon: '📋' },
        { slug: 'reputation-manager', name: 'AI Reputation Manager', role: 'SPECIALIST', description: 'Monitors and responds to Google and health platform reviews', icon: '⭐' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Monthly clinic performance report and growth recommendations', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '40% fewer no-shows', description: 'Automated multi-channel appointment reminders' },
        { metric: '2× new patients', description: 'AI marketing and reputation management' },
        { metric: '4.8★ average rating', description: 'Proactive review collection and response' },
        { metric: 'Save 2 FTE', description: 'AI receptionist handles 80% of inbound calls' },
      ]),
      kpis: JSON.stringify(['Appointments Today', 'No-Show Rate', 'New Patients', 'Google Rating', 'Monthly Revenue', 'Patient Retention']),
      tier: 'professional', price: 299, color: '#10B981', gradientFrom: '#064E3B', gradientTo: '#047857', sortOrder: 3,
    },
    {
      slug: 'restaurant', name: 'Restaurant', emoji: '🍽️',
      tagline: 'Your AI Restaurant Operations Team',
      valueProposition: 'Fill more tables, own your online reputation, and grow loyal customers with an AI team that never sleeps.',
      targetCustomers: JSON.stringify(['Restaurants', 'Cafes & Coffee Shops', 'Cloud Kitchens', 'Catering Companies']),
      painPoints: JSON.stringify(['Inconsistent table reservations and empty off-peak hours', 'Negative reviews damaging reputation online', 'No budget for a full marketing team', 'Low repeat customer rate', 'Manual social media posting eating time']),
      agents: JSON.stringify([
        { slug: 'reservation-agent', name: 'AI Reservation Agent', role: 'SPECIALIST', description: 'Handles online and phone reservations, manages table availability', icon: '🪑' },
        { slug: 'marketing-agent', name: 'AI Marketing Agent', role: 'SPECIALIST', description: 'Creates promotional campaigns, special offers, event announcements', icon: '📣' },
        { slug: 'social-agent', name: 'AI Social Media Agent', role: 'WORKER', description: 'Daily food photos descriptions, stories, hashtags, engagement', icon: '📱' },
        { slug: 'review-manager', name: 'AI Review Manager', role: 'SPECIALIST', description: 'Monitors Google, TripAdvisor, Zomato and responds to every review', icon: '⭐' },
        { slug: 'crm-agent', name: 'AI CRM Agent', role: 'WORKER', description: 'Tracks regulars, birthday campaigns, loyalty programme management', icon: '❤️' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Weekly revenue analysis and menu performance insights', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '30% more covers', description: 'AI fills off-peak slots with targeted promotions' },
        { metric: '4.7★ rating', description: 'Every review responded to within 2 hours' },
        { metric: '25% repeat rate', description: 'Loyalty campaigns bring customers back' },
        { metric: 'Daily social presence', description: 'Content posted every day without effort' },
      ]),
      kpis: JSON.stringify(['Reservations Today', 'Table Occupancy %', 'Google Rating', 'Repeat Customers', 'Social Reach', 'Weekly Revenue']),
      tier: 'professional', price: 299, color: '#EF4444', gradientFrom: '#7F1D1D', gradientTo: '#B91C1C', sortOrder: 4,
    },
    {
      slug: 'university', name: 'University / School', emoji: '🎓',
      tagline: 'Your AI Education Operations Team',
      valueProposition: 'Increase enrolments, support students 24/7, and automate administrative workload with purpose-built education AI.',
      targetCustomers: JSON.stringify(['Private Universities', 'Training Institutes', 'Schools', 'Online Course Platforms']),
      painPoints: JSON.stringify(['Low enrolment and slow student recruitment pipeline', 'Students cannot get answers outside office hours', 'Marketing budget producing poor ROI', 'Admin staff buried in repetitive queries', 'No data on student dropout risk']),
      agents: JSON.stringify([
        { slug: 'admissions-agent', name: 'AI Admissions Agent', role: 'SPECIALIST', description: 'Qualifies prospective students, books info sessions, follows up', icon: '🎯' },
        { slug: 'student-advisor', name: 'AI Student Advisor', role: 'SPECIALIST', description: 'Answers student queries about courses, fees, schedules 24/7', icon: '💬' },
        { slug: 'call-center', name: 'AI Call Center', role: 'SPECIALIST', description: 'Handles inbound calls for admissions and student support', icon: '📞' },
        { slug: 'marketing-agent', name: 'AI Marketing Agent', role: 'SPECIALIST', description: 'Creates enrolment campaigns, open day promotions, testimonial content', icon: '📣' },
        { slug: 'crm-agent', name: 'AI CRM Agent', role: 'WORKER', description: 'Tracks prospective and current students through their lifecycle', icon: '📋' },
        { slug: 'research-assistant', name: 'AI Research Assistant', role: 'WORKER', description: 'Summarises papers, assists faculty with literature reviews', icon: '📚' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Enrolment trend analysis and institutional performance dashboard', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '3× enrolment leads', description: 'AI admissions pipeline running 24/7' },
        { metric: '80% query automation', description: 'AI student advisor handles repetitive questions' },
        { metric: '50% admin cost saved', description: 'Automated scheduling, reminders, and follow-ups' },
        { metric: 'Higher retention', description: 'Early dropout risk detection and intervention' },
      ]),
      kpis: JSON.stringify(['Prospective Students', 'Applications Received', 'Enrolment Rate', 'Student Satisfaction', 'Query Response Time', 'Retention Rate']),
      tier: 'gold', price: 999, color: '#8B5CF6', gradientFrom: '#2E1065', gradientTo: '#6D28D9', sortOrder: 5,
    },
    {
      slug: 'ecommerce', name: 'E-Commerce', emoji: '🛒',
      tagline: 'Your AI E-Commerce Growth Engine',
      valueProposition: 'Scale revenue, reduce cart abandonment, and dominate Google Shopping — with an AI team that optimises your store 24/7.',
      targetCustomers: JSON.stringify(['Online Stores', 'D2C Brands', 'Dropshipping Businesses', 'Amazon / Noon Sellers']),
      painPoints: JSON.stringify(['High cart abandonment with no follow-up', 'Poor Google and marketplace SEO rankings', 'Rising ad costs with declining ROAS', 'No time to manage customer support volume', 'No data-driven product or pricing decisions']),
      agents: JSON.stringify([
        { slug: 'product-manager', name: 'AI Product Manager', role: 'MANAGER', description: 'Analyses best-sellers, flags slow movers, suggests pricing changes', icon: '📦' },
        { slug: 'ads-agent', name: 'AI Ads Agent', role: 'SPECIALIST', description: 'Manages Google and Meta ad campaigns, optimises ROAS daily', icon: '📊' },
        { slug: 'seo-agent', name: 'AI SEO Agent', role: 'SPECIALIST', description: 'Optimises product titles, descriptions, and category pages for search', icon: '🔍' },
        { slug: 'customer-support', name: 'AI Customer Support', role: 'SPECIALIST', description: 'Handles returns, queries, order status, and complaints instantly', icon: '💬' },
        { slug: 'crm-agent', name: 'AI CRM Agent', role: 'WORKER', description: 'Cart abandonment recovery, repeat purchase campaigns, VIP segmentation', icon: '❤️' },
        { slug: 'sales-agent', name: 'AI Sales Agent', role: 'SPECIALIST', description: 'Upsell and cross-sell recommendations via email and chat', icon: '🤝' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Weekly revenue intelligence report and growth strategy', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '25% more revenue', description: 'AI cart recovery and upsell automation' },
        { metric: '3× organic traffic', description: 'AI SEO for every product page' },
        { metric: '60% faster support', description: 'AI handles 80% of customer queries instantly' },
        { metric: 'Higher ROAS', description: 'Daily ad optimisation by AI' },
      ]),
      kpis: JSON.stringify(['Daily Orders', 'Revenue', 'Cart Abandonment Rate', 'ROAS', 'Organic Traffic', 'Customer Support CSAT']),
      tier: 'professional', price: 299, color: '#F97316', gradientFrom: '#7C2D12', gradientTo: '#C2410C', sortOrder: 6,
    },
    {
      slug: 'law-firm', name: 'Law Firm', emoji: '⚖️',
      tagline: 'Your AI Legal Practice Growth Team',
      valueProposition: 'Convert more consultation requests, handle client intake automatically, and grow your firm\'s authority online.',
      targetCustomers: JSON.stringify(['Law Firms', 'Solo Practitioners', 'Legal Consultants', 'Notary Offices']),
      painPoints: JSON.stringify(['Slow or missed responses to consultation requests', 'Time wasted on non-billable admin and intake', 'Low online visibility in competitive legal market', 'Inconsistent client communication and follow-up', 'No system to track leads and conversion rates']),
      agents: JSON.stringify([
        { slug: 'intake-agent', name: 'AI Intake Agent', role: 'SPECIALIST', description: 'Qualifies new client enquiries, collects case details, books consultations', icon: '📝' },
        { slug: 'crm-agent', name: 'AI CRM Agent', role: 'WORKER', description: 'Tracks all client interactions, deadlines, follow-ups', icon: '📋' },
        { slug: 'document-assistant', name: 'AI Document Assistant', role: 'SPECIALIST', description: 'Drafts standard letters, NDAs, contracts, and legal summaries', icon: '📄' },
        { slug: 'marketing-agent', name: 'AI Marketing Agent', role: 'SPECIALIST', description: 'Creates legal articles, LinkedIn thought leadership, case study posts', icon: '📣' },
        { slug: 'call-center', name: 'AI Call Center', role: 'SPECIALIST', description: 'Answers inbound calls, pre-qualifies callers, routes to the right attorney', icon: '📞' },
        { slug: 'seo-agent', name: 'AI SEO Agent', role: 'WORKER', description: 'Optimises firm website for practice area keywords and local search', icon: '🔍' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Monthly firm performance review, pipeline health, revenue forecast', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '3× consultation bookings', description: 'AI intake never misses a new client enquiry' },
        { metric: '5h/week saved per attorney', description: 'AI drafts routine documents and client updates' },
        { metric: 'Top 5 local Google rank', description: 'AI SEO for practice area + city searches' },
        { metric: '90% lead response rate', description: 'Every enquiry responded to in under 5 minutes' },
      ]),
      kpis: JSON.stringify(['New Enquiries', 'Consultations Booked', 'Cases Won', 'Billable Hours', 'Google Ranking', 'Monthly Revenue']),
      tier: 'gold', price: 999, color: '#6366F1', gradientFrom: '#1E1B4B', gradientTo: '#4338CA', sortOrder: 7,
    },
    {
      slug: 'hotel', name: 'Hotel / Hospitality', emoji: '🏨',
      tagline: 'Your AI Hotel Revenue & Guest Experience Team',
      valueProposition: 'Maximise occupancy, automate guest communication, and build a 5-star online reputation with AI hospitality agents.',
      targetCustomers: JSON.stringify(['Hotels', 'Boutique Stays', 'Serviced Apartments', 'Resort Properties']),
      painPoints: JSON.stringify(['Low direct bookings — too dependent on OTAs', 'Slow response to guest inquiries and reviews', 'No personalised upselling or loyalty programme', 'High cost of front desk and concierge staff', 'Poor online reputation management']),
      agents: JSON.stringify([
        { slug: 'booking-agent', name: 'AI Booking Agent', role: 'SPECIALIST', description: 'Handles direct booking inquiries, availability checks, and confirmation', icon: '🗓️' },
        { slug: 'guest-experience', name: 'AI Guest Experience Agent', role: 'SPECIALIST', description: 'Pre-arrival messages, in-stay requests, check-out follow-up', icon: '🛎️' },
        { slug: 'call-center', name: 'AI Call Center', role: 'SPECIALIST', description: 'Answers phone inquiries, handles requests, routes to departments', icon: '📞' },
        { slug: 'reputation-manager', name: 'AI Reputation Manager', role: 'SPECIALIST', description: 'Monitors Booking.com, TripAdvisor, Google and responds to reviews', icon: '⭐' },
        { slug: 'marketing-agent', name: 'AI Marketing Agent', role: 'SPECIALIST', description: 'Creates seasonal packages, flash sales, loyalty campaigns', icon: '📣' },
        { slug: 'revenue-manager', name: 'AI Revenue Manager', role: 'WORKER', description: 'Monitors competitor pricing, suggests dynamic rate adjustments', icon: '💰' },
        { slug: 'ceo-assistant', name: 'AI CEO Assistant', role: 'CEO', description: 'Weekly RevPAR analysis, occupancy forecast, and strategy review', icon: '👑' },
      ]),
      outcomes: JSON.stringify([
        { metric: '20% more direct bookings', description: 'AI converts website visitors to direct guests' },
        { metric: '4.9★ on all platforms', description: 'Every review replied to within 1 hour' },
        { metric: '15% higher ADR', description: 'AI upsells upgrades and packages to every guest' },
        { metric: 'Save 1 FTE', description: 'AI handles 70% of front desk inquiries' },
      ]),
      kpis: JSON.stringify(['Occupancy Rate', 'RevPAR', 'Direct Bookings %', 'Guest Rating', 'Review Response Rate', 'ADR']),
      tier: 'gold', price: 999, color: '#14B8A6', gradientFrom: '#042F2E', gradientTo: '#0F766E', sortOrder: 8,
    },
  ];

  for (const pack of packs) {
    await prisma.industryPack.upsert({
      where: { slug: pack.slug },
      update: pack,
      create: pack,
    });
  }

  console.log(`   Packs:   ${packs.length} industry packs seeded`);

  // ─── Business Categories ───────────────────────────────────────────────────
  const categories = [
    { slug: 'construction', name: 'Construction & Real Estate', emoji: '🏗️', sortOrder: 1 },
    { slug: 'food-beverage', name: 'Food & Beverage', emoji: '🍽️', sortOrder: 2 },
    { slug: 'healthcare', name: 'Healthcare & Wellness', emoji: '🏥', sortOrder: 3 },
    { slug: 'education', name: 'Education & Training', emoji: '🎓', sortOrder: 4 },
    { slug: 'retail-ecommerce', name: 'Retail & E-Commerce', emoji: '🛒', sortOrder: 5 },
    { slug: 'legal-finance', name: 'Legal & Financial Services', emoji: '⚖️', sortOrder: 6 },
    { slug: 'hospitality', name: 'Hotel & Hospitality', emoji: '🏨', sortOrder: 7 },
    { slug: 'technology', name: 'Technology & Software', emoji: '💻', sortOrder: 8 },
    { slug: 'manufacturing', name: 'Manufacturing & Industry', emoji: '🏭', sortOrder: 9 },
    { slug: 'marketing-agency', name: 'Marketing & Creative Agency', emoji: '🎨', sortOrder: 10 },
    { slug: 'logistics', name: 'Logistics & Transportation', emoji: '🚚', sortOrder: 11 },
    { slug: 'other', name: 'Other / General Business', emoji: '🏢', sortOrder: 12 },
  ];

  for (const cat of categories) {
    await prisma.businessCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log(`   Categories: ${categories.length} business categories seeded`);

  console.log('✅ Seed complete');
  console.log(`   Company: ${company.name} (${company.id})`);
  console.log(`   Admin:   ${admin.email} / Admin@123456`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
