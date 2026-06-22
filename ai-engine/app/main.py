"""
Autonomous Multi-Agent AI OS Engine — FastAPI
All endpoints used by the NestJS control plane and the React frontend.
"""
from __future__ import annotations

import json
from typing import AsyncIterator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from .agents import AGENTS
from .business_doctor import (
    BusinessChannelInput,
    diagnose_business,
    diagnose_business_with_llm,
    generate_growth_strategy,
)
from .chat import run_agent_chat
from .company_ops import (
    CompanyAnalysisInput,
    accounting_dashboard,
    build_connected_channels,
    competitor_intelligence,
    crm_manager_plan,
    growth_strategy,
    meta_ads_workflow,
    wordpress_fix_plan,
)
from .llm_settings import has_enabled_provider, list_providers, save_provider
from .meeting import AgentMeetingRoom
from .orchestrator import MultiAgentOrchestrator
from .tools import TOOLS, create_sandbox_job
from .website_crawler import crawl_website

# ── App setup ──────────────────────────────────────────────────────────────────

app = FastAPI(title="Autonomous Multi-Agent AI OS Engine", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = MultiAgentOrchestrator()


# ── Request models ─────────────────────────────────────────────────────────────

class AgentRequest(BaseModel):
    tenant_id: str = Field(..., description="Company tenant scope")
    user_id: str = Field(default="system")
    message: str
    locale: str = "en"
    approval_mode: str = "manual"


class ChatRequest(BaseModel):
    tenant_id: str
    user_id: str = "system"
    message: str
    session_id: str | None = None
    history: list[dict[str, str]] = Field(default_factory=list)


class SandboxRequest(BaseModel):
    tenant_id: str
    task_id: str
    tool_slug: str


class BusinessDoctorRequest(BaseModel):
    tenant_id: str
    industry: str = ""
    website: str = ""
    instagram: str = ""
    facebook: str = ""
    youtube: str = ""


class CEOQuestionRequest(BusinessDoctorRequest):
    question: str = "Why are sales down?"
    health_score: int = 0
    diagnosis_summary: str = ""


class ProviderSettingsRequest(BaseModel):
    provider: str
    model: str
    api_key: str
    enabled: bool = True


# ── Health ─────────────────────────────────────────────────────────────────────

@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "multi-agent-orchestrator",
        "llm_configured": str(has_enabled_provider()),
    }


# ── Agent / Tool registries ────────────────────────────────────────────────────

@app.get("/agents/registry")
def agent_registry() -> dict[str, object]:
    return {"agents": [agent.__dict__ for agent in AGENTS]}


@app.get("/tools/registry")
def tool_registry() -> dict[str, object]:
    return {"tools": [tool.__dict__ for tool in TOOLS]}


# ── Streaming chat (main user-facing endpoint) ─────────────────────────────────

@app.post("/chat/stream")
async def chat_stream(req: ChatRequest) -> StreamingResponse:
    """
    SSE stream: user message → planner → agent meeting → synthesis.
    Each event: data: {"type": ..., "agent": ..., "content": ...}\n\n
    """
    async def generate() -> AsyncIterator[bytes]:
        async for line in run_agent_chat(
            tenant_id=req.tenant_id,
            message=req.message,
            session_id=req.session_id,
            history=req.history,
        ):
            yield line.encode()

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@app.post("/chat/sync")
async def chat_sync(req: ChatRequest) -> dict[str, object]:
    """Non-streaming version — collects all events and returns as JSON."""
    events: list[dict] = []
    async for line in run_agent_chat(
        tenant_id=req.tenant_id,
        message=req.message,
        session_id=req.session_id,
        history=req.history,
    ):
        line = line.strip()
        if line.startswith("data: "):
            try:
                events.append(json.loads(line[6:]))
            except Exception:
                pass
    return {"events": events, "llm_configured": has_enabled_provider()}


# ── Orchestrator ───────────────────────────────────────────────────────────────

@app.post("/orchestrator/plan")
def create_orchestration_plan(request: AgentRequest) -> dict[str, object]:
    plan = orchestrator.plan(request.tenant_id, request.message, request.approval_mode)
    return orchestrator.serialize_plan(plan)


