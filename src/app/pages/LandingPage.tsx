import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { landingCopy, locales } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Code2,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  Layers,
  Lock,
  MessageSquare,
  Play,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

const useCases = [
  ["SEO growth", "Audit sites, research keywords, publish optimized content, and track rankings."],
  ["CRM automation", "Score leads, schedule follow-ups, summarize customers, and improve conversion."],
  ["Social operations", "Plan content calendars, generate captions, schedule posts, and analyze engagement."],
  ["Finance insights", "Generate invoices, monitor credits, analyze expenses, and forecast profit."],
  ["Website design", "Create responsive landing pages, SaaS websites, ecommerce pages, and dashboards."],
  ["Executive reporting", "Turn activity, revenue, usage, and agent output into board-ready reports."],
];

const agentRows = [
  { name: "Planner Agent", work: "Breaks goals into safe execution plans", progress: 92, icon: Brain },
  { name: "SEO Agent", work: "Auditing technical SEO and keyword gaps", progress: 78, icon: TrendingUp },
  { name: "CRM Agent", work: "Scoring 42 leads and assigning follow-ups", progress: 64, icon: Users },
  { name: "Website Designer Agent", work: "Building a responsive SaaS landing page", progress: 51, icon: Layers },
];

const plans = [
  ["Starter", "$299", "5 agents", "100 voice minutes", "10k AI operations", "Email support"],
  ["Professional", "$799", "15 agents", "500 voice minutes", "100k AI operations", "API access"],
  ["Enterprise", "Custom", "Unlimited agents", "SSO and SLA", "Custom LLM routing", "Dedicated support"],
];

