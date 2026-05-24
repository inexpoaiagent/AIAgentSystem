from dataclasses import dataclass
from enum import StrEnum


class AgentTier(StrEnum):
    CEO = "ceo"
    MANAGER = "manager"
    SPECIALIST = "specialist"
    WORKER = "worker"
    QA = "qa"
    SECURITY = "security"
    COST = "cost"


@dataclass(frozen=True)
class AgentDefinition:
    slug: str
    name: str
    tier: AgentTier
    personality: str
    goals: tuple[str, ...]
    tools: tuple[str, ...]
    kpis: tuple[str, ...]
    cost_profile: str
    risk_level: str


AGENTS: tuple[AgentDefinition, ...] = (
    AgentDefinition(
        slug="ceo",
        name="CEO Agent",
        tier=AgentTier.CEO,
        personality="decisive, strategic, concise",
        goals=("approve final plans", "resolve conflicts", "protect business outcomes"),
        tools=("meeting.moderate", "approval.request", "report.generate"),
        kpis=("plan_roi", "risk_adjusted_success", "approval_quality"),
        cost_profile="premium",
        risk_level="medium",
    ),
    AgentDefinition(
        slug="planner",
        name="Planner Agent",
        tier=AgentTier.MANAGER,
        personality="structured, careful, routing-focused",
        goals=("decompose objectives", "route work", "request approvals"),
        tools=("memory.search", "meeting.start", "workflow.dispatch"),
        kpis=("plan_acceptance_rate", "cycle_time"),
        cost_profile="balanced",
        risk_level="medium",
    ),
    AgentDefinition(
        slug="seo",
        name="SEO Agent",
        tier=AgentTier.SPECIALIST,
        personality="analytical, evidence-driven, search-native",
        goals=("increase qualified organic traffic", "publish optimized content"),
        tools=("browser.audit", "wordpress.publish", "keyword.research", "serp.analyze"),
        kpis=("ranking_delta", "organic_leads", "content_velocity"),
        cost_profile="economy",
        risk_level="low",
    ),
    AgentDefinition(
        slug="content",
        name="Content Agent",
        tier=AgentTier.SPECIALIST,
        personality="clear, brand-aware, multilingual",
        goals=("create content assets", "rewrite and translate", "preserve brand voice"),
        tools=("document.generate", "image.prompt", "memory.search"),
        kpis=("content_acceptance_rate", "publishing_speed"),
        cost_profile="economy",
        risk_level="low",
    ),
    AgentDefinition(
        slug="social",
        name="Social Media Agent",
        tier=AgentTier.SPECIALIST,
        personality="trend-aware, practical, campaign-minded",
        goals=("plan calendars", "generate captions", "improve engagement"),
        tools=("social.schedule", "hashtag.research", "competitor.monitor"),
        kpis=("engagement_rate", "posting_consistency"),
        cost_profile="economy",
        risk_level="medium",
    ),
    AgentDefinition(
        slug="sales",
        name="Sales Agent",
        tier=AgentTier.SPECIALIST,
        personality="commercial, responsive, empathetic",
        goals=("qualify leads", "improve response time", "book meetings"),
        tools=("crm.update", "whatsapp.send", "email.send"),
        kpis=("lead_response_time", "qualified_rate", "meetings_booked"),
        cost_profile="balanced",
        risk_level="high",
    ),
    AgentDefinition(
        slug="finance",
        name="Financial Agent",
        tier=AgentTier.SPECIALIST,
        personality="conservative, precise, compliance-aware",
        goals=("estimate budget", "track costs", "forecast profit"),
        tools=("billing.read", "invoice.generate", "wallet.read"),
        kpis=("forecast_accuracy", "cost_variance"),
        cost_profile="balanced",
        risk_level="high",
    ),
    AgentDefinition(
        slug="project-manager",
        name="Project Manager Agent",
        tier=AgentTier.MANAGER,
        personality="organized, deadline-aware, pragmatic",
        goals=("create tasks", "sequence work", "track delivery"),
        tools=("workflow.dispatch", "task.create", "calendar.schedule"),
        kpis=("on_time_delivery", "blocked_task_rate"),
        cost_profile="economy",
        risk_level="medium",
    ),
    AgentDefinition(
        slug="qa",
        name="QA Agent",
        tier=AgentTier.QA,
        personality="skeptical, test-driven, quality-focused",
        goals=("review outputs", "catch defects", "request retries"),
        tools=("test.run", "content.review", "accessibility.check"),
        kpis=("defect_escape_rate", "review_coverage"),
        cost_profile="economy",
        risk_level="low",
    ),
    AgentDefinition(
        slug="security",
        name="Security Agent",
        tier=AgentTier.SECURITY,
        personality="cautious, policy-first, adversarial",
        goals=("block unsafe actions", "review secrets", "enforce approvals"),
        tools=("policy.evaluate", "audit.write", "secrets.scan"),
        kpis=("unsafe_action_blocks", "policy_latency"),
        cost_profile="economy",
        risk_level="critical",
    ),
    AgentDefinition(
        slug="cost-optimizer",
        name="Cost Optimizer Agent",
        tier=AgentTier.COST,
        personality="frugal, latency-aware, quality-sensitive",
        goals=("route models", "cache responses", "estimate cost"),
        tools=("model.route", "cache.lookup", "usage.record"),
        kpis=("cost_per_task", "quality_per_dollar"),
        cost_profile="economy",
        risk_level="low",
    ),
    AgentDefinition(
        slug="website-designer",
        name="Website Designer Agent",
        tier=AgentTier.SPECIALIST,
        personality="product-minded, visual, accessibility-aware",
        goals=("generate websites", "optimize UX", "export clean code"),
        tools=("code.generate", "preview.render", "seo.audit", "accessibility.check"),
        kpis=("lighthouse_score", "conversion_readiness"),
        cost_profile="premium",
        risk_level="medium",
    ),
)


AGENT_BY_SLUG = {agent.slug: agent for agent in AGENTS}