@app.post("/orchestrator/execute")
async def execute_orchestration(request: AgentRequest) -> dict[str, object]:
    plan = orchestrator.plan(request.tenant_id, request.message, request.approval_mode)
    meeting_room = AgentMeetingRoom(orchestrator.event_bus)
    meeting = await meeting_room.run_async(plan)
    sandbox_jobs = [
        create_sandbox_job(tool, request.tenant_id, task.id)
        for task in plan.tasks
        for tool in task.tools
        if tool in {t.slug for t in TOOLS}
    ]
    return {
        "plan": orchestrator.serialize_plan(plan),
        "meeting": meeting.__dict__,
        "sandbox_jobs": sandbox_jobs,
        "events": orchestrator.event_bus.events[-25:],
    }


@app.post("/meetings/start")
async def start_meeting(request: AgentRequest) -> dict[str, object]:
    plan = orchestrator.plan(request.tenant_id, request.message, request.approval_mode)
    meeting_room = AgentMeetingRoom(orchestrator.event_bus)
    meeting = await meeting_room.run_async(plan)
    result = meeting.__dict__.copy()
    result["messages"] = [m.__dict__ for m in meeting.messages]
    result["votes"] = [v.__dict__ for v in meeting.votes]
    return result


@app.post("/sandbox/jobs")
def sandbox_job(request: SandboxRequest) -> dict[str, object]:
    return create_sandbox_job(request.tool_slug, request.tenant_id, request.task_id)


# ── Business Doctor ────────────────────────────────────────────────────────────

@app.post("/business-doctor/analyze")
async def analyze_business(request: BusinessDoctorRequest) -> dict[str, object]:
    analysis_input = CompanyAnalysisInput(
        tenant_id=request.tenant_id,
        industry=request.industry,
        website=request.website,
        instagram=request.instagram,
        facebook=request.facebook,
        youtube=request.youtube,
    )
    channel_input = BusinessChannelInput(
        tenant_id=request.tenant_id,
        industry=request.industry,
        website=request.website,
        instagram=request.instagram,
        facebook=request.facebook,
        youtube=request.youtube,
    )

    # Crawl website
    website_audit = await crawl_website(request.website) if request.website else None

    # LLM or deterministic diagnosis
    if website_audit:
        diagnosis = await diagnose_business_with_llm(channel_input, website_audit)
    else:
        diagnosis = diagnose_business(channel_input)

    # Orchestration plan for action items
    plan = orchestrator.plan(
        request.tenant_id,
        f"Fix growth, sales, SEO, CRM, social, website, and accounting for {request.industry}",
        "manual",
    )

    return {
        "diagnosis": diagnosis,
        "llm": {
            "configured": has_enabled_provider(),
            "mode": "llm_enhanced" if has_enabled_provider() else "crawler_and_rules",
            "note": "Add provider keys in LLM Management for AI-powered analysis. Crawler and rules run without keys.",
        },
        "channels": build_connected_channels(analysis_input),
        "competitor_intelligence": competitor_intelligence(analysis_input),
        "growth_strategy": growth_strategy(analysis_input),
        "crm_manager": crm_manager_plan(),
        "meta_ads_workflow": meta_ads_workflow(),
        "wordpress_fix_plan": wordpress_fix_plan(),
        "accounting": accounting_dashboard(),
        "orchestration_plan": orchestrator.serialize_plan(plan),
    }


