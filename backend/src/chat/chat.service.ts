import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { EventsGateway } from '../events/events.gateway';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  agentSlug?: string;
  agentName?: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  companyId: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly AI_ENGINE = process.env.AI_ENGINE_URL ?? 'http://localhost:8000';

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly events: EventsGateway,
  ) {}

  /**
   * Proxy a streaming chat request to the AI engine.
   * Returns an async generator that yields SSE lines.
   */
  async *streamChat(
    companyId: string,
    userId: string,
    message: string,
    sessionId: string | undefined,
    history: ChatMessage[],
  ): AsyncGenerator<string> {
    // Build history in AI engine format
    const historyPayload = history.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const body = JSON.stringify({
      tenant_id: companyId,
      user_id: userId,
      message,
      session_id: sessionId,
      history: historyPayload,
    });

    let response: Response;
    try {
      response = await fetch(`${this.AI_ENGINE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(120_000),
      });
    } catch (err) {
      this.logger.error('AI engine unreachable', err);
      yield this.sseError('AI engine is not running. Start it with: cd ai-engine && uvicorn app.main:app --reload');
      return;
    }

    if (!response.ok) {
      yield this.sseError(`AI engine error: ${response.status}`);
      return;
    }

    // Stream response chunks from AI engine to caller
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const text = decoder.decode(value, { stream: !done });
        yield text;

        // Parse events for WebSocket fan-out
        for (const line of text.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const evt = JSON.parse(line.slice(6)) as { type: string };
              this.events.emitToCompany(companyId, `chat:${evt.type}`, evt);
            } catch {
              // malformed line — skip
            }
          }
        }
      }
    }

    // Log to audit
    await this.audit.log({
      companyId,
      actorId: userId,
      action: 'EXECUTE',
      target: 'AgentChat',
      payload: { message: message.substring(0, 100), sessionId },
      riskLevel: 'LOW',
    });
  }

  /** Non-streaming: collect all events and return as JSON */
  async syncChat(
    companyId: string,
    userId: string,
    message: string,
    history: ChatMessage[],
  ): Promise<object> {
    const historyPayload = history.slice(-10).map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${this.AI_ENGINE}/chat/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: companyId, user_id: userId, message, history: historyPayload }),
        signal: AbortSignal.timeout(90_000),
      });

      if (!res.ok) throw new Error(`AI engine ${res.status}`);
      return await res.json() as object;
    } catch (err) {
      return {
        error: 'AI engine unavailable',
        events: [{ type: 'error', message: String(err) }],
        llm_configured: false,
      };
    }
  }

  async getLlmStatus(): Promise<object> {
    try {
      const res = await fetch(`${this.AI_ENGINE}/settings/providers`, { signal: AbortSignal.timeout(5_000) });
      return await res.json() as object;
    } catch {
      return { providers: [], llm_configured: false, error: 'AI engine unreachable' };
    }
  }

  async saveLlmProvider(provider: string, model: string, apiKey: string, enabled: boolean): Promise<object> {
    try {
      const res = await fetch(`${this.AI_ENGINE}/settings/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, api_key: apiKey, enabled }),
        signal: AbortSignal.timeout(10_000),
      });
      return await res.json() as object;
    } catch {
      return { error: 'AI engine unreachable' };
    }
  }

  private sseError(message: string): string {
    return `data: ${JSON.stringify({ type: 'error', message })}\n\ndata: ${JSON.stringify({ type: 'done' })}\n\n`;
  }
}
