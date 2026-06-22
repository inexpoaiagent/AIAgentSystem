from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass(frozen=True)
class ConnectedChannel:
    provider: str
    url: str
    status: str
    scopes: tuple[str, ...]
    next_sync: str


@dataclass(frozen=True)
class CompanyAnalysisInput:
    tenant_id: str
    industry: str
    website: str
    instagram: str
    facebook: str
    youtube: str


def build_connected_channels(input_data: CompanyAnalysisInput) -> list[dict[str, object]]:
    return [
        ConnectedChannel("website_crawler", input_data.website, "ready", ("crawl", "seo_audit", "ux_audit"), "15 minutes").__dict__,
        ConnectedChannel("instagram_graph", input_data.instagram, "oauth_required", ("instagram_basic", "instagram_manage_insights"), "after OAuth").__dict__,
        ConnectedChannel("facebook_graph", input_data.facebook, "oauth_required", ("pages_read_engagement", "leads_retrieval", "ads_management"), "after OAuth").__dict__,
        ConnectedChannel("youtube_data", input_data.youtube, "api_key_required", ("youtube.readonly", "analytics.readonly"), "after API key").__dict__,
    ]


def competitor_intelligence(input_data: CompanyAnalysisInput) -> dict[str, object]:
    domain = urlparse(input_data.website).netloc or "company.example"
    competitors = [
        {
            "name": "Market leader",
            "domain": f"top-{domain}",
            "why_ahead": ["higher topical authority", "more trust signals", "better lead capture flow"],
            "opportunity": "Create local landing pages and property intent clusters.",
        },
        {
            "name": "Social competitor",
            "domain": "instagram.com/luxury-property-benchmark",
            "why_ahead": ["stronger reels hooks", "clearer inquiry CTA", "consistent weekly cadence"],
            "opportunity": "Run 30-day short-form video campaign synced to CRM.",
        },
        {
            "name": "Paid ads competitor",
            "domain": "facebook.com/real-estate-growth-benchmark",
            "why_ahead": ["retargeting active", "lead forms connected", "offer is more specific"],
            "opportunity": "Launch Meta lead campaign with approval and budget guardrails.",
        },
    ]
    return {
        "tenant_id": input_data.tenant_id,
        "competitors": competitors,
        "strategic_gap": "Competitors convert faster because content, paid leads, and CRM follow-up are connected.",
    }


def growth_strategy(input_data: CompanyAnalysisInput) -> dict[str, object]:
    return {
        "objective": "Recover sales growth by connecting acquisition, CRM, website conversion, and finance visibility.",
        "why_sales_are_down": [
            "Hot leads are not scored or assigned quickly enough.",
            "Website traffic is not converted through a focused offer and low-friction form.",
            "Social engagement is not connected to CRM retargeting.",
            "SEO content does not cover enough buying-intent topics.",
            "Campaign ROI is not tied to invoices, expenses, and profit forecast.",
        ],
        "90_day_plan": [
            {"week": "1-2", "work": "Connect APIs, crawl website, import leads, create CRM pipeline.", "owner": "Planner + CRM"},
            {"week": "3-4", "work": "Fix website conversion issues and prepare WordPress automation.", "owner": "Website + QA"},
            {"week": "5-8", "work": "Launch SEO content cluster and Meta lead workflow after approval.", "owner": "SEO + Social"},
            {"week": "9-12", "work": "Optimize budget, forecast profit, and review weekly AI board meetings.", "owner": "Finance + CEO"},
        ],
        "kpis": ["lead response time", "qualified lead rate", "organic rankings", "cost per lead", "profit forecast accuracy"],
    }


def crm_manager_plan() -> dict[str, object]:
    stages = [
        {"name": "New", "automation": "capture from web forms, Meta leads, and manual import", "score_min": 0},
        {"name": "Qualified", "automation": "AI lead scoring above 70 or strong intent signal", "score_min": 70},
        {"name": "Viewing / Demo", "automation": "calendar scheduling and reminder workflow", "score_min": 80},
        {"name": "Proposal", "automation": "proposal generation and objection handling", "score_min": 85},
        {"name": "Closed", "automation": "invoice, onboarding, review request, referral workflow", "score_min": 90},
    ]
    return {
        "pipeline": stages,
        "lead_scoring_model": {
            "budget": 25,
            "urgency": 20,
            "engagement": 20,
            "source_quality": 15,
            "property_match": 15,
            "negative_signals": -20,
        },
        "manager_actions": ["deduplicate leads", "assign hot leads", "draft follow-up", "create tasks", "sync with campaigns"],
    }


def meta_ads_workflow() -> dict[str, object]:
    return {
        "name": "Meta lead campaign with CRM sync",
        "approval_required": True,
        "risk_level": "high",
        "steps": [
            "Build audience from website and Instagram engagement.",
            "Generate campaign offer and ad copy.",
            "Create lead form fields mapped to CRM.",
            "Estimate budget and cost per lead.",
            "Request human approval before spend.",
            "Sync approved leads to AI CRM Manager.",
        ],
    }


def wordpress_fix_plan() -> dict[str, object]:
    return {
        "approval_required": True,
        "risk_level": "high",
        "automation": [
            "Run crawler and Core Web Vitals audit.",
            "Generate schema, meta titles, and service page fixes.",
            "Prepare WordPress draft changes in sandbox.",
            "Capture screenshots before and after.",
            "Request approval before publish or deploy.",
        ],
    }


def accounting_dashboard() -> dict[str, object]:
    invoices = [
        {"number": "INV-1024", "customer": "Palm Heights Buyer", "amount": 12500, "status": "paid"},
        {"number": "INV-1025", "customer": "Marina Investor Lead", "amount": 8200, "status": "sent"},
        {"number": "INV-1026", "customer": "Downtown Lease Client", "amount": 4300, "status": "draft"},
    ]
    expenses = [
        {"category": "Meta ads", "amount": 2400},
        {"category": "Content production", "amount": 1800},
        {"category": "AI operations", "amount": 620},
    ]
    revenue = sum(invoice["amount"] for invoice in invoices)
    cost = sum(expense["amount"] for expense in expenses)
    return {
        "invoices": invoices,
        "expenses": expenses,
        "forecast": {
            "monthly_revenue": revenue,
            "monthly_expense": cost,
            "projected_profit": revenue - cost,
            "next_month_profit_forecast": round((revenue - cost) * 1.18),
        },
    }
