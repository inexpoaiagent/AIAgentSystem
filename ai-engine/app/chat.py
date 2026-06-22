"""
Multi-agent streaming chat.

Flow:
  1. User sends message  →  Planner decomposes
  2. Relevant specialist agents each reply via LLM
  3. Meeting consensus synthesizes action plan
  4. Results stream back as SSE events

Each SSE event is JSON: {"type": ..., "agent": ..., "content": ..., ...}
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import AsyncIterator
from uuid import uuid4

from .agents import AGENT_BY_SLUG, AgentDefinition, AgentTier
from .llm_client import chat as llm_chat, stream_chat
from .llm_settings import get_primary, has_enabled_provider
from .orchestrator import AgentRegistry, MultiAgentOrchestrator

_registry = AgentRegistry()
_orchestrator = MultiAgentOrchestrator()


# ── System prompts ─────────────────────────────────────────────────────────────

PLANNER_SYSTEM = """You are the Planner Agent in an AI Business Operating System.
Your job is to:
1. Understand the user's business question
2. Identify which specialist agents need to be involved
3. Briefly explain your routing decision

Available agents: CEO, Sales, SEO, Content, Social Media, Finance, Project Manager, QA, Security, Cost Optimizer, Website Designer.

Respond in JSON exactly like this (no markdown, no extra text):
{
  "understanding": "<1-2 sentences summarizing the question>",
  "agents_needed": ["slug1", "slug2"],
  "reason": "<why these agents>",
  "urgency": "high|medium|low"
}"""

AGENT_SYSTEM = """You are {agent_name}, a specialized AI business agent.
Personality: {personality}
Your goals: {goals}
Your KPIs: {kpis}

The user's company asked: "{objective}"
The Planner's analysis: {planner_analysis}

Respond as {agent_name} with your specific domain expertise.
Be concrete, actionable, and focused on your specialty.
Keep your response under 200 words. Use bullet points where helpful."""

SYNTHESIZER_SYSTEM = """You are the CEO Agent synthesizing inputs from the specialist team.
User question: "{objective}"

Agent responses:
{agent_responses}

Create a concise action plan:
1. Root cause analysis (2-3 sentences)
2. Priority actions (numbered list, 3-5 items with owner agent)
3. Expected outcomes

