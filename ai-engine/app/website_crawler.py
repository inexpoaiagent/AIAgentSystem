import re
from dataclasses import dataclass
from html import unescape
from urllib.parse import urljoin, urlparse

import httpx


@dataclass(frozen=True)
class WebsiteAudit:
    url: str
    final_url: str | None
    reachable: bool
    status_code: int | None
    load_time_ms: int | None
    title: str | None
    meta_description: str | None
    h1: list[str]
    internal_links: int
    images: int
    images_missing_alt: int
    forms: int
    canonical: str | None
    robots_txt: str
    sitemap_xml: str
    issues: list[str]
    recommendations: list[str]
    score: int


def _match(pattern: str, html: str) -> str | None:
    found = re.search(pattern, html, flags=re.IGNORECASE | re.DOTALL)
    if not found:
        return None
    value = re.sub(r"\s+", " ", found.group(1)).strip()
    return unescape(value) if value else None


def _matches(pattern: str, html: str) -> list[str]:
    return [unescape(re.sub(r"\s+", " ", item).strip()) for item in re.findall(pattern, html, flags=re.IGNORECASE | re.DOTALL)]


async def crawl_website(url: str, timeout_seconds: float = 12.0) -> WebsiteAudit:
    normalized = url if url.startswith(("http://", "https://")) else f"https://{url}"
    issues: list[str] = []
    recommendations: list[str] = []
    try:
        async with httpx.AsyncClient(
            timeout=timeout_seconds,
            follow_redirects=True,
            headers={
                "User-Agent": "AI-Business-Doctor/1.0 (+local-production-audit)",
                "Accept": "text/html,application/xhtml+xml",
            },
        ) as client:
            response = await client.get(normalized)
            elapsed_ms = int(response.elapsed.total_seconds() * 1000)
            html = response.text[:2_000_000]
            final_url = str(response.url)

            title = _match(r"<title[^>]*>(.*?)</title>", html)
            meta_description = _match(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']', html)
            if not meta_description:
                meta_description = _match(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']', html)
            h1 = _matches(r"<h1[^>]*>(.*?)</h1>", html)
            image_tags = re.findall(r"<img\b[^>]*>", html, flags=re.IGNORECASE)
            links = _matches(r'<a[^>]+href=["\']([^"\']+)["\']', html)
            base_host = urlparse(final_url).netloc
            internal_links = sum(1 for link in links if not urlparse(urljoin(final_url, link)).netloc or urlparse(urljoin(final_url, link)).netloc == base_host)
            images_missing_alt = sum(1 for tag in image_tags if not re.search(r"\balt\s*=", tag, flags=re.IGNORECASE))
            forms = len(re.findall(r"<form\b", html, flags=re.IGNORECASE))
            canonical = _match(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html)

            robots_url = urljoin(final_url, "/robots.txt")
            sitemap_url = urljoin(final_url, "/sitemap.xml")
            robots_status = "unknown"
            sitemap_status = "unknown"
            try:
                robots_status = str((await client.get(robots_url)).status_code)
            except Exception:
                robots_status = "unreachable"
            try:
                sitemap_status = str((await client.get(sitemap_url)).status_code)
            except Exception:
                sitemap_status = "unreachable"

            score = 100
            if response.status_code >= 400:
                issues.append(f"Website returned HTTP {response.status_code}.")
                recommendations.append("Fix server/CDN response before running growth automation.")
                score -= 35
            if elapsed_ms > 2500:
                issues.append(f"Homepage loaded slowly for crawler ({elapsed_ms} ms).")
                recommendations.append("Optimize cache, images, scripts, and CDN configuration.")
                score -= 12
            if not title or len(title) < 20:
                issues.append("Homepage title is missing or too short for SEO.")
                recommendations.append("Generate a search-intent title with location and offer.")
                score -= 10
            if not meta_description or len(meta_description) < 70:
                issues.append("Meta description is missing or weak.")
                recommendations.append("Write a benefit-led meta description for real estate buyers and sellers.")
                score -= 10
            if len(h1) != 1:
                issues.append(f"Expected exactly one H1, found {len(h1)}.")
                recommendations.append("Use one clear H1 that states the company offer.")
                score -= 8
            if images_missing_alt > 0:
                issues.append(f"{images_missing_alt} images are missing alt text.")
                recommendations.append("Add descriptive alt text for accessibility and image SEO.")
                score -= min(10, images_missing_alt)
            if forms == 0:
                issues.append("No visible lead capture form was detected.")
                recommendations.append("Add a short inquiry form connected to AI CRM Manager.")
                score -= 10
            if not canonical:
                issues.append("Canonical tag was not detected.")
                recommendations.append("Add canonical URL to prevent duplicate indexing.")
                score -= 5
            if sitemap_status not in {"200", "301", "302"}:
                issues.append("Sitemap was not reachable at /sitemap.xml.")
                recommendations.append("Generate and submit XML sitemap.")
                score -= 5

            return WebsiteAudit(
                url=normalized,
                final_url=final_url,
                reachable=True,
                status_code=response.status_code,
                load_time_ms=elapsed_ms,
                title=title,
                meta_description=meta_description,
                h1=h1[:5],
                internal_links=internal_links,
                images=len(image_tags),
                images_missing_alt=images_missing_alt,
                forms=forms,
                canonical=canonical,
                robots_txt=robots_status,
                sitemap_xml=sitemap_status,
                issues=issues or ["No critical crawler issues detected on the homepage."],
                recommendations=recommendations or ["Continue monitoring rankings, speed, and lead conversion weekly."],
                score=max(0, min(100, score)),
            )
    except Exception as exc:
        return WebsiteAudit(
            url=normalized,
            final_url=None,
            reachable=False,
            status_code=None,
            load_time_ms=None,
            title=None,
            meta_description=None,
            h1=[],
            internal_links=0,
            images=0,
            images_missing_alt=0,
            forms=0,
            canonical=None,
            robots_txt="unknown",
            sitemap_xml="unknown",
            issues=[f"Website crawler could not reach the site: {type(exc).__name__}."],
            recommendations=["Check DNS, firewall, bot protection, SSL, or allow the crawler user-agent."],
            score=15,
        )
