"""
AI Business Doctor — crawls website + social channels, then uses LLM to generate
a real diagnosis with health score, issues, and 90-day action plan.
"""
from __future__ import annotations

import json
from dataclasses import dataclass

from .llm_client import chat as llm_chat
from .llm_settings import has_enabled_provider
from .website_crawler import WebsiteAudit


@dataclass(frozen=True)
class BusinessChannelInput:
    tenant_id: str
    industry: str
    website: str
    instagram: str
    facebook: str
    youtube: str


# ── LLM prompt ────────────────────────────────────────────────────────────────

_DIAGNOSIS_PROMPT = """You are an AI Business Doctor analyzing a {industry} company.

Website audit results:
- URL: {website}
- Reachable: {reachable}
- Load time: {load_time_ms}ms
- Title: {title}
- Meta description: {meta_description}
- H1 tags: {h1}
- Images missing alt: {images_missing_alt}
- Forms found: {forms}
- Robots.txt: {robots_txt}
- Sitemap.xml: {sitemap_xml}
- Crawler issues: {crawler_issues}
- Crawler score: {crawler_score}/100

Social channels:
- Instagram: {instagram}
- Facebook: {facebook}
- YouTube: {youtube}

Return ONLY valid JSON (no markdown) in this exact structure:
{{
  "diagnosis": [
    {{
      "area": "technical_seo",
      "score": <0-100>,
      "issues": ["issue1", "issue2"],
      "quick_wins": ["action1", "action2"],
      "agents": ["seo", "content"]
    }},
    {{
      "area": "website_conversion",
      "score": <0-100>,
      "issues": ["issue1", "issue2"],
      "quick_wins": ["action1"],
      "agents": ["website-designer", "sales", "qa"]
    }},
    {{
      "area": "social_growth",
      "score": <0-100>,
      "issues": ["issue1"],
      "quick_wins": ["action1"],
      "agents": ["social", "content"]
    }},
    {{
      "area": "lead_management",
      "score": <0-100>,
      "issues": ["issue1"],
      "quick_wins": ["action1"],
      "agents": ["sales", "project-manager"]
    }},
    {{
      "area": "financial_visibility",
      "score": <0-100>,
      "issues": ["issue1"],
      "quick_wins": ["action1"],
      "agents": ["finance", "cost-optimizer"]
    }}
  ],
  "next_actions": ["action1", "action2", "action3"],
  "ninety_day_plan": [
    {{"week": "Week 1-2", "work": "...", "owner": "seo"}},
    {{"week": "Week 3-4", "work": "...", "owner": "sales"}},
    {{"week": "Week 5-8", "work": "...", "owner": "content"}},
    {{"week": "Week 9-12", "work": "...", "owner": "finance"}}
  ],
  "recommended_agent_team": ["ceo", "planner", "seo", "sales", "content", "finance"],
  "competitor_gaps": ["gap1", "gap2"]
}}"""

_GROWTH_STRATEGY_PROMPT = """You are a senior growth strategist for a {industry} business.

Business context:
- Website: {website} (health score: {health_score}/100)
- Social: Instagram {instagram}, Facebook {facebook}, YouTube {youtube}
- Question: {question}
- Diagnosis: {diagnosis_summary}

Provide a concrete growth strategy. Return JSON only:
{{
  "root_causes": ["cause1", "cause2", "cause3"],
  "strategy": {{
    "objective": "...",
    "why_performance_is_down": ["reason1", "reason2"],
    "quick_wins": [
      {{"action": "...", "owner": "agent_slug", "timeline": "48h", "expected_impact": "..."}}
    ],
    "medium_term": [
      {{"action": "...", "owner": "agent_slug", "timeline": "30 days", "expected_impact": "..."}}
    ]
  }},
  "kpis": ["kpi1", "kpi2", "kpi3"]
}}"""


# ── Main diagnosis function ────────────────────────────────────────────────────

