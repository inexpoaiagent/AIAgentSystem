from dataclasses import asdict, dataclass
from enum import StrEnum
from hashlib import sha256
from time import time
from uuid import uuid4

from .agents import AGENT_BY_SLUG, AGENTS, AgentDefinition, AgentTier


class ApprovalRequirement(StrEnum):
    NONE = "none"
    HUMAN = "human"
    ADMIN = "admin"


class EventType(StrEnum):
    TASK_PLANNED = "task.planned"
    MEETING_STARTED = "meeting.started"
    AGENT_MESSAGE = "agent.message"
    VOTE_CAST = "vote.cast"
    CONSENSUS_REACHED = "consensus.reached"
    APPROVAL_REQUIRED = "approval.required"
    TOOL_SCHEDULED = "tool.scheduled"
    TRACE_RECORDED = "trace.recorded"


@dataclass(frozen=True)
class Goal:
    id: str
    objective: str
    success_metric: str
    priority: int


@dataclass(frozen=True)
class PlannedTask:
    id: str
    title: str
    agent_slug: str
    priority: int
    tools: tuple[str, ...]
    approval: ApprovalRequirement
    retry_policy: dict[str, int]


@dataclass(frozen=True)
class OrchestrationPlan:
    trace_id: str
    tenant_id: str
    objective: str
    hierarchy: dict[str, list[str]]
    goals: tuple[Goal, ...]
    tasks: tuple[PlannedTask, ...]
    memory_queries: tuple[str, ...]
    estimated_cost_cents: int
    approval_required: bool


class AgentRegistry:
    def all(self) -> tuple[AgentDefinition, ...]:
        return AGENTS

    def get(self, slug: str) -> AgentDefinition:
        return AGENT_BY_SLUG[slug]

    def by_capability(self, objective: str) -> list[AgentDefinition]:
        lowered = objective.lower()
        selected = [AGENT_BY_SLUG["planner"], AGENT_BY_SLUG["ceo"], AGENT_BY_SLUG["qa"], AGENT_BY_SLUG["security"], AGENT_BY_SLUG["cost-optimizer"]]
        routing_rules = {
            "seo": ("seo", "content"),
            "traffic": ("seo", "content"),
            "campaign": ("sales", "social", "content", "finance", "project-manager"),
            "sales": ("sales", "crm", "finance", "project-manager"),
            "lead": ("sales", "social", "project-manager"),
            "social": ("social", "content"),
            "website": ("website-designer", "seo", "content"),
            "landing": ("website-designer", "seo", "content"),
            "budget": ("finance", "cost-optimizer"),
        }
        for term, slugs in routing_rules.items():
            if term in lowered:
                selected.extend(AGENT_BY_SLUG[slug] for slug in slugs if slug in AGENT_BY_SLUG)
        return sorted(set(selected), key=lambda agent: (agent.tier.value, agent.slug))


class CostOptimizer:
    def estimate(self, agents: list[AgentDefinition], objective: str) -> int:
        base = 18 + len(objective) // 40
        multiplier = sum(3 if agent.cost_profile == "premium" else 2 if agent.cost_profile == "balanced" else 1 for agent in agents)
        return base * multiplier

    def route_model(self, risk_level: str, complexity: int) -> str:
        if risk_level in {"critical", "high"} or complexity > 7:
            return "gpt-5-reasoning"
        if complexity > 4:
            return "claude-sonnet-analysis"
        return "deepseek-economy"


class ApprovalPolicy:
    sensitive_tools = {"email.send", "whatsapp.send", "wordpress.publish", "invoice.generate", "deploy.run", "database.write"}

    def requirement_for(self, agent: AgentDefinition, tools: tuple[str, ...], approval_mode: str) -> ApprovalRequirement:
        if approval_mode == "manual":
            return ApprovalRequirement.HUMAN
        if agent.risk_level in {"critical", "high"} or any(tool in self.sensitive_tools for tool in tools):
            return ApprovalRequirement.HUMAN
        return ApprovalRequirement.NONE


