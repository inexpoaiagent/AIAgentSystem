from fastapi import FastAPI
from pydantic import BaseModel, Field

from .agents import AGENTS
from .meeting import AgentMeetingRoom
from .orchestrator import MultiAgentOrchestrator
from .tools import TOOLS, create_sandbox_job

app = FastAPI(title="Autonomous Multi-Agent AI OS Engine", version="0.2.0")
orchestrator = MultiAgentOrchestrator()


class AgentRequest(BaseModel):
    tenant_id: str = Field(..., description="Company tenant scope")
    user_id: str
    message: str
    locale: str = "en"
    approval_mode: str = "manual"


class SandboxRequest(BaseModel):
    tenant_id: str
    task_id: str
    tool_slug: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "multi-agent-orchestrator"}


@app.get("/agents/registry")
def agent_registry() -> dict[str, object]:
    return {"agents": [agent.__dict__ for agent in AGENTS]}


@app.get("/tools/registry")
def tool_registry() -> dict[str, object]:
    return {"tools": [tool.__dict__ for tool in TOOLS]}


@app.post("/orchestrator/plan")
def create_orchestration_plan(request: AgentRequest) -> dict[str, object]:
    plan = orchestrator.plan(request.tenant_id, request.message, request.approval_mode)
    return orchestrator.serialize_plan(plan)


@app.post("/orchestrator/execute")
def execute_orchestration(request: AgentRequest) -> dict[str, object]:
    plan = orchestrator.plan(request.tenant_id, request.message, request.approval_mode)
    meeting = AgentMeetingRoom(orchestrator.event_bus).run(plan)
    sandbox_jobs = [
        create_sandbox_job(tool, request.tenant_id, task.id)
        for task in plan.tasks
        for tool in task.tools
        if tool in {tool_definition.slug for tool_definition in TOOLS}
    ]
    return {
        "plan": orchestrator.serialize_plan(plan),
        "meeting": meeting.__dict__,
        "sandbox_jobs": sandbox_jobs,
        "events": orchestrator.event_bus.events[-25:],
    }


@app.post("/meetings/start")
def start_meeting(request: AgentRequest) -> dict[str, object]:
    plan = orchestrator.plan(request.tenant_id, request.message, request.approval_mode)
    meeting = AgentMeetingRoom(orchestrator.event_bus).run(plan)
    return meeting.__dict__


@app.post("/sandbox/jobs")
def sandbox_job(request: SandboxRequest) -> dict[str, object]:
    return create_sandbox_job(request.tool_slug, request.tenant_id, request.task_id)
