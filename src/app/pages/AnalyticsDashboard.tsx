import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ChevronLeft, BarChart3, Brain, Workflow, Bot,
  CheckCircle2, RefreshCw, AlertCircle, TrendingUp,
} from "lucide-react";
import { api, CompanyStats, AgentSummary } from "../lib/api";

const TIER_COLORS: Record<string, string> = {
  CEO: "#f59e0b",
  MANAGER: "#3b82f6",
  SPECIALIST: "#8b5cf6",
  WORKER: "#10b981",
  QA: "#f97316",
  SECURITY: "#ef4444",
  COST: "#14b8a6",
};

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const [s, a] = await Promise.all([api.getCompanyStats(), api.getAgentsSummary()]);
      setStats(s);
      setAgents(a);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 20_000);
    return () => clearInterval(i);
  }, []);

  // Build chart data from agents
  const agentBarData = agents.map((a) => ({
    name: a.name.replace(" Agent", "").replace(" Optimizer", ""),
    tasks: a.stats?.totalTasks ?? 0,
    success: a.stats?.successRate ?? 100,
    tier: a.tier,
  }));

  const tierBreakdown = Object.entries(
    agents.reduce((acc, a) => {
      acc[a.tier] = (acc[a.tier] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([tier, count]) => ({ tier, count }));

  const activeAgents = agents.filter((a) => a.status === "ACTIVE").length;
  const totalTasks = agents.reduce((s, a) => s + (a.stats?.totalTasks ?? 0), 0);
  const avgSuccess = agents.length
    ? Math.round(agents.reduce((s, a) => s + (a.stats?.successRate ?? 100), 0) / agents.length)
    : 0;

  const topMetrics = [
    { label: "Active Agents", value: loading ? "—" : String(activeAgents), icon: Bot, color: "text-blue-400" },
    { label: "Total Tasks", value: loading ? "—" : String(totalTasks || stats?.totalTasks || 0), icon: CheckCircle2, color: "text-green-400" },
    { label: "Avg. Success Rate", value: loading ? "—" : `${avgSuccess}%`, icon: TrendingUp, color: "text-purple-400" },
    { label: "Active Workflows", value: loading ? "—" : String(stats?.activeWorkflows ?? 0), icon: Workflow, color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">AI Operations Analytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Live</Badge>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Top metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topMetrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
                <div className="flex items-center justify-between mb-3">
                  <m.icon className={`w-7 h-7 ${m.color}`} />
                  <span className={`text-3xl font-bold ${loading ? "text-gray-600 animate-pulse" : ""}`}>{m.value}</span>
                </div>
                <div className="text-sm text-gray-400">{m.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Agent Task Distribution Bar Chart */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Agent Task Distribution
            </h2>
            <span className="text-xs text-gray-500">Tasks per agent (all time)</span>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-gray-500">Loading...</div>
          ) : agentBarData.length === 0 || agentBarData.every((d) => d.tasks === 0) ? (
            <div className="h-48 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No tasks yet — start a chat to create agent tasks</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={agentBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }}
                />
                <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                  {agentBarData.map((entry, i) => (
                    <Cell key={i} fill={TIER_COLORS[entry.tier] ?? "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent success rates */}
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Agent Success Rates
            </h2>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {agents.slice(0, 8).map((agent) => (
                  <div key={agent.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{agent.name}</span>
                      <span className="font-medium">{agent.stats?.successRate ?? 100}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ width: `${agent.stats?.successRate ?? 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Tier breakdown */}
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              Agent Tier Breakdown
            </h2>
            <div className="space-y-3">
              {tierBreakdown.map(({ tier, count }) => (
                <div key={tier} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: TIER_COLORS[tier] ?? "#6366f1" }} />
                  <span className="text-sm text-gray-300 flex-1">{tier}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-white/5 w-24 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(count / agents.length) * 100}%`, background: TIER_COLORS[tier] ?? "#6366f1" }}
                      />
                    </div>
                    <span className="text-sm font-medium w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Agent status summary */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <h3 className="text-sm text-gray-400 mb-3">Status Overview</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["ACTIVE", "PAUSED", "DISABLED"] as const).map((status) => {
                  const count = agents.filter((a) => a.status === status).length;
                  const color = status === "ACTIVE" ? "text-green-400" : status === "PAUSED" ? "text-yellow-400" : "text-gray-500";
                  return (
                    <div key={status} className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className={`text-2xl font-bold ${color}`}>{count}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{status.toLowerCase()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Company Brain stats */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Company Knowledge Base
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Memories", value: stats?.totalMemories ?? 0, color: "text-cyan-400" },
              { label: "Active Agents", value: stats?.activeAgents ?? 0, color: "text-green-400" },
              { label: "Total Tasks", value: stats?.totalTasks ?? 0, color: "text-purple-400" },
              { label: "Workflows", value: stats?.activeWorkflows ?? 0, color: "text-blue-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <div className={`text-3xl font-bold ${color} ${loading ? "animate-pulse" : ""}`}>
                  {loading ? "—" : value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
