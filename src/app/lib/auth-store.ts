/**
 * Auth state — persists access token + user in localStorage.
 * Works with NestJS JWT backend.
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string;
  avatarUrl: string | null;
  locale: string;
}

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  company: { id: string; name: string; industry?: string; locale: string };
  expiresAt: string;
}

const KEY = 'ai_os_auth';

export function getAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as AuthState;
    // Check expiry
    if (new Date(state.expiresAt) < new Date()) {
      clearAuth();
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

export function saveAuth(state: AuthState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function getAccessToken(): string | null {
  return getAuth()?.accessToken ?? null;
}

export function getUser(): AuthUser | null {
  return getAuth()?.user ?? null;
}

export function getCompanyId(): string | null {
  return getAuth()?.user.companyId ?? null;
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}

/** Attempt token refresh. Returns true if successful. */
export async function refreshAuth(): Promise<boolean> {
  const state = getAuth();
  if (!state?.refreshToken) return false;

  try {
    const res = await fetch(`/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: state.refreshToken }),
    });
    if (!res.ok) { clearAuth(); return false; }
    const data = await res.json() as AuthState;
    saveAuth(data);
    return true;
  } catch {
    clearAuth();
    return false;
  }
}
