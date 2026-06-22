"""
Unified async LLM client — wraps OpenAI, Anthropic, Groq, Together.
All agent calls go through here so switching providers needs one env change.
"""
from __future__ import annotations

import os
from typing import AsyncIterator

from .llm_settings import ProviderConfig, get_primary

# ── types ──────────────────────────────────────────────────────────────────────

Message = dict[str, str]  # {"role": "system"|"user"|"assistant", "content": str}


# ── main call ─────────────────────────────────────────────────────────────────

async def chat(
    messages: list[Message],
    *,
    temperature: float = 0.7,
    max_tokens: int = 1500,
    provider: ProviderConfig | None = None,
) -> str:
    """Single LLM call, returns full response text."""
    cfg = provider or get_primary()
    if cfg is None:
        return _fallback_response(messages)

    if cfg.provider in ("openai", "groq", "together"):
        return await _openai_chat(cfg, messages, temperature, max_tokens)
    if cfg.provider == "anthropic":
        return await _anthropic_chat(cfg, messages, temperature, max_tokens)
    return _fallback_response(messages)


async def stream_chat(
    messages: list[Message],
    *,
    temperature: float = 0.7,
    max_tokens: int = 1500,
    provider: ProviderConfig | None = None,
) -> AsyncIterator[str]:
    """Streaming LLM call, yields text chunks."""
    cfg = provider or get_primary()
    if cfg is None:
        yield _fallback_response(messages)
        return

    if cfg.provider in ("openai", "groq", "together"):
        async for chunk in _openai_stream(cfg, messages, temperature, max_tokens):
            yield chunk
    elif cfg.provider == "anthropic":
        async for chunk in _anthropic_stream(cfg, messages, temperature, max_tokens):
            yield chunk
    else:
        yield _fallback_response(messages)


async def embed(text: str, provider: ProviderConfig | None = None) -> list[float]:
    """Generate text embedding vector."""
    cfg = provider or get_primary()
    if cfg is None or cfg.provider not in ("openai",):
        return []
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=cfg.api_key)
        resp = await client.embeddings.create(
            model="text-embedding-3-small",
            input=text[:8000],
        )
        return resp.data[0].embedding
    except Exception:
        return []


# ── OpenAI / Groq / Together ──────────────────────────────────────────────────

def _openai_client(cfg: ProviderConfig):
    from openai import AsyncOpenAI
    base_urls = {
        "groq":    "https://api.groq.com/openai/v1",
        "together": "https://api.together.xyz/v1",
    }
    base_url = base_urls.get(cfg.provider)
    return AsyncOpenAI(api_key=cfg.api_key, base_url=base_url)


async def _openai_chat(cfg: ProviderConfig, messages: list[Message], temperature: float, max_tokens: int) -> str:
    try:
        client = _openai_client(cfg)
        resp = await client.chat.completions.create(
            model=cfg.model,
            messages=messages,  # type: ignore[arg-type]
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content or ""
    except Exception as e:
        return f"[LLM error: {type(e).__name__}: {e}]"


async def _openai_stream(cfg: ProviderConfig, messages: list[Message], temperature: float, max_tokens: int) -> AsyncIterator[str]:
    try:
        client = _openai_client(cfg)
        stream = await client.chat.completions.create(
            model=cfg.model,
            messages=messages,  # type: ignore[arg-type]
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
    except Exception as e:
        yield f"[Stream error: {type(e).__name__}: {e}]"


# ── Anthropic ─────────────────────────────────────────────────────────────────

async def _anthropic_chat(cfg: ProviderConfig, messages: list[Message], temperature: float, max_tokens: int) -> str:
    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=cfg.api_key)
        system = next((m["content"] for m in messages if m["role"] == "system"), "You are a helpful AI.")
        user_msgs = [m for m in messages if m["role"] != "system"]
        resp = await client.messages.create(
            model=cfg.model,
            system=system,
            messages=user_msgs,  # type: ignore[arg-type]
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.content[0].text
    except Exception as e:
        return f"[LLM error: {type(e).__name__}: {e}]"


async def _anthropic_stream(cfg: ProviderConfig, messages: list[Message], temperature: float, max_tokens: int) -> AsyncIterator[str]:
    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=cfg.api_key)
        system = next((m["content"] for m in messages if m["role"] == "system"), "You are a helpful AI.")
        user_msgs = [m for m in messages if m["role"] != "system"]
        async with client.messages.stream(
            model=cfg.model,
            system=system,
            messages=user_msgs,  # type: ignore[arg-type]
            temperature=temperature,
            max_tokens=max_tokens,
        ) as stream:
            async for text in stream.text_stream:
                yield text
    except Exception as e:
        yield f"[Stream error: {type(e).__name__}: {e}]"


# ── Fallback (no LLM configured) ──────────────────────────────────────────────

def _fallback_response(messages: list[Message]) -> str:
    last = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "your question")
    return (
        "⚠️ No LLM provider is configured. "
        "Go to **LLM Management** → add your OpenAI API key to enable AI responses. "
        f"Your question was: '{last[:100]}'"
    )
