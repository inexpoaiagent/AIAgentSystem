import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  AlertTriangle,
  Brain,
  ChevronLeft,
  Clock,
  Container,
  GitBranch,
  KeyRound,
  MessagesSquare,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

const hierarchy = [
  { tier: "CEO", agents: ["CEO Agent"], color: "border-purple-500/50 bg-purple-500/10" },
  { tier: "Managers", agents: ["Planner", "Project Manager"], color: "border-blue-500/50 bg-blue-500/10" },
  { tier: "Specialists", agents: ["SEO", "Sales", "Social", "Content", "Finance", "Website Designer"], color: "border-cyan-500/40 bg-cyan-500/10" },
  { tier: "Governance", agents: ["QA", "Security", "Cost Optimizer"], color: "border-green-500/40 bg-green-500/10" },
];

const timeline = [
  ["00:00", "User requested a sales campaign", "Planner Agent"],
  ["00:04", "Company brain and CRM memory retrieved", "Context Engine"],
  ["00:09", "Agent meeting room created", "Meeting System"],
  ["00:21", "SEO, Sales, Social, Content, Finance debated plan", "Agent Discussion"],
  ["00:34", "Security Agent required approval for outbound messages", "Policy Engine"],
  ["00:41", "Cost Optimizer routed analysis to economy model", "Cost Layer"],
  ["00:58", "Consensus reached with 88.6% confidence", "Consensus Engine"],
];

const approvals = [
  { action: "Send WhatsApp follow-up to 42 leads", risk: "High", agent: "Sales Agent" },
  { action: "Publish 12 SEO articles to WordPress", risk: "High", agent: "SEO Agent" },
  { action: "Deploy generated landing page", risk: "Critical", agent: "Website Designer" },
];

const tools = [
  ["browser.audit", "Docker sandbox", "120s", "Low"],
  ["wordpress.publish", "Docker sandbox", "180s", "High"],
  ["email.send", "Trusted worker", "30s", "High"],
  ["code.generate", "Docker sandbox", "300s", "Medium"],
];

export default function AgentOS() {
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
            <Brain className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">Autonomous Agent OS</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <Radio className="w-3 h-3 mr-1" />
            Live execution
          </Badge>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-8">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Multi-Agent Orchestrator
            </Badge>
            <h2 className="text-4xl font-bold mb-3">Agents that plan, debate, execute, verify, and learn.</h2>
            <p className="text-gray-300 max-w-3xl mb-6">
              The orchestrator routes goals through a hierarchical AI company: CEO, managers, specialists, QA, security, and cost optimization. Every step is traced, metered, policy-checked, and memory-aware.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-black hover:bg-gray-100">
                <Play className="w-4 h-4 mr-2" />
                Run autonomous plan
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <MessagesSquare className="w-4 h-4 mr-2" />
                Open meeting room
              </Button>
            </div>
          </Card>

          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-300" />
              Cost optimization
            </h3>
            {[
              { model: "GPT-5 Reasoning", share: 24 },
              { model: "Claude Analysis", share: 18 },
              { model: "DeepSeek Economy", share: 42 },
              { model: "Local Models", share: 16 },
            ].map(({ model, share }) => (
              <div key={model} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">{model}</span>
                  <span>{share}%</span>
                </div>
                <Progress value={share} className="h-2" />
              </div>
            ))}
            <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-200">
              Saved $4,820 this month through cache hits, model routing, and local private-document reasoning.
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {hierarchy.map((group, index) => (
            <motion.div key={group.tier} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Card className={`h-full border p-5 ${group.color}`}>
                <h3 className="font-semibold mb-4">{group.tier}</h3>
                <div className="space-y-2">
                  {group.agents.map((agent) => (
                    <div key={agent} className="rounded-lg bg-black/25 border border-white/10 p-3 text-sm">
                      {agent}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6">
          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <MessagesSquare className="w-5 h-5 text-blue-300" />
              Agent meeting visualization
            </h2>
            <div className="relative min-h-[330px] rounded-xl border border-white/10 bg-black/25 overflow-hidden p-5">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              {[
                ["CEO", "top-6 left-1/2 -translate-x-1/2", "bg-purple-500/25 border-purple-500/40"],
                ["Planner", "top-28 left-12", "bg-blue-500/20 border-blue-500/40"],
                ["SEO", "top-28 right-12", "bg-cyan-500/20 border-cyan-500/40"],
                ["Sales", "bottom-20 left-16", "bg-pink-500/20 border-pink-500/40"],
                ["Finance", "bottom-20 right-16", "bg-yellow-500/20 border-yellow-500/40"],
                ["QA + Security", "bottom-6 left-1/2 -translate-x-1/2", "bg-green-500/20 border-green-500/40"],
              ].map(([label, position, color]) => (
                <div key={label} className={`absolute ${position} rounded-xl border ${color} px-4 py-3 text-sm backdrop-blur`}>
                  {label}
                </div>
              ))}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-blue-500/40 bg-blue-500/15 flex items-center justify-center text-center text-sm">
                88.6% consensus
              </div>
            </div>
          </Card>

          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-300" />
              Execution timeline
            </h2>
            <div className="space-y-3">
              {timeline.map(([time, event, owner]) => (
                <div key={`${time}-${event}`} className="grid grid-cols-[64px_1fr_auto] gap-3 rounded-lg bg-white/5 border border-white/10 p-3 items-center">
                  <span className="text-sm text-gray-400">{time}</span>
                  <span className="text-sm">{event}</span>
                  <Badge className="bg-white/5 text-gray-300 border-white/10">{owner}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-300" />
              Human approvals
            </h2>
            <div className="space-y-3">
              {approvals.map((approval) => (
                <div key={approval.action} className="rounded-lg bg-yellow-500/10 border border-yellow-500/25 p-4">
                  <div className="font-medium text-sm mb-1">{approval.action}</div>
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>{approval.agent}</span>
                    <Badge className={approval.risk === "Critical" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}>
                      {approval.risk}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Container className="w-5 h-5 text-cyan-300" />
              Tool execution sandbox
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tools.map(([tool, runtime, timeout, risk]) => (
                <div key={tool} className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{tool}</span>
                    <Badge className="bg-white/5 text-gray-300 border-white/10">{risk}</Badge>
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {runtime}</span>
                    <span>{timeout}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: GitBranch, title: "Event bus", desc: "NATS/Kafka ready" },
            { icon: Workflow, title: "Task queue", desc: "Retry + backoff" },
            { icon: KeyRound, title: "Approval layer", desc: "Sensitive action gates" },
            { icon: Zap, title: "Execution replay", desc: "Trace every step" },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-[#111117]/50 border-white/10 p-5">
              <Icon className="w-6 h-6 text-blue-300 mb-4" />
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-gray-400">{desc}</div>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
