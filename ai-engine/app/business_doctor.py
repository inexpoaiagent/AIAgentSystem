from dataclasses import dataclass


@dataclass(frozen=True)
class BusinessChannelInput:
    tenant_id: str
    industry: str
    website: str
    instagram: str
    facebook: str
    youtube: str


def diagnose_business(input_data: BusinessChannelInput) -> dict[str, object]:
    modules = [
        {
            "area": "technical_seo",
            "score": 61,
            "issues": ["weak local schema", "slow mobile pages", "missing topic clusters"],
            "agents": ["seo", "content", "website-designer"],
        },
        {
            "area": "website_conversion",
            "score": 68,
            "issues": ["lead form friction", "weak hero CTA", "unclear trust signals"],
            "agents": ["website-designer", "sales", "qa"],
        },
        {
            "area": "social_growth",
            "score": 54,
            "issues": ["low save/share ratio", "weak video hooks", "no CRM retargeting loop"],
            "agents": ["social", "content", "sales"],
        },
        {
            "area": "lead_management",
            "score": 49,
            "issues": ["slow response time", "no lead scoring", "manual assignment"],
            "agents": ["crm", "sales", "project-manager"],
        },
        {
            "area": "finance",
            "score": 72,
            "issues": ["ROI not tracked by channel", "no projected revenue dashboard"],
            "agents": ["finance", "cost-optimizer"],
        },
    ]
    score = round(sum(module["score"] for module in modules) / len(modules))
    return {
        "tenant_id": input_data.tenant_id,
        "industry": input_data.industry,
        "channels": {
            "website": input_data.website,
            "instagram": input_data.instagram,
            "facebook": input_data.facebook,
            "youtube": input_data.youtube,
        },
        "business_health_score": score,
        "diagnosis": modules,
        "recommended_agent_team": [
            "ceo",
            "planner",
            "seo",
            "content",
            "social",
            "sales",
            "finance",
            "website-designer",
            "qa",
            "security",
            "cost-optimizer",
        ],
        "next_actions": [
            "Launch AI CRM and lead scoring",
            "Create Facebook lead campaign with CRM sync",
            "Generate SEO content cluster",
            "Redesign conversion-focused landing page",
            "Create accounting and ROI dashboard",
            "Schedule weekly AI agent strategy meeting",
        ],
    }