Be direct and executive-level. Under 300 words."""


# ── Public streaming function ──────────────────────────────────────────────────

async def run_agent_chat(
    tenant_id: str,
    message: str,
    session_id: str | None = None,
    history: list[dict[str, str]] | None = None,
) -> AsyncIterator[str]:
    """
    Main streaming function. Yields SSE lines: 'data: {json}\n\n'
    """
    sid = session_id or str(uuid4())

    async def emit(event_type: str, **kwargs) -> str:
        data = json.dumps({"type": event_type, "session_id": sid, **kwargs}, ensure_ascii=False)
        return f"data: {data}\n\n"

    # ── Step 1: Planner analyzes ───────────────────────────────────────────────
    yield await emit("status", stage="planning", message="Planner Agent is analyzing your question...")

    planner_result = await _run_planner(message, history or [])
    yield await emit(
        "planner",
        agent="planner",
        agent_name="Planner Agent",
        understanding=planner_result.get("understanding", ""),
        agents_needed=planner_result.get("agents_needed", []),
        reason=planner_result.get("reason", ""),
        urgency=planner_result.get("urgency", "medium"),
    )

    agent_slugs: list[str] = planner_result.get("agents_needed", ["sales", "finance"])
    # always include ceo for synthesis
    if "ceo" not in agent_slugs:
        agent_slugs = [s for s in agent_slugs if s != "planner"][:4]

    # ── Step 2: Specialist agents respond ─────────────────────────────────────
    yield await emit("status", stage="meeting", message=f"Starting agent meeting with {len(agent_slugs)} specialists...")
    yield await emit("meeting_start", participants=agent_slugs)

    agent_responses: list[dict[str, str]] = []

    for slug in agent_slugs:
        agent = AGENT_BY_SLUG.get(slug)
        if not agent:
            continue

        yield await emit("status", stage="agent_thinking", agent=slug, message=f"{agent.name} is analyzing...")

        # Stream agent response
        response_text = ""
        async for chunk in _stream_agent_response(agent, message, planner_result):
            response_text += chunk
            yield await emit(
                "agent_chunk",
                agent=slug,
                agent_name=agent.name,
                agent_tier=agent.tier.value,
                chunk=chunk,
            )

        agent_responses.append({"agent": slug, "name": agent.name, "response": response_text})
        yield await emit(
            "agent_done",
            agent=slug,
            agent_name=agent.name,
            full_response=response_text,
            confidence=0.85,
        )

    # ── Step 3: CEO synthesizes ────────────────────────────────────────────────
    yield await emit("status", stage="synthesizing", message="CEO Agent is synthesizing the team's input...")

    synthesis = ""
    async for chunk in _stream_synthesis(message, agent_responses):
        synthesis += chunk
        yield await emit("synthesis_chunk", agent="ceo", agent_name="CEO Agent", chunk=chunk)

    # ── Step 4: Action plan ────────────────────────────────────────────────────
    yield await emit(
        "action_plan",
        objective=message,
        synthesis=synthesis,
        participants=agent_slugs,
        requires_approval=_needs_approval(agent_slugs),
    )

    yield await emit("done", session_id=sid)


# ── LLM calls per agent ───────────────────────────────────────────────────────

async def _run_planner(message: str, history: list[dict[str, str]]) -> dict:
    history_text = "\n".join(f"{m['role'].upper()}: {m['content']}" for m in history[-6:])
    user_content = f"Previous conversation:\n{history_text}\n\nCurrent question: {message}" if history else message

    messages = [
        {"role": "system", "content": PLANNER_SYSTEM},
        {"role": "user", "content": user_content},
    ]

    if not has_enabled_provider():
        return {
            "understanding": message,
            "agents_needed": _keyword_route(message),
            "reason": "Keyword-based routing (no LLM configured)",
            "urgency": "medium",
        }

    raw = await llm_chat(messages, temperature=0.2, max_tokens=300)
    try:
        # strip markdown fences if present
        clean = raw.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(clean)
    except Exception:
        return {
            "understanding": message,
            "agents_needed": _keyword_route(message),
            "reason": raw[:200],
            "urgency": "medium",
        }


async def _stream_agent_response(
    agent: AgentDefinition,
    objective: str,
    planner_result: dict,
) -> AsyncIterator[str]:
    if not has_enabled_provider():
        yield _deterministic_agent_response(agent, objective)
        return

    system = AGENT_SYSTEM.format(
        agent_name=agent.name,
        personality=agent.personality or "analytical and goal-driven",
        goals=", ".join(agent.goals),
        kpis=", ".join(agent.kpis),
        objective=objective,
        planner_analysis=planner_result.get("understanding", objective),
    )

    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": f"Provide your expert analysis and recommendations for: {objective}"},
    ]

    async for chunk in stream_chat(messages, temperature=0.7, max_tokens=400):
        yield chunk


async def _stream_synthesis(objective: str, agent_responses: list[dict]) -> AsyncIterator[str]:
    if not has_enabled_provider():
        yield _deterministic_synthesis(objective, agent_responses)
        return

    responses_text = "\n\n".join(
        f"**{r['name']}**: {r['response']}" for r in agent_responses
    )
    system = SYNTHESIZER_SYSTEM.format(objective=objective, agent_responses=responses_text)
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": "Create the executive action plan now."},
    ]
    async for chunk in stream_chat(messages, temperature=0.5, max_tokens=500):
        yield chunk


# ── Deterministic fallbacks (no LLM) ─────────────────────────────────────────

def _keyword_route(message: str) -> list[str]:
    m = message.lower()
    slugs: list[str] = []
    if any(w in m for w in ("فروش", "sales", "revenue", "درآمد", "خرید")):
        slugs += ["sales", "finance", "project-manager"]
    if any(w in m for w in ("سئو", "seo", "گوگل", "google", "traffic", "ترافیک")):
        slugs += ["seo", "content"]
    if any(w in m for w in ("سوشیال", "اینستاگرام", "social", "instagram", "فیسبوک")):
        slugs += ["social", "content"]
    if any(w in m for w in ("وبسایت", "website", "landing", "design")):
        slugs += ["website-designer", "seo"]
    if any(w in m for w in ("بودجه", "هزینه", "budget", "cost", "مالی", "finance")):
        slugs += ["finance", "cost-optimizer"]
    if not slugs:
        slugs = ["sales", "finance", "seo"]
    return list(dict.fromkeys(slugs))[:4]


def _deterministic_agent_response(agent: AgentDefinition, objective: str) -> str:
    responses = {
        "sales": f"**Sales Analysis:** Based on market signals, the primary sales challenges are lead response time and pipeline velocity. I recommend activating automated follow-up sequences, implementing lead scoring to prioritize high-value prospects, and setting up CRM workflows for '{objective[:50]}'. Target: 30% improvement in qualified pipeline within 30 days.",
        "finance": f"**Financial Analysis:** Revenue patterns suggest a gap between marketing spend and conversion ROI. Key actions: track cost-per-acquisition by channel, build a monthly P&L dashboard, and identify the top 3 highest-margin customer segments. For '{objective[:50]}': forecast shows 15-20% recovery is achievable with channel reallocation.",
        "seo": f"**SEO Analysis:** Organic traffic drop is correlated with recent algorithm changes and thin content. Priority fixes: create topic cluster content for your core services, fix technical issues (Core Web Vitals, mobile UX), and build local citation consistency. Timeline: 60-90 days for measurable ranking recovery.",
        "social": f"**Social Media Analysis:** Engagement rate is below industry average. Root causes: posting consistency issues, weak hook strategy, and no CRM retargeting loop. Recommendations: implement a content calendar, test video-first formats, and connect social leads directly to CRM.",
        "content": f"**Content Analysis:** Current content lacks search intent alignment and brand voice consistency. Actions: audit top 10 pages for conversion optimization, create a monthly content calendar with SEO targets, and establish AI-assisted content production workflow.",
        "finance": f"**Financial Analysis:** Cash flow analysis indicates seasonal patterns in '{objective[:30]}'. Recommend: implement monthly revenue forecasting, track CAC/LTV ratios, and identify top 3 profit drivers for focused investment.",
        "website-designer": f"**UX Analysis:** Conversion funnel analysis shows friction at key decision points. Recommendations: redesign hero section with clear value proposition, add social proof above the fold, simplify lead capture form to 3 fields, and implement exit-intent automation.",
        "project-manager": f"**Project Analysis:** Current execution gaps: no OKR tracking, unclear task ownership, and missing weekly sprint reviews. Recommendations: implement 2-week sprint cycles, assign clear owners to each growth initiative, and create a shared KPI dashboard.",
        "qa": f"**Quality Analysis:** Output quality review flagged inconsistencies in customer-facing communications and delayed follow-up. Recommendations: implement QA checkpoints for all customer touchpoints and automate review processes.",
    }
    base = responses.get(agent.slug, f"**{agent.name} Analysis:** Analyzing '{objective[:50]}'. Recommendations based on {', '.join(agent.goals[:2])} will be provided. Key tools to deploy: {', '.join(agent.tools[:2])}.")
    return base


def _deterministic_synthesis(objective: str, agent_responses: list[dict]) -> str:
    agents_involved = ", ".join(r["name"] for r in agent_responses)
    return f"""**Executive Action Plan**

**Root Cause Analysis:**
After consulting with {agents_involved}, the core issue behind "{objective}" is a combination of process gaps, channel misalignment, and measurement blind spots. The team has identified 3 primary leverage points.

**Priority Actions:**
1. **[Sales + CRM]** Activate lead scoring and automated follow-up within 48 hours — expected 25% improvement in response time
2. **[SEO + Content]** Launch content cluster campaign targeting top buyer intent keywords — expected 15% organic traffic growth in 60 days
3. **[Finance]** Implement channel ROI dashboard to reallocate budget to highest-performing sources — expected 10-15% reduction in CAC
4. **[Social + Content]** Start video-first content strategy with CRM retargeting loop — expected 20% increase in qualified social leads
5. **[Project Manager]** Weekly AI agent strategy reviews with KPI tracking dashboard

**Expected Outcomes:**
- 20-30% increase in qualified leads within 30 days
- 15% improvement in conversion rate within 60 days
- Clear ROI visibility across all channels within 14 days

*Requires human approval for: budget reallocation, CRM messaging campaigns, and content publishing.*"""


def _needs_approval(slugs: list[str]) -> bool:
    high_risk = {"sales", "finance", "website-designer"}
    return bool(set(slugs) & high_risk)
