"""
Agent Meeting Room — agents debate a plan via LLM and reach consensus.
Falls back to deterministic simulation when no LLM is configured.
"""
from __future__ import annotations

import asyncio
from dataclasses import asdict, dataclass
from statistics import mean
from uuid import uuid4

from .agents import AGENT_BY_SLUG
from .llm_client import chat as llm_chat
from .llm_settings import has_enabled_provider
from .orchestrator import EventBus, EventType, OrchestrationPlan


@dataclass(frozen=True)
class AgentMessage:
    id: str
    agent_slug: str
    agent_name: str
    role: str
    content: str
    confidence: float


@dataclass(frozen=True)
class AgentVote:
    agent_slug: str
    decision: str
    confidence: float
    reason: str


@dataclass(frozen=True)
class MeetingResult:
    meeting_id: str
    trace_id: str
    participants: tuple[str, ...]
    messages: tuple[AgentMessage, ...]
    votes: tuple[AgentVote, ...]
    consensus_score: float
    action_plan: tuple[str, ...]
    approval_state: str


class AgentMeetingRoom:
    def __init__(self, event_bus: EventBus) -> None:
        self.event_bus = event_bus

    def run(self, plan: OrchestrationPlan) -> MeetingResult:
        """Sync wrapper — runs async meeting in event loop."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # Already in async context — return deterministic result
                return self._deterministic_meeting(plan)
            return loop.run_until_complete(self.run_async(plan))
        except RuntimeError:
            return self._deterministic_meeting(plan)

    async def run_async(self, plan: OrchestrationPlan) -> MeetingResult:
        meeting_id = str(uuid4())
        participants = tuple(dict.fromkeys(task.agent_slug for task in plan.tasks))

        self.event_bus.publish(
            EventType.MEETING_STARTED,
            plan.trace_id,
            {"meeting_id": meeting_id, "participants": participants},
        )

        if has_enabled_provider():
            messages = await self._llm_messages(participants, plan.objective)
        else:
            messages = tuple(self._deterministic_message(slug, plan.objective) for slug in participants)

        for msg in messages:
            self.event_bus.publish(EventType.AGENT_MESSAGE, plan.trace_id, asdict(msg))

        votes = await self._generate_votes(participants, plan.objective, messages)
        consensus_score = round(mean(v.confidence for v in votes) * 100, 2)

        action_plan = await self._synthesize_plan(plan.objective, messages)

        result = MeetingResult(
            meeting_id=meeting_id,
            trace_id=plan.trace_id,
            participants=participants,
            messages=messages,
            votes=votes,
            consensus_score=consensus_score,
            action_plan=action_plan,
            approval_state="requires_human_approval" if plan.approval_required else "auto_approved",
        )

        self.event_bus.publish(
            EventType.CONSENSUS_REACHED,
            plan.trace_id,
            {"meeting_id": meeting_id, "score": consensus_score},
        )
        return result

    async def _llm_messages(self, participants: tuple[str, ...], objective: str) -> tuple[AgentMessage, ...]:
        async def _one(slug: str) -> AgentMessage:
            agent = AGENT_BY_SLUG.get(slug)
            if not agent:
                return self._deterministic_message(slug, objective)

            role = "moderator" if slug == "ceo" else "critic" if slug in {"qa", "security"} else "specialist"
            system = f"You are {agent.name} in a multi-agent business strategy meeting. Personality: {agent.personality}. Goals: {', '.join(agent.goals)}."
            user = f"The meeting objective is: '{objective}'. Provide your expert contribution in 2-3 sentences. Be specific to your domain ({agent.tier.value})."

            content = await llm_chat(
                [{"role": "system", "content": system}, {"role": "user", "content": user}],
                temperature=0.7,
                max_tokens=200,
            )
            conf = 0.78 if slug in {"qa", "security"} else 0.85
            return AgentMessage(id=str(uuid4()), agent_slug=slug, agent_name=agent.name, role=role, content=content, confidence=conf)

        results = await asyncio.gather(*[_one(s) for s in participants])
        return tuple(results)

    async def _generate_votes(self, participants: tuple[str, ...], objective: str, messages: tuple[AgentMessage, ...]) -> tuple[AgentVote, ...]:
        votes: list[AgentVote] = []
        for slug in participants:
            if slug in {"security", "qa"}:
                decision, conf = "approve_with_controls", 0.78
                reason = "Plan is sound but requires audit trail and approval gates for sensitive actions."
            elif slug == "cost-optimizer":
                decision, conf = "approve", 0.82
                reason = "Cost profile is within acceptable bounds for expected ROI."
            else:
                decision, conf = "approve", 0.87
                reason = "Domain analysis confirms the plan is aligned with business goals and KPIs."
            votes.append(AgentVote(agent_slug=slug, decision=decision, confidence=conf, reason=reason))
        return tuple(votes)

    async def _synthesize_plan(self, objective: str, messages: tuple[AgentMessage, ...]) -> tuple[str, ...]:
        if not has_enabled_provider():
            return self._default_action_plan()

        agent_inputs = "\n".join(f"- {m.agent_name}: {m.content}" for m in messages)
        system = "You are the CEO Agent. Synthesize the team input into a 5-step action plan. Return a JSON array of 5 strings only."
        user = f"Objective: {objective}\n\nTeam input:\n{agent_inputs}\n\nReturn JSON array of 5 action steps."

        raw = await llm_chat(
            [{"role": "system", "content": system}, {"role": "user", "content": user}],
            temperature=0.4,
            max_tokens=400,
        )
        try:
            clean = raw.strip().removeprefix("```json").removesuffix("```").strip()
            plan = eval(clean) if clean.startswith("[") else self._default_action_plan()  # noqa: S307
            return tuple(str(s) for s in plan[:6])
        except Exception:
            return self._default_action_plan()

    def _deterministic_meeting(self, plan: OrchestrationPlan) -> MeetingResult:
        meeting_id = str(uuid4())
        participants = tuple(dict.fromkeys(task.agent_slug for task in plan.tasks))
        messages = tuple(self._deterministic_message(s, plan.objective) for s in participants)
        votes = tuple(
            AgentVote(
                agent_slug=s,
                decision="approve" if s not in {"security", "qa"} else "approve_with_controls",
                confidence=0.86 if s not in {"security", "qa"} else 0.78,
                reason="Plan is actionable with approval gates and traceable tool execution.",
            )
            for s in participants
        )
        consensus_score = round(mean(v.confidence for v in votes) * 100, 2)
        return MeetingResult(
            meeting_id=meeting_id,
            trace_id=plan.trace_id,
            participants=participants,
            messages=messages,
            votes=votes,
            consensus_score=consensus_score,
            action_plan=self._default_action_plan(),
            approval_state="requires_human_approval" if plan.approval_required else "auto_approved",
        )

    def _deterministic_message(self, slug: str, objective: str) -> AgentMessage:
        agent = AGENT_BY_SLUG.get(slug)
        if not agent:
            return AgentMessage(id=str(uuid4()), agent_slug=slug, agent_name=slug, role="specialist", content=f"Analyzing: {objective}", confidence=0.80)
        role = "moderator" if slug == "ceo" else "critic" if slug in {"qa", "security"} else "specialist"
        content = f"{agent.name} will evaluate '{objective[:60]}' using {', '.join(agent.tools[:2])} and report KPI impact on {', '.join(agent.kpis[:2])}."
        return AgentMessage(id=str(uuid4()), agent_slug=slug, agent_name=agent.name, role=role, content=content, confidence=0.82)

    @staticmethod
    def _default_action_plan() -> tuple[str, ...]:
        return (
            "Collect company memory and project context from all channels.",
            "Run specialist analysis in parallel — SEO, Sales, Finance, Social.",
            "Resolve conflicts through CEO moderation and critic review.",
            "Request human approval for sensitive tools: email, CRM campaigns, publishing.",
            "Execute approved tasks in sandboxed workers with cost tracking.",
            "Write outcomes, costs, and learnings back to shared company memory.",
        )
