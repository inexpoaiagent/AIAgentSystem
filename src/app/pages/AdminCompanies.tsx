import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  ChevronLeft, Building2, Search, RefreshCw, Bot,
  Users, CheckSquare, Brain, Zap, ChevronDown, ChevronUp,
} from "lucide-react";
import { authFetch } from "../lib/api";
import { usePacks } from "../hooks/usePacks";
import { toast } from "sonner";

interface Company {
  id: string; name: string; slug: string; industry: string | null;
  industryPackId: string | null; domain: string | null; createdAt: string;
  _count: { users: number; agents: number; agentTasks: number; memories: number };
}
interface PageData { items: Company[]; total: number; page: number; pages: number }

export default function AdminCompanies() {
  const { packs } = usePacks();
  const PACK_MAP = Object.fromEntries(packs.map(p => [p.id, p]));
  const PACK_SLUG_MAP = Object.fromEntries(packs.map(p => [p.slug, p]));
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) q.set("search", search);
      const res = await authFetch<PageData>(`/admin/companies?${q}`);
      setData(res);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const assignPack = async (companyId: string, packId: string) => {
    setAssigning(companyId);
    try {
      await authFetch(`/admin/companies/${companyId}/pack`, { method: "PUT", body: JSON.stringify({ packId }) });
      toast.success("Pack assigned");
      load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setAssigning(null); }
  };

  const packDistribution = data?.items.reduce((acc, c) => {
    const k = c.industry ?? "none";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/admin"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Admin</Button></Link>
          <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-purple-400" /><h1 className="text-xl font-semibold">Company Management</h1></div>
          <Button size="sm" variant="ghost" onClick={load} disabled={loading} className="text-gray-400 hover:text-white hover:bg-white/10">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Companies", value: data?.total ?? "—", icon: Building2, color: "text-purple-400" },
            { label: "With AI Pack", value: data?.items.filter(c => c.industry).length ?? "—", icon: Zap, color: "text-blue-400" },
            { label: "No Pack Yet", value: data?.items.filter(c => !c.industry).length ?? "—", icon: CheckSquare, color: "text-amber-400" },
            { label: "Total Users", value: data?.items.reduce((s, c) => s + c._count.users, 0) ?? "—", icon: Users, color: "text-green-400" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="bg-[#111117]/50 border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                  <span className="text-2xl font-bold">{s.value}</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pack Distribution */}
        {Object.keys(packDistribution).length > 0 && (
          <Card className="bg-[#111117]/50 border-white/10 p-5">
            <h2 className="text-sm font-semibold mb-3 text-gray-300">Industry Pack Distribution</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(packDistribution).map(([k, v]) => {
                const pack = PACK_MAP[k];
                return (
                  <Badge key={k} className="text-xs" style={{ background: pack ? `${pack.color}22` : '#22222244', color: pack?.color ?? '#888', borderColor: pack ? `${pack.color}44` : '#333' }}>
                    {pack ? `${pack.emoji} ${pack.name}` : "No Pack"}: {v}
                  </Badge>
                );
              })}
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search companies..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>

        {/* Companies list */}
        <div className="space-y-3">
          {loading && !data ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))
          ) : data?.items.map((company) => {
            const pack = company.industryPackId ? PACK_MAP[company.industryPackId] : (company.industry ? PACK_SLUG_MAP[company.industry] : null);
            const isExpanded = expanded === company.id;
            return (
              <motion.div key={company.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-[#111117]/50 border-white/10 overflow-hidden">
                  {/* Header row */}
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: pack ? `${pack.color}22` : 'rgba(255,255,255,0.05)' }}>
                      {pack ? pack.emoji : "🏢"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold">{company.name}</span>
                        {pack && (
                          <Badge className="text-xs" style={{ background: `${pack.color}22`, color: pack.color, borderColor: `${pack.color}44` }}>
                            {pack.name} Pack
                          </Badge>
                        )}
                        {!pack && <Badge className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">No Pack</Badge>}
                      </div>
                      <div className="text-xs text-gray-400">{company.domain ?? company.slug} · {new Date(company.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{company._count.users}</span>
                      <span className="flex items-center gap-1"><Bot className="w-3 h-3" />{company._count.agents}</span>
                      <span className="flex items-center gap-1"><Brain className="w-3 h-3" />{company._count.memories}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setExpanded(isExpanded ? null : company.id)}
                      className="text-gray-400 hover:text-white hover:bg-white/10 h-7 w-7 p-0 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Expanded: assign pack */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/10 pt-4">
                      <p className="text-xs text-gray-400 mb-3">Assign or change industry pack:</p>
                      <div className="flex flex-wrap gap-2">
                        {packs.map((p) => {
                          const isActive = company.industryPackId === p.id || company.industry === p.slug;
                          return (
                            <button
                              key={p.id}
                              onClick={() => assignPack(company.id, p.slug)}
                              disabled={assigning === company.id}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                isActive ? 'border-current opacity-100' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                              }`}
                              style={{ color: p.color, background: `${p.color}18` }}
                            >
                              {p.emoji} {p.name}
                              {isActive && " ✓"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{data.total} companies · Page {data.page} of {data.pages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-white/20 text-white hover:bg-white/10 h-7 text-xs">Prev</Button>
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="border-white/20 text-white hover:bg-white/10 h-7 text-xs">Next</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
