import { getAccessToken, refreshAuth, clearAuth, AuthUser, saveAuth } from './auth-store';

export type TenantContext = {
  companyId: string;
  workspaceId: string;
  locale: string;
  plan: 'starter' | 'professional' | 'enterprise';
  companyName?: string;
  industry?: string;
};

export type AgentTaskRequest = {
  message: string;
  agentSlugs?: string[];
  approvalMode: 'manual' | 'autonomous';
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  agentSlug?: string;
  agentName?: string;
  createdAt: string;
};

export type BusinessDoctorRequest = {
  tenant_id: string;
  industry: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
};

export type BusinessDoctorReport = {
  diagnosis: {
    business_health_score: number;
    diagnosis: Array<{
      area: string;
      score: number;
      issues: string[];
      quick_wins?: string[];
      agents: string[];
      crawler?: Record<string, unknown>;
    }>;
    next_actions: string[];
    ninety_day_plan?: Array<{ week: string; work: string; owner: string }>;
  };
  llm: { configured: boolean; mode: string; note: string };
  channels: Array<{ provider: string; url: string; status: string }>;
  competitor_intelligence: {
    strategic_gap: string;
    competitors: Array<{ name: string; domain: string; why_ahead: string[] }>;
  };
  growth_strategy: { objective: string; why_sales_are_down: string[] };
  crm_manager: { pipeline: Array<{ name: string; automation: string }> };
  meta_ads_workflow: { approval_required: boolean; risk_level: string };
  wordpress_fix_plan: { approval_required: boolean; automation: string[] };
  accounting: {
    invoices: Array<{ number: string; customer: string; amount: number; status: string }>;
    forecast: { monthly_revenue: number; monthly_expense: number; projected_profit: number };
  };
};

export type AgentSummary = {
  id: string;
  companyId: string;
  slug: string;
  name: string;
  tier: 'CEO' | 'MANAGER' | 'SPECIALIST' | 'WORKER' | 'QA' | 'SECURITY' | 'COST';
  personality?: string;
  goals: string[];
  tools: string[];
  kpis: string[];
  costProfile: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'PAUSED' | 'DISABLED';
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  stats?: {
    activeTasks: number;
    completedToday: number;
    totalTasks: number;
    successRate: number;
    failedTotal: number;
  };
  recentTasks?: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    completedAt?: string;
  }>;
};

export type AgentKpis = {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  successRate: number;
  avgCostUsd: number;
};

export type CompanyStats = {
  activeAgents: number;
  totalTasks: number;
  activeWorkflows: number;
  totalMemories: number;
};

export type AgentTask = {
  id: string;
  companyId: string;
  agentId?: string;
  requestedById: string;
  title: string;
  objective: string;
  agentSlugs: string[];
  approvalMode: 'MANUAL' | 'AUTONOMOUS';
  status: 'QUEUED' | 'RUNNING' | 'NEEDS_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  result?: Record<string, unknown>;
  errorMessage?: string;
  costUsd?: number;
  tokensUsed?: number;
  approvedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  requestedBy?: { id: string; name: string; avatarUrl?: string };
  agent?: AgentSummary;
};

export type ProviderSettings = {
  provider: string;
  model: string;
  api_key: string;
  enabled: boolean;
};

// In dev, Vite proxies /v1/* to localhost:8080 — so we use relative path
const API_URL = import.meta.env.VITE_API_URL ?? '';
const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL ?? 'http://localhost:8000';

// ── Authenticated fetch ────────────────────────────────────────────────────────

