from dataclasses import dataclass
from enum import StrEnum
from uuid import uuid4


class ToolRisk(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass(frozen=True)
class ToolDefinition:
    slug: str
    name: str
    risk: ToolRisk
    requires_sandbox: bool
    requires_human_approval: bool
    resource_limits: dict[str, int]


TOOLS: tuple[ToolDefinition, ...] = (
    ToolDefinition("browser.audit", "Browser Audit", ToolRisk.LOW, True, False, {"cpu": 1, "memory_mb": 512, "timeout_seconds": 120}),
    ToolDefinition("website.crawl", "Website Crawler", ToolRisk.LOW, True, False, {"cpu": 1, "memory_mb": 768, "timeout_seconds": 180}),
    ToolDefinition("instagram.graph.read", "Instagram Graph Read", ToolRisk.MEDIUM, False, False, {"timeout_seconds": 60}),
    ToolDefinition("facebook.graph.read", "Facebook Graph Read", ToolRisk.MEDIUM, False, False, {"timeout_seconds": 60}),
    ToolDefinition("youtube.analytics.read", "YouTube Analytics Read", ToolRisk.MEDIUM, False, False, {"timeout_seconds": 60}),
    ToolDefinition("meta.ads.create_campaign", "Meta Ads Campaign", ToolRisk.HIGH, False, True, {"timeout_seconds": 90}),
    ToolDefinition("wordpress.publish", "WordPress Publish", ToolRisk.HIGH, True, True, {"cpu": 1, "memory_mb": 512, "timeout_seconds": 180}),
    ToolDefinition("wordpress.fix_site", "WordPress Site Fix", ToolRisk.HIGH, True, True, {"cpu": 1, "memory_mb": 1024, "timeout_seconds": 300}),
    ToolDefinition("email.send", "Email Send", ToolRisk.HIGH, False, True, {"timeout_seconds": 30}),
    ToolDefinition("whatsapp.send", "WhatsApp Send", ToolRisk.HIGH, False, True, {"timeout_seconds": 30}),
    ToolDefinition("invoice.generate", "Invoice Generate", ToolRisk.HIGH, False, True, {"timeout_seconds": 30}),
    ToolDefinition("code.generate", "Code Generate", ToolRisk.MEDIUM, True, False, {"cpu": 2, "memory_mb": 2048, "timeout_seconds": 300}),
    ToolDefinition("deploy.run", "Deployment", ToolRisk.CRITICAL, True, True, {"cpu": 2, "memory_mb": 2048, "timeout_seconds": 600}),
)

TOOL_BY_SLUG = {tool.slug: tool for tool in TOOLS}


def create_sandbox_job(tool_slug: str, tenant_id: str, task_id: str) -> dict[str, object]:
    tool = TOOL_BY_SLUG[tool_slug]
    return {
        "job_id": str(uuid4()),
        "tenant_id": tenant_id,
        "task_id": task_id,
        "tool": tool.slug,
        "runtime": "docker" if tool.requires_sandbox else "trusted-worker",
        "network_policy": "restricted",
        "filesystem": "ephemeral",
        "resource_limits": tool.resource_limits,
        "requires_human_approval": tool.requires_human_approval,
    }
