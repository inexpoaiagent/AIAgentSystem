from dataclasses import asdict, dataclass
from statistics import mean
from uuid import uuid4

from .agents import AGENT_BY_SLUG
from .orchestrator import EventBus, EventType, OrchestrationPlan


@dataclass(frozen=True)
class AgentMessage:
    id: str
    agent_slug: str
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
        meeting_id = str(uuid4())
        participants = tuple(task.agent_slug for task in plan.tasks)
        self.event_bus.publish(EventType.MEETING_STARTED, plan.trace_id, {"meeting_id": meeting_id, "participants": participants})

        messages = tuple(self._message_for(agent_slug, plan.objective) for agent_slug in participants)
        for message in messages:
            self.event_bus.publish(EventType.AGENT_MESSAGE, plan.trace_id, asdict(message))

        votes = tuple(
            AgentVote(
                agent_slug=agent_slug,
                decision="approve" if agent_slug not in {"security", "qa"} else "approve_with_controls",
                confidence=0.86 if agent_slug not in {"security", "qa"} else 0.78,
                reason="Plan is actionable with approval gates and traceable tool execution.",
            )
            for agent_slug in participants
        )
        consensus_score = round(mean(vote.confidence for vote in votes) * 100, 2)
        result = MeetingResult(
            meeting_id=meeting_id,
            trace_id=plan.trace_id,
            participants=participants,
            messages=messages,
            votes=votes,
            consensus_score=consensus_score,
            action_plan=(
                "Collect company memory and project context.",
                "Run specialist analysis in parallel.",
                "Resolve conflicts through CEO and critic review.",
                "Request human approval for sensitive tools.",
                "Execute approved tasks in sandboxed workers.",
                "Write outcomes, costs, and learnings back to shared memory.",
            ),
            approval_state="requires_human_approval" if plan.approval_required else "auto_approved",
        )
        self.event_bus.publish(EventType.CONSENSUS_REACHED, plan.trace_id, {"meeting_id": meeting_id, "score": consensus_score})
        return result

    def _message_for(self, agent_slug: str, objective: str) -> AgentMessage:
        agent = AGENT_BY_SLUG[agent_slug]
        role = "moderator" if agent_slug == "ceo" else "critic" if agent_slug in {"qa", "security"} else "specialist"
        return AgentMessage(
            id=str(uuid4()),
            agent_slug=agent_slug,
            role=role,
            content=f"{agent.name} will evaluate '{objective}' using {', '.join(agent.tools[:2])} and report KPI impact.",
            confidence=0.82,
        )