async def diagnose_business_with_llm(
    input_data: BusinessChannelInput,
    website_audit: WebsiteAudit,
) -> dict:
    """Full LLM-powered business diagnosis."""
    if not has_enabled_provider():
        return _fallback_diagnosis(input_data, website_audit)

    prompt = _DIAGNOSIS_PROMPT.format(
        industry=input_data.industry or "general business",
        website=input_data.website,
        reachable=website_audit.reachable,
        load_time_ms=website_audit.load_time_ms or "unknown",
        title=website_audit.title or "missing",
        meta_description=website_audit.meta_description or "missing",
        h1=", ".join(website_audit.h1[:3]) or "missing",
        images_missing_alt=website_audit.images_missing_alt,
        forms=website_audit.forms,
        robots_txt=website_audit.robots_txt,
        sitemap_xml=website_audit.sitemap_xml,
        crawler_issues="; ".join(website_audit.issues[:4]),
        crawler_score=website_audit.score,
        instagram=input_data.instagram or "not provided",
        facebook=input_data.facebook or "not provided",
        youtube=input_data.youtube or "not provided",
    )

    raw = await llm_chat(
        [{"role": "system", "content": "You are an AI business analyst. Always respond with valid JSON only."},
         {"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2000,
    )

    try:
        clean = raw.strip().removeprefix("```json").removesuffix("```").strip()
        result = json.loads(clean)
        # Inject crawler data into first module
        if result.get("diagnosis"):
            result["diagnosis"][0]["crawler"] = website_audit.__dict__
            result["diagnosis"][0]["score"] = min(
                result["diagnosis"][0].get("score", 60),
                website_audit.score,
            )
        health = round(sum(m["score"] for m in result["diagnosis"]) / len(result["diagnosis"]))
        result["business_health_score"] = health
        result["tenant_id"] = input_data.tenant_id
        result["industry"] = input_data.industry
        result["channels"] = {
            "website": input_data.website,
            "instagram": input_data.instagram,
            "facebook": input_data.facebook,
            "youtube": input_data.youtube,
        }
        return result
    except Exception:
        return _fallback_diagnosis(input_data, website_audit)


async def generate_growth_strategy(
    input_data: BusinessChannelInput,
    question: str,
    health_score: int,
    diagnosis_summary: str,
) -> dict:
    """LLM-powered growth strategy for a specific CEO question."""
    if not has_enabled_provider():
        return _fallback_growth_strategy(input_data, question)

    prompt = _GROWTH_STRATEGY_PROMPT.format(
        industry=input_data.industry or "general business",
        website=input_data.website,
        health_score=health_score,
        instagram=input_data.instagram or "none",
        facebook=input_data.facebook or "none",
        youtube=input_data.youtube or "none",
        question=question,
        diagnosis_summary=diagnosis_summary,
    )

    raw = await llm_chat(
        [{"role": "system", "content": "You are a senior business growth strategist. Return JSON only."},
         {"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=1500,
    )

    try:
        clean = raw.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(clean)
    except Exception:
        return _fallback_growth_strategy(input_data, question)


# ── Deterministic fallback ─────────────────────────────────────────────────────

def _fallback_diagnosis(input_data: BusinessChannelInput, audit: WebsiteAudit) -> dict:
    has_insta = bool(input_data.instagram)
    has_fb = bool(input_data.facebook)

    modules = [
        {
            "area": "technical_seo",
            "score": audit.score,
            "issues": audit.issues[:4],
            "quick_wins": audit.recommendations[:3],
            "agents": ["seo", "content", "website-designer"],
            "crawler": audit.__dict__,
        },
        {
            "area": "website_conversion",
            "score": 65 if audit.forms > 0 else 45,
            "issues": (["No lead capture form found"] if audit.forms == 0 else []) + ["Unclear value proposition", "Weak trust signals"],
            "quick_wins": ["Add above-fold CTA", "Add testimonials section", "Simplify lead form to 3 fields"],
            "agents": ["website-designer", "sales", "qa"],
        },
        {
            "area": "social_growth",
            "score": 55 if has_insta else 30,
            "issues": (["Instagram not connected"] if not has_insta else ["Low save/share ratio", "Inconsistent posting"]) + ([] if has_fb else ["Facebook not connected"]),
            "quick_wins": ["Create 4-week content calendar", "Start video Reels strategy", "Connect social leads to CRM"],
            "agents": ["social", "content"],
        },
        {
            "area": "lead_management",
            "score": 48,
            "issues": ["No automated lead scoring", "Slow response time > 5 minutes", "Manual lead assignment"],
            "quick_wins": ["Implement AI lead scoring", "Set up instant response automation", "Create CRM pipeline stages"],
            "agents": ["sales", "project-manager"],
        },
        {
            "area": "financial_visibility",
            "score": 70,
            "issues": ["ROI not tracked by channel", "No profit forecast dashboard"],
            "quick_wins": ["Build monthly P&L dashboard", "Track CAC/LTV by source", "Set revenue targets by agent"],
            "agents": ["finance", "cost-optimizer"],
        },
    ]
    health = round(sum(m["score"] for m in modules) / len(modules))

    return {
        "tenant_id": input_data.tenant_id,
        "industry": input_data.industry,
        "channels": {"website": input_data.website, "instagram": input_data.instagram, "facebook": input_data.facebook, "youtube": input_data.youtube},
        "business_health_score": health,
        "diagnosis": modules,
        "next_actions": [
            "Activate AI CRM with lead scoring",
            "Launch Facebook/Instagram lead campaign",
            "Generate SEO content cluster for top buyer keywords",
            "Redesign landing page hero section",
            "Set up accounting and ROI tracking dashboard",
        ],
        "ninety_day_plan": [
            {"week": "Week 1-2", "work": "CRM setup, lead scoring, instant response automation", "owner": "sales"},
            {"week": "Week 3-4", "work": "SEO audit fix, content cluster creation", "owner": "seo"},
            {"week": "Week 5-8", "work": "Social media calendar, video content, retargeting", "owner": "social"},
            {"week": "Week 9-12", "work": "ROI dashboard, channel reallocation, scale winners", "owner": "finance"},
        ],
        "recommended_agent_team": ["ceo", "planner", "seo", "content", "social", "sales", "finance", "website-designer", "qa"],
        "competitor_gaps": ["Faster lead response (industry avg < 2 min)", "Stronger local SEO presence", "Video-first social strategy"],
    }


def _fallback_growth_strategy(input_data: BusinessChannelInput, question: str) -> dict:
    return {
        "root_causes": [
            "Lead response time exceeds 5 minutes (industry benchmark: under 2 min)",
            "Marketing channels not optimized for current buyer intent",
            "No automated nurture sequences in CRM pipeline",
        ],
        "strategy": {
            "objective": f"Recover and grow revenue for {input_data.industry} business",
            "why_performance_is_down": [
                "Seasonal traffic pattern without compensating campaigns",
                "CRM pipeline not converting leads to booked appointments",
                "SEO content gap on high-intent buyer keywords",
            ],
            "quick_wins": [
                {"action": "Activate instant lead response automation", "owner": "sales", "timeline": "48h", "expected_impact": "+25% contact rate"},
                {"action": "Launch retargeting campaign for website visitors", "owner": "social", "timeline": "72h", "expected_impact": "+15% re-engagement"},
            ],
            "medium_term": [
                {"action": "Create 10-article SEO content cluster", "owner": "seo", "timeline": "30 days", "expected_impact": "+20% organic leads"},
                {"action": "Redesign landing page with conversion-focused layout", "owner": "website-designer", "timeline": "21 days", "expected_impact": "+30% form submissions"},
            ],
        },
        "kpis": ["Lead response time < 2 minutes", "Conversion rate > 5%", "CAC reduced by 15%"],
    }


# ── Legacy sync wrapper (used by main.py) ─────────────────────────────────────

def diagnose_business(input_data: BusinessChannelInput) -> dict:
    """Sync fallback used when called without await (returns deterministic result)."""
    from .website_crawler import WebsiteAudit
    dummy_audit = WebsiteAudit(
        url=input_data.website, final_url=input_data.website, reachable=True,
        status_code=200, load_time_ms=1200, title="Business Website",
        meta_description=None, h1=[], internal_links=5, images=10,
        images_missing_alt=3, forms=1, canonical=None,
        robots_txt="200", sitemap_xml="200",
        issues=["Crawler skipped — use async endpoint for real audit"],
        recommendations=["Use /business-doctor/analyze for full analysis"],
        score=60,
    )
    return _fallback_diagnosis(input_data, dummy_audit)