@app.post("/business-doctor/stream")
async def analyze_business_stream(request: BusinessDoctorRequest) -> StreamingResponse:
    """Streaming business doctor — emits progress events as website is crawled."""
    async def generate() -> AsyncIterator[bytes]:
        def evt(data: dict) -> bytes:
            return f"data: {json.dumps(data, ensure_ascii=False)}\n\n".encode()

        yield evt({"type": "status", "stage": "crawling", "message": f"Crawling {request.website}..."})

        website_audit = None
        if request.website:
            website_audit = await crawl_website(request.website)
            yield evt({"type": "crawl_done", "score": website_audit.score, "reachable": website_audit.reachable, "issues": website_audit.issues[:4]})
        else:
            yield evt({"type": "crawl_skip", "message": "No website URL provided"})

        yield evt({"type": "status", "stage": "analyzing", "message": "AI is analyzing your business channels..."})

        channel_input = BusinessChannelInput(
            tenant_id=request.tenant_id, industry=request.industry,
            website=request.website, instagram=request.instagram,
            facebook=request.facebook, youtube=request.youtube,
        )

        if website_audit:
            diagnosis = await diagnose_business_with_llm(channel_input, website_audit)
        else:
            diagnosis = diagnose_business(channel_input)

        yield evt({"type": "diagnosis", "data": diagnosis})

        yield evt({"type": "status", "stage": "growth", "message": "Building growth strategy..."})
        gs = growth_strategy(CompanyAnalysisInput(
            tenant_id=request.tenant_id, industry=request.industry,
            website=request.website, instagram=request.instagram,
            facebook=request.facebook, youtube=request.youtube,
        ))
        yield evt({"type": "growth_strategy", "data": gs})

        yield evt({"type": "done"})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── CEO / Growth ───────────────────────────────────────────────────────────────

@app.post("/growth/strategy")
async def create_growth_strategy(request: CEOQuestionRequest) -> dict[str, object]:
    channel_input = BusinessChannelInput(
        tenant_id=request.tenant_id, industry=request.industry,
        website=request.website, instagram=request.instagram,
        facebook=request.facebook, youtube=request.youtube,
    )
    strategy = await generate_growth_strategy(
        channel_input,
        request.question,
        request.health_score,
        request.diagnosis_summary,
    )
    plan = orchestrator.plan(request.tenant_id, request.question, "manual")
    meeting_room = AgentMeetingRoom(orchestrator.event_bus)
    meeting = await meeting_room.run_async(plan)
    return {
        "question": request.question,
        "strategy": strategy,
        "meeting": {
            "meeting_id": meeting.meeting_id,
            "participants": meeting.participants,
            "consensus_score": meeting.consensus_score,
            "action_plan": meeting.action_plan,
            "messages": [m.__dict__ for m in meeting.messages],
        },
        "llm_configured": has_enabled_provider(),
    }


# ── CRM / Accounting ──────────────────────────────────────────────────────────

@app.get("/crm/manager-plan")
def get_crm_manager_plan() -> dict[str, object]:
    return crm_manager_plan()


@app.get("/accounting/dashboard")
def get_accounting_dashboard() -> dict[str, object]:
    return accounting_dashboard()


@app.post("/automations/meta-ads")
def create_meta_ads_workflow() -> dict[str, object]:
    return meta_ads_workflow()


@app.post("/automations/wordpress-fix")
def create_wordpress_fix_workflow() -> dict[str, object]:
    return wordpress_fix_plan()


# ── Integrations ───────────────────────────────────────────────────────────────

@app.post("/integrations/connect")
def connect_integrations(request: BusinessDoctorRequest) -> dict[str, object]:
    return {
        "tenant_id": request.tenant_id,
        "channels": build_connected_channels(CompanyAnalysisInput(
            tenant_id=request.tenant_id, industry=request.industry,
            website=request.website, instagram=request.instagram,
            facebook=request.facebook, youtube=request.youtube,
        )),
        "oauth_providers": ["instagram_graph", "facebook_graph", "youtube_data", "wordpress", "whatsapp_business"],
    }


@app.post("/competitors/analyze")
def analyze_competitors(request: BusinessDoctorRequest) -> dict[str, object]:
    return competitor_intelligence(CompanyAnalysisInput(
        tenant_id=request.tenant_id, industry=request.industry,
        website=request.website, instagram=request.instagram,
        facebook=request.facebook, youtube=request.youtube,
    ))


# ── LLM Settings ──────────────────────────────────────────────────────────────

@app.get("/settings/providers")
def get_provider_settings() -> dict[str, object]:
    return {"providers": list_providers(), "llm_configured": has_enabled_provider()}


@app.post("/settings/providers")
def set_provider_settings(request: ProviderSettingsRequest) -> dict[str, object]:
    if not request.api_key.strip():
        return {"error": "api_key_required", "providers": list_providers(), "llm_configured": has_enabled_provider()}
    provider = save_provider(request.provider, request.model, request.api_key, request.enabled)
    return {"provider": provider, "providers": list_providers(), "llm_configured": has_enabled_provider()}