const faqs = [
  ["Is this only a chatbot?", "No. The platform combines agents, workflows, memory, billing, CRM, SEO, social, tickets, and admin operations."],
  ["Can each company have isolated data?", "Yes. Tenant ID scoping, vector namespaces, RBAC, audit logs, and encrypted tool secrets are part of the architecture."],
  ["Does it support voice?", "Yes. The product includes a realtime voice session shell with WebRTC-ready state handling and provider token exchange."],
  ["Can admins manage LLM providers?", "Yes. Admin surfaces cover providers, API keys, routing, rate limits, token tracking, and failover policy."],
];

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const copy = landingCopy[locale];
  const dir = locales[locale].dir;

  return (
    <div dir={dir} className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.2),transparent_28%),linear-gradient(180deg,#0a0a0f,#08080d)]" />

      <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-semibold">AI Business OS</span>
          </Link>
          <div className="hidden lg:flex items-center gap-7 text-sm text-gray-300">
            {copy.nav.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-white">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              className="h-9 rounded-md bg-white/5 border border-white/10 px-2 text-sm outline-none"
              aria-label="Language"
            >
              {Object.entries(locales).map(([key, value]) => (
                <option key={key} value={key} className="bg-[#111117]">
                  {value.label}
                </option>
              ))}
            </select>
            <Link to="/signin">
              <Button variant="ghost" className="text-white hover:bg-white/10">{copy.signIn}</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-white text-black hover:bg-gray-100">{copy.cta}</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="px-4 pt-16 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                {copy.badge}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                {copy.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">{copy.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button size="lg" className="h-12 px-7 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    {copy.primary}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/workspace">
                  <Button size="lg" variant="outline" className="h-12 px-7 border-white/20 text-white hover:bg-white/10">
                    <Play className="w-4 h-4 mr-2" />
                    {copy.secondary}
                  </Button>
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
                {["98.4% task success", "142 ms voice latency", "1,284 tenants"].map((metric) => (
                  <div key={metric} className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm text-gray-300">
                    {metric}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
              <div className="rounded-xl border border-white/10 bg-[#111117]/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 overflow-hidden">
                <div className="border-b border-white/10 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{copy.previewTitle}</div>
                    <div className="text-sm text-gray-400">{copy.previewSubtitle}</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Live</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[0.55fr_0.45fr] gap-0">
                  <div className="p-5 border-r border-white/10">
                    <div className="space-y-4">
                      {agentRows.map((agent, index) => (
                        <div key={agent.name} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                              <agent.icon className="w-5 h-5 text-blue-300" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-xs text-gray-400">{agent.work}</div>
                            </div>
                            <span className="text-sm text-gray-300">{agent.progress}%</span>
                          </div>
                          <Progress value={agent.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-4">
                      <div className="text-sm text-gray-300 mb-2">Suggested workflow</div>
                      <div className="font-semibold mb-3">Lead to revenue recovery</div>
                      {["Capture lead", "AI qualification", "CRM update", "WhatsApp follow-up", "Manager report"].map((step) => (
                        <div key={step} className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                          <Check className="w-4 h-4 text-green-300" />
                          {step}
                        </div>
                      ))}
                    </Card>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["Revenue", "+23%"],
                        ["Leads", "+41%"],
                        ["SEO", "+18"],
                        ["Tickets", "2 open"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-white/5 border border-white/10 p-4">
                          <div className="text-xs text-gray-400">{label}</div>
                          <div className="text-2xl font-bold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="use-cases" className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <SectionTitle eyebrow="Use cases" title="Every business function gets an AI teammate." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {useCases.map(([title, desc], index) => (
                <motion.div key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
                  <Card className="h-full bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="agents" className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <SectionTitle eyebrow="Agents" title="Specialized agents with memory, tools, templates, and analytics." />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                { icon: TrendingUp, label: "SEO Agent" },
                { icon: FileText, label: "Content Agent" },
                { icon: MessageSquare, label: "Social Media Agent" },
                { icon: Users, label: "CRM Agent" },
                { icon: CreditCard, label: "Accounting Agent" },
                { icon: BarChart3, label: "Sales Manager Agent" },
                { icon: Sparkles, label: "Idea Generator Agent" },
                { icon: Globe, label: "Website Designer Agent" },
              ].map(({ icon: Icon, label }) => (
                <Card key={label} className="bg-[#111117]/50 border-white/10 p-5">
                  <Icon className="w-6 h-6 text-blue-300 mb-4" />
                  <div className="font-medium">{label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="px-4 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#111117]/50 border-white/10 p-8">
              <Workflow className="w-8 h-8 text-purple-300 mb-5" />
              <h2 className="text-3xl font-bold mb-4">From request to execution.</h2>
              <p className="text-gray-400 mb-6">Planner Agent turns business goals into approved workflows, runs specialist agents, and records outcomes into company memory.</p>
              {["User asks by chat or voice", "Planner creates a safe plan", "Agents collaborate in a meeting", "Tools execute approved actions", "Reports and billing update automatically"].map((step, index) => (
                <div key={step} className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm">{index + 1}</span>
                  <span className="text-sm text-gray-300">{step}</span>
                </div>
              ))}
            </Card>
            <Card className="bg-[#111117]/50 border-white/10 p-8">
              <Code2 className="w-8 h-8 text-cyan-300 mb-5" />
              <h2 className="text-3xl font-bold mb-4">API-first and integration ready.</h2>
              <pre className="rounded-lg bg-black/40 border border-white/10 p-4 text-xs text-gray-300 overflow-x-auto">
{`POST /v1/agent-tasks
{
  "message": "Audit SEO and create a 30-day content plan",
  "approvalMode": "manual",
  "agentSlugs": ["planner", "seo", "content"]
}`}
              </pre>
            </Card>
          </div>
        </section>

        <section id="pricing" className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <SectionTitle eyebrow="Pricing" title="Plans built for real usage, teams, and enterprise governance." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card key={plan[0]} className={`bg-[#111117]/50 border-white/10 p-8 ${index === 1 ? "border-blue-500/50 shadow-2xl shadow-blue-500/15" : ""}`}>
                  {index === 1 && <Badge className="mb-4 bg-blue-500 text-white border-0">Most popular</Badge>}
                  <h3 className="text-2xl font-bold mb-2">{plan[0]}</h3>
                  <div className="text-4xl font-bold mb-6">{plan[1]}</div>
                  <div className="space-y-3 mb-8">
                    {plan.slice(2).map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Link to="/signup">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">Choose plan</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="px-4 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: "Tenant isolation", desc: "Tenant-scoped data, vector namespaces, RBAC, and audit trails." },
              { icon: Lock, title: "Secure execution", desc: "Encrypted API keys, approval policies, rate limits, and tool permissions." },
              { icon: Zap, title: "Production operations", desc: "Queues, monitoring, usage billing, CI/CD, backups, and Kubernetes manifests." },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="bg-[#111117]/50 border-white/10 p-6">
                <Icon className="w-7 h-7 text-blue-300 mb-4" />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#111117]/50 border-white/10 p-8">
              <SectionTitle eyebrow="Testimonials" title="Built for operators, founders, agencies, and teams." compact />
              {["The AI meeting room found our sales follow-up gap in one session.", "The SEO and CRM agents finally connect content to revenue.", "Our admin team can see billing, tickets, token usage, and incidents in one place."].map((quote) => (
                <div key={quote} className="border-t border-white/10 py-4">
                  <div className="flex gap-1 mb-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />)}</div>
                  <p className="text-sm text-gray-300">{quote}</p>
                </div>
              ))}
            </Card>
            <Card className="bg-[#111117]/50 border-white/10 p-8">
              <SectionTitle eyebrow="Comparison" title="More than ChatGPT plus dashboards." compact />
              {["Company memory and isolated tenant data", "Autonomous workflows with approvals", "Admin billing, tickets, notifications, and LLM routing", "CRM, SEO, social, accounting, and website design modules"].map((item) => (
                <div key={item} className="flex items-center gap-3 mb-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-300" />
                  {item}
                </div>
              ))}
            </Card>
          </div>
        </section>

        <section id="faq" className="px-4 py-16 pb-24">
          <div className="max-w-4xl mx-auto">
            <SectionTitle eyebrow="FAQ" title="Clear answers for new users." />
            <div className="space-y-3">
              {faqs.map(([question, answer]) => (
                <Card key={question} className="bg-[#111117]/50 border-white/10 p-5">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">{question}</h3>
                      <p className="text-sm text-gray-400">{answer}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ eyebrow, title, compact = false }: { eyebrow: string; title: string; compact?: boolean }) {
  return (
    <div className={compact ? "mb-6" : "text-center mb-10"}>
      <Badge className="mb-3 bg-white/5 text-blue-300 border-white/10">{eyebrow}</Badge>
      <h2 className={`${compact ? "text-2xl" : "text-3xl md:text-4xl"} font-bold`}>{title}</h2>
    </div>
  );
}
