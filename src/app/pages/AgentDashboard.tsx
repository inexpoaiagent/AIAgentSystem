import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  ChevronLeft, Brain, Activity, CheckCircle2, Clock, Target,
  AlertCircle, Pause, Play, Settings, RefreshCw, Crown,
  Briefcase, Zap, Shield, Lock, DollarSign, Wrench,
  ChevronDown, ChevronUp, ListChecks,
} from "lucide-react";
import { api, AgentSummary, CompanyStats } from "../lib/api";

// ── Icon/Color helpers ─────────────────────────────────────────────────────────

const TIER_META: Record<string, { icon: typeof Crown; color: string; label: string }> = {
  CEO: { icon: Crown, color: "from-yellow-500 to-amber-400", label: "CEO" },
  MANAGER: { icon: Briefcase, color: "from-blue-500 to-cyan-500", label: "Manager" },
  SPECIALIST: { icon: Zap, color: "from-purple-500 to-pink-500", label: "Specialist" },
  WORKER: { icon: Wrench, color: "from-green-500 to-emerald-500", label: "Worker" },
  QA: { icon: Shield, color: "from-yellow-500 to-orange-500", label: "QA" },
  SECURITY: { icon: Lock, color: "from-red-500 to-rose-600", label: "Security" },
  COST: { icon: DollarSign, color: "from-teal-500 to-green-500", label: "Cost Optimizer" },
};

const SLUG_COLOR: Record<string, string> = {
  "ceo-agent": "from-yellow-500 to-amber-400",
  "planner-agent": "from-blue-600 to-indigo-600",
  "seo-agent": "from-cyan-500 to-blue-500",
  "content-agent": "from-violet-500 to-purple-600",
  "social-media-agent": "from-orange-500 to-red-500",
  "sales-agent": "from-pink-500 to-rose-500",
  "financial-agent": "from-green-500 to-teal-600",
  "pm-agent": "from-indigo-500 to-blue-600",
  "qa-agent": "from-yellow-500 to-amber-500",
  "security-agent": "from-red-600 to-rose-700",
  "cost-optimizer-agent": "from-emerald-500 to-green-600",
  "website-designer-agent": "from-fuchsia-500 to-pink-600",
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-green-500",
  PAUSED: "bg-red-500",
  DISABLED: "bg-red-700",
};

const TASK_STATUS_COLOR: Record<string, string> = {
  QUEUED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  RUNNING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  NEEDS_APPROVAL: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  APPROVED: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
  FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
  CANCELLED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function AgentCard({
  agent,
  onToggleStatus,
}: {
  agent: AgentSummary;
  onToggleStatus: (id: string, current: AgentSummary["status"]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const tierMeta = TIER_META[agent.tier] ?? TIER_META.SPECIALIST;
  const TierIcon = tierMeta.icon;
  const color = SLUG_COLOR[agent.slug] ?? tierMeta.color;
  const stats = agent.stats ?? { activeTasks: 0, completedToday: 0, totalTasks: 0, successRate: 100, failedTotal: 0 };
  const recentTasks = agent.recentTasks ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-5 hover:border-white/20 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
              <TierIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">{agent.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLOR[agent.status]} ${agent.status === "ACTIVE" ? "animate-pulse" : "opacity-90"}`} />
                <span className={`text-xs capitalize font-medium ${agent.status === "ACTIVE" ? "text-green-400" : "text-red-400"}`}>
                  {agent.status.toLowerCase()}
                </span>
                <Badge className="text-[10px] px-1.5 py-0 bg-white/5 border-white/10 text-gray-400">
                  {tierMeta.label}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-lg font-bold text-white">{stats.successRate}%</div>
              <div className="text-[10px] text-gray-500">success</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => onToggleStatus(agent.id, agent.status)}
            >
              {agent.status === "ACTIVE" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-center">
            <div className="text-xl font-bold text-blue-400">{stats.activeTasks}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Active</div>
          </div>
          <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-center">
            <div className="text-xl font-bold text-green-400">{stats.completedToday}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Today</div>
          </div>
          <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-center">
            <div className="text-xl font-bold text-purple-400">{stats.totalTasks}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Total</div>
          </div>
        </div>

        {/* Success rate bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Performance</span>
            <span>{stats.successRate}%</span>
          </div>
          <Progress value={stats.successRate} className="h-1.5" />
        </div>

        {/* Tools */}
        {agent.tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {agent.tools.slice(0, 4).map((tool) => (
              <span key={tool} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                {tool}
              </span>
            ))}
            {agent.tools.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">
                +{agent.tools.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Expand recent tasks */}
        {recentTasks.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors w-full"
            >
              <ListChecks className="w-3.5 h-3.5" />
              Recent tasks ({recentTasks.length})
              {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1.5">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-xs">
                        <Badge className={`text-[9px] px-1.5 py-0 shrink-0 ${TASK_STATUS_COLOR[task.status]}`}>
                          {task.status}
                        </Badge>
                        <span className="text-gray-400 truncate">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
          <Link to="/workspace" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 text-xs">
              Chat with Agent
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-2">
            <Settings className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AgentDashboard() {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "PAUSED" | "DISABLED">("ALL");

  const load = useCallback(async () => {
    try {
      setError(null);
      const [agentData, statsData] = await Promise.all([
        api.getAgentsSummary(),
        api.getCompanyStats(),
      ]);
      setAgents(agentData);
      setStats(statsData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleToggleStatus = async (id: string, current: AgentSummary["status"]) => {
    const nextStatus = current === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setTogglingId(id);
    try {
      await api.setAgentStatus(id, nextStatus);
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
      );
    } catch (e) {
      console.error("Failed to toggle agent status:", e);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = agents.filter((a) => filterStatus === "ALL" || a.status === filterStatus);
  const activeCount = agents.filter((a) => a.status === "ACTIVE").length;
  const totalActiveTasks = agents.reduce((sum, a) => sum + (a.stats?.activeTasks ?? 0), 0);
  const totalCompletedToday = agents.reduce((sum, a) => sum + (a.stats?.completedToday ?? 0), 0);
  const avgSuccess = agents.length
    ? Math.round(agents.reduce((sum, a) => sum + (a.stats?.successRate ?? 100), 0) / agents.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold">AI Agent Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {activeCount} Active
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Agents", value: loading ? "—" : String(activeCount), icon: Activity, color: "text-green-400" },
            { label: "Active Tasks", value: loading ? "—" : String(totalActiveTasks), icon: Clock, color: "text-blue-400" },
            { label: "Completed Today", value: loading ? "—" : String(totalCompletedToday), icon: CheckCircle2, color: "text-purple-400" },
            { label: "Avg. Success Rate", value: loading ? "—" : `${avgSuccess}%`, icon: Target, color: "text-orange-400" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-5">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["ALL", "ACTIVE", "PAUSED", "DISABLED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterStatus === s
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {s === "ALL" ? `All (${agents.length})` : `${s.charAt(0) + s.slice(1).toLowerCase()} (${agents.filter((a) => a.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Agent Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-[#111117]/50 border-white/10 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded mb-2 w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1, 2, 3].map((j) => <div key={j} className="h-14 bg-white/5 rounded-lg" />)}
                </div>
                <div className="h-2 bg-white/5 rounded-full" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Brain className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg">No agents found</p>
            <p className="text-sm mt-1">Try changing the filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={togglingId === agent.id ? { ...agent, status: agent.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : agent}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
