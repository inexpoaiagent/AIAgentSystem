import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  ChevronLeft,
  Shield,
  Building2,
  CreditCard,
  Activity,
  Server,
  AlertTriangle,
  Cpu,
  Database,
  Radio,
} from "lucide-react";

const stats = [
  { label: "Companies", value: "1,284", icon: Building2, tone: "text-blue-400" },
  { label: "MRR", value: "$842k", icon: CreditCard, tone: "text-green-400" },
  { label: "AI tasks today", value: "2.7M", icon: Cpu, tone: "text-purple-400" },
  { label: "Voice minutes", value: "94k", icon: Radio, tone: "text-cyan-400" },
];

const systems = [
  { name: "Laravel API", value: 99, status: "healthy" },
  { name: "FastAPI AI Engine", value: 97, status: "healthy" },
  { name: "Horizon Queues", value: 91, status: "watch" },
  { name: "Qdrant Cluster", value: 96, status: "healthy" },
];

export default function AdminDashboard() {
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
            <h1 className="text-xl font-semibold">Super Admin Command Center</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-7 h-7 ${stat.tone}`} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Platform Health
            </h2>
            <div className="space-y-5">
              {systems.map((system) => (
                <div key={system.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{system.name}</span>
                    <Badge className={system.status === "healthy" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}>
                      {system.status}
                    </Badge>
                  </div>
                  <Progress value={system.value} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Realtime Operations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Queue throughput", "18,420 jobs/min"],
                ["Tenant namespaces", "1,284 isolated"],
                ["Open incidents", "2 warnings"],
                ["Avg voice latency", "142 ms"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <div className="text-sm text-gray-400 mb-1">{label}</div>
                  <div className="text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link to="/llm-management">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                  Manage LLM Providers
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5">Tenant Governance</h2>
            <div className="space-y-3">
              {["RealEstate Gulf LLC", "BrightWave Agency", "Northline Construction", "Atlas Ecommerce"].map((company, index) => (
                <div key={company} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 p-4">
                  <div>
                    <div className="font-medium">{company}</div>
                    <div className="text-sm text-gray-400">{index + 6} active agents - Qdrant namespace tenant_{1000 + index}</div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Professional</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-red-500/10 border-red-500/30 p-6">
            <AlertTriangle className="w-8 h-8 text-red-300 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Security Watchlist</h2>
            <p className="text-sm text-gray-300 mb-4">Two tenants exceeded browser automation rate thresholds. RBAC and token buckets limited execution automatically.</p>
            <Button variant="outline" className="border-red-500/40 text-red-200 hover:bg-red-500/10">Review Audit Logs</Button>
          </Card>
        </div>

        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Infrastructure Topology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
            {["Nginx", "Laravel API", "Redis Cluster", "PostgreSQL", "Qdrant", "FastAPI AI"].map((node) => (
              <div key={node} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">{node}</div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