export async function authFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();

  const doRequest = async (tk: string | null) => {
    return fetch(`${API_URL}/v1${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
        ...(init.headers as Record<string, string> ?? {}),
      },
    });
  };

  let res = await doRequest(token);

  // Token expired → try refresh once
  if (res.status === 401 && token) {
    const ok = await refreshAuth();
    if (ok) {
      res = await doRequest(getAccessToken());
    } else {
      clearAuth();
      window.location.href = '/signin';
      throw new Error('Session expired');
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText })) as { message?: string };
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function aiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${AI_ENGINE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers as Record<string, string> ?? {}) },
  });
  if (!res.ok) throw new Error(`AI engine error: ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { companyName: string; name: string; email: string; password: string; industry?: string }) =>
    authFetch<{ user: AuthUser; company: { id: string; name: string }; accessToken: string; refreshToken: string; expiresAt: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    authFetch<{ user: AuthUser; company: { id: string; name: string; locale: string }; accessToken: string; refreshToken: string; expiresAt: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: (refreshToken: string) =>
    authFetch<{ message: string }>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  me: () => authFetch<AuthUser & { company: object }>('/auth/me'),
};

// ── Main API ───────────────────────────────────────────────────────────────────

export const api = {
  // Workspace
  workspace: () => authFetch<TenantContext>('/workspace'),
  updateWorkspaceSettings: (settings: Record<string, unknown>) =>
    authFetch<object>('/workspace/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  // Company
  company: () => authFetch<{ id: string; name: string; industry?: string }>('/company'),
  updateCompany: (data: Record<string, string>) =>
    authFetch<object>('/company', { method: 'PUT', body: JSON.stringify(data) }),

  // Agent Tasks — matches frontend AgentTaskRequest type
  dispatchAgentTask: (body: AgentTaskRequest) =>
    authFetch<{ taskId: string; status: string }>('/agent-tasks', { method: 'POST', body: JSON.stringify(body) }),
  listAgentTasks: (page = 1, limit = 20) =>
    authFetch<{ items: AgentTask[]; total: number; page: number; limit: number }>(`/agent-tasks?page=${page}&limit=${limit}`),
  getAgentTask: (id: string) => authFetch<AgentTask>(`/agent-tasks/${id}`),
  approveTask: (id: string) => authFetch<AgentTask>(`/agent-tasks/${id}/approve`, { method: 'PUT' }),
  rejectTask: (id: string, reason?: string) =>
    authFetch<AgentTask>(`/agent-tasks/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),

  // Agents
  listAgents: () => authFetch<AgentSummary[]>('/agents'),
  getAgentsSummary: () => authFetch<AgentSummary[]>('/agents/summary'),
  getAgentKpis: (id: string) => authFetch<{ agent: AgentSummary; kpis: AgentKpis }>(`/agents/${id}/kpis`),
  setAgentStatus: (id: string, status: 'ACTIVE' | 'PAUSED' | 'DISABLED') =>
    authFetch<AgentSummary>(`/agents/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Company stats
  getCompanyStats: () => authFetch<CompanyStats>('/company/stats'),

  // Industry pack activation
  activatePack: (packId: string) =>
    authFetch<{ success: boolean; message: string }>('/company/activate-pack', {
      method: 'POST',
      body: JSON.stringify({ packId }),
    }),

  // Chat (streaming)
  streamChat: (message: string, history: ChatMessage[] = [], sessionId?: string): EventSource | null => {
    // Use fetch + ReadableStream for SSE with POST body
    return null; // handled by streamChatFetch below
  },

  // Workflows
  listWorkflows: () => authFetch<{ items: unknown[] }>('/workflows'),
  createWorkflow: (data: { name: string; description?: string }) =>
    authFetch<unknown>('/workflows', { method: 'POST', body: JSON.stringify(data) }),
  runWorkflow: (id: string) => authFetch<unknown>(`/workflows/${id}/run`, { method: 'POST' }),

  // Memories
  listMemories: (type?: string, search?: string) =>
    authFetch<{ items: unknown[] }>(`/memories${type ? `?type=${type}` : ''}${search ? `&search=${search}` : ''}`),
  createMemory: (data: { type: string; title: string; content: string; tags?: string[] }) =>
    authFetch<unknown>('/memories', { method: 'POST', body: JSON.stringify(data) }),

  // Voice sessions — matches original api.ts type
  createVoiceSession: () =>
    authFetch<{ sessionId: string; providerToken: string; expiresAt: string }>('/voice/sessions', { method: 'POST' }),

  // Subscriptions
  getSubscription: () => authFetch<{ plan: string; status: string; limits: object }>('/subscriptions'),
  getInvoices: () => authFetch<unknown[]>('/subscriptions/invoices'),

  // Usage
  getUsageSummary: () => authFetch<{ summary: Record<string, unknown>; plan: string }>('/usage/summary'),

  // Audit logs
  getAuditLogs: (page = 1) => authFetch<{ items: unknown[]; total: number }>(`/audit-logs?page=${page}`),

  // Business Doctor (via backend proxy)
  analyzeBusinessDoctor: (body: Omit<BusinessDoctorRequest, 'tenant_id'>) =>
    authFetch<BusinessDoctorReport>('/business-doctor/analyze', { method: 'POST', body: JSON.stringify(body) }),
  askCeoQuestion: (question: string, healthScore?: number, diagnosisSummary?: string) =>
    authFetch<unknown>('/business-doctor/ceo-question', { method: 'POST', body: JSON.stringify({ question, healthScore, diagnosisSummary }) }),
  getLastAnalysis: () => authFetch<unknown>('/business-doctor/last-analysis'),

  // LLM management (via backend chat module)
  getLlmStatus: () => authFetch<{ providers: unknown[]; llm_configured: boolean }>('/chat/llm-status'),
  saveLlmProvider: (body: ProviderSettings) =>
    authFetch<unknown>('/chat/llm-provider', { method: 'POST', body: JSON.stringify({ provider: body.provider, model: body.model, apiKey: body.api_key, enabled: body.enabled }) }),

  // Aliases used by LLMManagement.tsx
  getProviderSettings: () => authFetch<{ providers: unknown[]; llm_configured: boolean }>('/chat/llm-status'),
  saveProviderSettings: (body: ProviderSettings) =>
    authFetch<{ providers: unknown[]; llm_configured: boolean }>('/chat/llm-provider', { method: 'POST', body: JSON.stringify({ provider: body.provider, model: body.model, apiKey: body.api_key, enabled: body.enabled }) }),
};

// ── Streaming chat helper (SSE with POST body) ─────────────────────────────────

export async function* streamChatMessages(
  message: string,
  history: ChatMessage[] = [],
  sessionId?: string,
): AsyncGenerator<{ type: string; [key: string]: unknown }> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}/v1/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history, sessionId }),
  });

  if (!res.ok || !res.body) {
    yield { type: 'error', message: `HTTP ${res.status}` };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let done = false;

  while (!done) {
    const { value, done: d } = await reader.read();
    done = d;
    if (value) buffer += decoder.decode(value, { stream: !done });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      try {
        yield JSON.parse(trimmed.slice(6)) as { type: string; [key: string]: unknown };
      } catch {
        // skip malformed
      }
    }
  }
}

// ── Business Doctor streaming ──────────────────────────────────────────────────

export async function* streamBusinessDoctor(
  input: Omit<BusinessDoctorRequest, 'tenant_id'>,
): AsyncGenerator<{ type: string; [key: string]: unknown }> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}/v1/business-doctor/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  });

  if (!res.ok || !res.body) {
    yield { type: 'error', message: `HTTP ${res.status}` };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let done = false;

  while (!done) {
    const { value, done: d } = await reader.read();
    done = d;
    if (value) buffer += decoder.decode(value, { stream: !done });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        yield JSON.parse(line.slice(6)) as { type: string; [key: string]: unknown };
      } catch { /* skip */ }
    }
  }
}
