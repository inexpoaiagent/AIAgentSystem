export type TenantContext = {
  companyId: string;
  workspaceId: string;
  locale: string;
  plan: "starter" | "professional" | "enterprise";
};

export type AgentTaskRequest = {
  message: string;
  agentSlugs?: string[];
  approvalMode: "manual" | "autonomous";
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  workspace: () => request<TenantContext>("/v1/workspace"),
  dispatchAgentTask: (body: AgentTaskRequest) =>
    request<{ taskId: string; status: string }>("/v1/agent-tasks", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createVoiceSession: () =>
    request<{ sessionId: string; providerToken: string; expiresAt: string }>("/v1/voice/sessions", {
      method: "POST",
    }),
};
