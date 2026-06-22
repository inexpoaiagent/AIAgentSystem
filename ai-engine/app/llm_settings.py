"""
LLM provider registry — stores real API keys in memory, exposes masked version to API.
Priority order: openai → anthropic → groq → together
"""
import os
from dataclasses import dataclass, field
from time import time


@dataclass
class ProviderConfig:
    provider: str
    model: str
    api_key: str          # real key — never sent to API responses
    api_key_masked: str
    enabled: bool
    saved_at: float = field(default_factory=time)


# In-memory registry — keyed by provider name
PROVIDERS: dict[str, ProviderConfig] = {}

# Supported providers and their default models
PROVIDER_DEFAULTS: dict[str, str] = {
    "openai":    "gpt-4o",
    "anthropic": "claude-sonnet-4-6",
    "groq":      "llama-3.3-70b-versatile",
    "together":  "meta-llama/Llama-3-70b-chat-hf",
}


def mask_key(api_key: str) -> str:
    if len(api_key) <= 8:
        return "sk-...****"
    return f"{api_key[:7]}...{api_key[-4:]}"


def save_provider(provider: str, model: str, api_key: str, enabled: bool = True) -> dict[str, object]:
    PROVIDERS[provider] = ProviderConfig(
        provider=provider,
        model=model or PROVIDER_DEFAULTS.get(provider, "gpt-4o"),
        api_key=api_key,
        api_key_masked=mask_key(api_key),
        enabled=enabled,
    )
    return _public(PROVIDERS[provider])


def list_providers() -> list[dict[str, object]]:
    return [_public(p) for p in PROVIDERS.values()]


def has_enabled_provider() -> bool:
    return any(p.enabled for p in PROVIDERS.values()) or bool(os.getenv("OPENAI_API_KEY"))


def get_primary() -> ProviderConfig | None:
    """Return the first enabled provider, preferring openai."""
    for name in ("openai", "anthropic", "groq", "together"):
        p = PROVIDERS.get(name)
        if p and p.enabled:
            return p

    # Fall back to env vars
    if key := os.getenv("OPENAI_API_KEY"):
        return ProviderConfig(
            provider="openai",
            model=os.getenv("OPENAI_MODEL", "gpt-4o"),
            api_key=key,
            api_key_masked=mask_key(key),
            enabled=True,
        )
    if key := os.getenv("ANTHROPIC_API_KEY"):
        return ProviderConfig(
            provider="anthropic",
            model=os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6"),
            api_key=key,
            api_key_masked=mask_key(key),
            enabled=True,
        )
    return None


def _public(p: ProviderConfig) -> dict[str, object]:
    return {
        "provider": p.provider,
        "model": p.model,
        "api_key_masked": p.api_key_masked,
        "enabled": p.enabled,
        "saved_at": p.saved_at,
    }
