import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ChevronLeft, Network, Server, Database, Brain, Radio, ShieldCheck } from "lucide-react";

const layers = [
  { name: "Frontend", detail: "React/Vite workspace, realtime UX, WebRTC voice shell", icon: Radio },
  { name: "Laravel API", detail: "Tenancy, billing, RBAC, audit logs, queues, WebSockets", icon: Server },
  { name: "AI Engine", detail: "FastAPI orchestration, planner, agent graph, tool execution", icon: Brain },
  { name: "Memory Plane", detail: "Redis short-term, PostgreSQL long-term, Qdrant vector namespaces", icon: Database },
  { name: "Security", detail: "Tenant isolation, encrypted secrets, policy-gated tools, monitoring", icon: ShieldCheck },
];

export default function Architecture() {
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
            <Network className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">Production Architecture</h1>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Enterprise blueprint</Badge>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-8">
          <h2 className="text-4xl font-bold mb-3">AI Business Operating System architecture</h2>
          <p className="text-gray-300 max-w-4xl">
            A multi-tenant SaaS control plane with isolated company memory, event-driven automation, realtime voice, autonomous agents, usage billing, and Kubernetes-ready services.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {layers.map((layer) => (
            <Card key={layer.name} className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-5">
              <layer.icon className="w-7 h-7 text-blue-400 mb-4" />
              <h3 className="font-semibold mb-2">{layer.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{layer.detail}</p>
            </Card>
          ))}
        </div>

        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 overflow-x-auto">
          <pre className="text-sm text-gray-300 leading-7">
{`User Voice/Chat
  -> Realtime Gateway (WebRTC + WebSockets)
  -> Laravel Tenant API (auth, billing, RBAC, audit)
  -> Planner Agent (FastAPI)
  -> AI Meeting Graph (LangGraph/AutoGen)
  -> Specialized Agents (SEO, Sales, CRM, Social, Finance)
  -> Secure Tool Runner (Playwright, WordPress, CRM, Email)
  -> Memory Plane (Redis + PostgreSQL + Qdrant)
  -> Reports, actions, invoices, analytics`}
          </pre>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Tenant isolation model</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>Company-scoped database records via tenant_id and RBAC policies.</li>
              <li>Qdrant collection namespace per company and memory class.</li>
              <li>Encrypted tool credentials bound to tenant, user, and agent grants.</li>
              <li>Queue jobs carry tenant context and emit audit events on every tool call.</li>
            </ul>
          </Card>
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Realtime voice path</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>Browser captures audio through WebRTC with interruption handling.</li>
              <li>Realtime provider streams transcripts, intent, and audio deltas.</li>
              <li>Planner can route voice commands into workflows or AI meetings.</li>
              <li>Conversation summaries are embedded into company memory after approval.</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