class ContextEngine:
    def memory_queries(self, tenant_id: str, objective: str, agents: list[AgentDefinition]) -> tuple[str, ...]:
        agent_queries = tuple(f"tenant:{tenant_id}:agent:{agent.slug}:recent-decisions" for agent in agents)
        return (
            objective,
            f"tenant:{tenant_id}:company-brain",
            f"tenant:{tenant_id}:brand-voice",
            f"tenant:{tenant_id}:customer-behavior",
            *agent_queries,
        )


class EventBus:
    def __init__(self) -> None:
        self.events: list[dict[str, object]] = []

    def publish(self, event_type: EventType, trace_id: str, payload: dict[str, object]) -> None:
        self.events.append({"type": event_type, "trace_id": trace_id, "ts": time(), "payload": payload})


class TaskPlanner:
    def __init__(self, registry: AgentRegistry, approval_policy: ApprovalPolicy) -> None:
        self.registry = registry
        self.approval_policy = approval_policy

    def create_goals(self, objective: str) -> tuple[Goal, ...]:
        return (
            Goal(id=str(uuid4()), objective=objective, success_metric="approved execution plan", priority=100),
            Goal(id=str(uuid4()), objective="Minimize cost while preserving quality", success_metric="cost below budget", priority=80),
            Goal(id=str(uuid4()), objective="Verify safety and quality", success_metric="QA and security sign-off", priority=90),
        )

    def create_tasks(self, agents: list[AgentDefinition], approval_mode: str) -> tuple[PlannedTask, ...]:
        tasks: list[PlannedTask] = []
        for index, agent in enumerate(agents):
            tools = agent.tools[:3]
            tasks.append(
                PlannedTask(
                    id=str(uuid4()),
                    title=f"{agent.name}: contribute to plan",
                    agent_slug=agent.slug,
                    priority=max(10, 100 - index * 5),
                    tools=tools,
                    approval=self.approval_policy.requirement_for(agent, tools, approval_mode),
                    retry_policy={"max_attempts": 3, "backoff_seconds": 30},
                )
            )
        return tuple(tasks)


class MultiAgentOrchestrator:
    def __init__(self) -> None:
        self.registry = AgentRegistry()
        self.approval_policy = ApprovalPolicy()
        self.context_engine = ContextEngine()
        self.cost_optimizer = CostOptimizer()
        self.task_planner = TaskPlanner(self.registry, self.approval_policy)
        self.event_bus = EventBus()

    def plan(self, tenant_id: str, objective: str, approval_mode: str) -> OrchestrationPlan:
        trace_id = sha256(f"{tenant_id}:{objective}:{time()}".encode()).hexdigest()[:24]
        agents = self.registry.by_capability(objective)
        goals = self.task_planner.create_goals(objective)
        tasks = self.task_planner.create_tasks(agents, approval_mode)
        hierarchy = {
            "ceo": [agent.slug for agent in agents if agent.tier == AgentTier.CEO],
            "managers": [agent.slug for agent in agents if agent.tier == AgentTier.MANAGER],
            "specialists": [agent.slug for agent in agents if agent.tier == AgentTier.SPECIALIST],
            "workers": [agent.slug for agent in agents if agent.tier == AgentTier.WORKER],
            "governance": [agent.slug for agent in agents if agent.tier in {AgentTier.QA, AgentTier.SECURITY, AgentTier.COST}],
        }
        plan = OrchestrationPlan(
            trace_id=trace_id,
            tenant_id=tenant_id,
            objective=objective,
            hierarchy=hierarchy,
            goals=goals,
            tasks=tasks,
            memory_queries=self.context_engine.memory_queries(tenant_id, objective, agents),
            estimated_cost_cents=self.cost_optimizer.estimate(agents, objective),
            approval_required=any(task.approval != ApprovalRequirement.NONE for task in tasks),
        )
        self.event_bus.publish(EventType.TASK_PLANNED, trace_id, {"objective": objective, "agents": [agent.slug for agent in agents]})
        return plan

    def serialize_plan(self, plan: OrchestrationPlan) -> dict[str, object]:
        return asdict(plan)
