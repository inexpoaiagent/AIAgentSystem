export type RuntimeEvent = {
  id: string;
  type: "action" | "notification" | "audit" | "approval" | "auth";
  title: string;
  detail: string;
  status: "queued" | "running" | "completed" | "failed" | "needs_approval";
  createdAt: string;
};

const EVENT_KEY = "ai-business-os-events";
const SESSION_KEY = "ai-business-os-session";

export function createRuntimeEvent(event: Omit<RuntimeEvent, "id" | "createdAt">): RuntimeEvent {
  const entry: RuntimeEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const events = getRuntimeEvents();
  localStorage.setItem(EVENT_KEY, JSON.stringify([entry, ...events].slice(0, 250)));
  window.dispatchEvent(new CustomEvent("runtime:event", { detail: entry }));
  return entry;
}

export function getRuntimeEvents(): RuntimeEvent[] {
  try {
    return JSON.parse(localStorage.getItem(EVENT_KEY) ?? "[]") as RuntimeEvent[];
  } catch {
    return [];
  }
}

export function saveSession(session: Record<string, unknown>) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...session,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function getSession<T extends Record<string, unknown>>() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "{}") as Partial<T>;
  } catch {
    return {};
  }
}
