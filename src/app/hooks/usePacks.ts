import { useState, useEffect } from "react";

export interface AgentSpec {
  slug: string; name: string; role: string; description: string; icon: string;
}
export interface PackOutcome { metric: string; description: string; }

export interface Pack {
  id: string; slug: string; name: string; emoji: string; tagline: string;
  valueProposition: string; targetCustomers: string[]; painPoints: string[];
  agents: AgentSpec[]; outcomes: PackOutcome[]; kpis: string[];
  tier: string; price: number; color: string; gradientFrom: string; gradientTo: string;
  isActive: boolean; sortOrder: number;
  _count?: { companies: number };
}

export function usePacks() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/v1/packs")
      .then((r) => r.json())
      .then((data) => {
        // Prisma returns JSON fields as strings in some drivers — parse if needed
        setPacks(data.map(parsePack));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { packs, loading, error };
}

export function usePackBySlug(slug: string | undefined) {
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/v1/packs/${slug}`)
      .then((r) => { if (!r.ok) throw new Error("Pack not found"); return r.json(); })
      .then((data) => setPack(parsePack(data)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { pack, loading, error };
}

function parsePack(p: any): Pack {
  const json = (v: any) => {
    if (typeof v === "string") { try { return JSON.parse(v); } catch { return []; } }
    return v ?? [];
  };
  return {
    ...p,
    targetCustomers: json(p.targetCustomers),
    painPoints: json(p.painPoints),
    agents: json(p.agents),
    outcomes: json(p.outcomes),
    kpis: json(p.kpis),
  };
}
