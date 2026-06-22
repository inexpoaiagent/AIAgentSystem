import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  ChevronLeft, Shield, Bot, Activity, Server, AlertTriangle,
  Cpu, Database, Workflow, Brain, RefreshCw, Users, Building2, Layers, Tag,
} from "lucide-react";
import { api, CompanyStats } from "../lib/api";

const SYSTEMS = [
  { name: "NestJS API", key: "api" },
  { name: "FastAPI AI Engine", key: "ai" },
  { name: "MariaDB Database", key: "db" },
  { name: "WebSocket Gateway", key: "ws" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const s = await api.getCompanyStats();
      setStats(s);

      // Test backend and AI engine health
      const [apiOk, aiOk] = await Promise.all([
        fetch("/v1/auth/me", { headers: { Authorization: `Bearer ${localStorage.getItem("ai_os_auth") ? JSON.parse(localStorage.getItem("ai_os_auth")!).accessToken : ""}` } })
          .then((r) => r.ok).catch(() => false),
        fetch("http://localhost:8000/health").then((r) => r.ok).catch(() => false),
      ]);

      setSystemHealth({
        api: apiOk ? 99 : 0,
        ai: aiOk ? 97 : 0,
        db: s ? 98 : 0,
        ws: 95,
      });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 20_000);
    return () => clearInterval(i);
  }, []);

  const topStats = [
    { label: "Active Agents", value: stats ? String(stats.activeAgents) : "—", icon: Bot, tone: "text-blue-400" },
    { label: "Total Tasks", value: stats ? String(stats.totalTasks) : "—", icon: Cpu, tone: "text-purple-400" },
    { label: "Active Workflows", value: stats ? String(stats.activeWorkflows) : "—", icon: Workflow, tone: "text-green-400" },
    { label: "Company Memories", value: stats ? String(stats.totalMemories) : "—", icon: Brain, tone: "text-cyan-400" },
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
            <Shield className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">Admin Command Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Real stats from DB */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topStats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-7 h-7 ${stat.tone}`} />
                  <span className={`text-3xl font-bold ${loading ? "animate-pulse text-gray-600" : ""}`}>
                    {stat.value}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          {/* System Health */}
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Platform Health
            </h2>
            <div className="space-y-5">
              {SYSTEMS.map((system) => {
                const val = systemHealth[system.key] ?? 0;
                const isHealthy = val > 80;
                return (
                  <div key={system.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{system.name}</span>
                      <Badge className={isHealthy
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : val > 0 ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                      }>
                        {isHealthy ? "healthy" : val > 0 ? "degraded" : "offline"}
                      </Badge>
                    </div>
                    <Progress value={loading ? undefined : val} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Operations */}
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              System Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["API Prefix", "/v1"],
                ["Port", "8080 (backend)"],
                ["AI Engine", "8000 (FastAPI)"],
                ["Frontend", "5173 (Vite)"],
                ["Database", "MariaDB 10.4"],
                ["Auth", "JWT + Refresh"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                  <div className="text-sm font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-3 flex-wrap">
              <Link to="/llm-management">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-sm">
                  Manage LLM Providers
                </Button>
              </Link>
              <Link to="/agents">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm">
                  View Agents
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick links */}
          <Card className="lg:col-span-2 bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "User Management", href: "/admin/users", icon: Users },
                { label: "Companies", href: "/admin/companies", icon: Building2 },
                { label: "Business Categories", href: "/admin/categories", icon: Tag },
                { label: "Industry Packs", href: "/admin/packs", icon: Layers },
                { label: "Agent Dashboard", href: "/agents", icon: Bot },
                { label: "Company Brain", href: "/brain", icon: Brain },
                { label: "Analytics", href: "/analytics", icon: Activity },
                { label: "Automation", href: "/automation", icon: Workflow },
                { label: "Audit Logs", href: "/qa-audit", icon: Shield },
                { label: "Subscriptions", href: "/subscription", icon: Database },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href} to={href}>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                    <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-sm">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Alert */}
          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mb-4" />
            <h2 className="text-xl font-semibold mb-3">System Notes</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Redis not connected — WebSocket events stored in-memory</p>
              <p>• Qdrant not running — vector search disabled</p>
              <p>• Add OPENAI_API_KEY to enable real AI responses</p>
            </div>
            <Link to="/llm-management" className="mt-4 block">
              <Button variant="outline" size="sm" className="border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10 w-full">
                Configure LLM
              </Button>
            </Link>
          </Card>
        </div>

        {/* Infrastructure */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Infrastructure Topology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
            {["Vite Frontend", "NestJS API", "MariaDB", "FastAPI AI", "Socket.IO", "Prisma ORM"].map((node) => (
              <div key={node} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-gray-300">
                {node}
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
