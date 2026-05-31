import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  ChevronLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe,
  MessageSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { locales } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import { createRuntimeEvent } from "../lib/runtime-store";

const copy = {
  en: {
    title: "AI CEO Command Center",
    subtitle: "A business doctor, executive boardroom, and autonomous execution desk for every subscribed company.",
    diagnose: "Diagnose company",
    meeting: "Start AI board meeting",
    action: "Approve growth plan",
    health: "Business Health Score",
    risks: "Risks detected",
    recommendations: "CEO recommendations",
    timeline: "Live execution timeline",
    board: "AI executive boardroom",
    workflows: "Autonomous workflows",
  },
  fa: {
    title: "مرکز فرماندهی AI CEO",
    subtitle: "دکتر بیزنس، اتاق جلسه مدیریتی و میز اجرای خودکار برای هر کمپانی دارای اشتراک.",
    diagnose: "آنالیز کمپانی",
    meeting: "شروع جلسه AI",
    action: "تایید برنامه رشد",
    health: "امتیاز سلامت بیزنس",
    risks: "ریسک‌های شناسایی‌شده",
    recommendations: "پیشنهادهای مدیرعامل AI",
    timeline: "تایم‌لاین اجرای زنده",
    board: "اتاق هیئت‌مدیره AI",
    workflows: "ورک‌فلوهای خودکار",
  },
  tr: {
    title: "AI CEO Komuta Merkezi",
    subtitle: "Her aboneli şirket için iş doktoru, yönetim kurulu odası ve otonom yürütme masası.",
    diagnose: "Şirketi analiz et",
    meeting: "AI toplantısı başlat",
    action: "Büyüme planını onayla",
    health: "İş Sağlığı Puanı",
    risks: "Tespit edilen riskler",
    recommendations: "AI CEO önerileri",
    timeline: "Canlı yürütme zaman çizelgesi",
    board: "AI yönetim odası",
    workflows: "Otonom iş akışları",
  },
} satisfies Record<Locale, Record<string, string>>;

const boardAgents = [
  { name: "CEO Agent", role: "Final decision", color: "from-purple-500 to-fuchsia-500", signal: 94 },
  { name: "Sales Agent", role: "Pipeline recovery", color: "from-blue-500 to-cyan-500", signal: 86 },
  { name: "SEO Agent", role: "Traffic growth", color: "from-emerald-500 to-teal-500", signal: 78 },
  { name: "Social Agent", role: "Audience demand", color: "from-pink-500 to-rose-500", signal: 72 },
  { name: "Finance Agent", role: "Budget control", color: "from-amber-500 to-orange-500", signal: 81 },
  { name: "QA Agent", role: "Quality gate", color: "from-slate-400 to-slate-200", signal: 89 },
];

const risks = [
  { title: "Lead response delay", desc: "Hot lead response time is 42 minutes above target.", level: "High", value: 74 },
  { title: "SEO content gap", desc: "Competitors own 31 high-intent property keywords.", level: "Medium", value: 61 },
  { title: "Social conversion leak", desc: "Instagram traffic is not mapped to CRM follow-ups.", level: "High", value: 69 },
];

const recommendations = [
  { title: "Launch AI CRM recovery", impact: "+28% pipeline clarity", owner: "CRM + Sales" },
  { title: "Publish 20 real estate SEO articles", impact: "+18 organic rankings", owner: "SEO + Content" },
  { title: "Create Meta lead campaign", impact: "+140 qualified leads", owner: "Social + Finance" },
  { title: "Generate premium property website", impact: "+16% conversion lift", owner: "Website Designer" },
];

const workflows = [
  ["Website + social audit", 100, "Completed"],
  ["AI board debate", 86, "Running"],
  ["CRM pipeline setup", 64, "Approval needed"],
  ["SEO repair workflow", 48, "Queued"],
  ["Accounting dashboard", 35, "Queued"],
];

const timeline = [
  ["00:00", "Company connected website, Instagram, Facebook, and YouTube.", "Intake"],
  ["00:07", "Business Doctor detected SEO, design, content, and lead gaps.", "Diagnosis"],
  ["00:18", "CEO Agent opened a multi-agent boardroom.", "Meeting"],
  ["00:31", "Sales, SEO, Social, Finance, and Website Agents voted on growth plan.", "Consensus"],
  ["00:44", "Human approval requested before CRM outreach and ad spend.", "Governance"],
];

export default function CEOCommandCenter() {
  const [locale, setLocale] = useState<Locale>("en");
  const text = copy[locale];
  const dir = locales[locale].dir;
  const score = 87;

  const runtimeSummary = useMemo(
    () => [
      { label: "Revenue forecast", value: "+$128K", icon: DollarSign, tone: "text-emerald-300" },
      { label: "Qualified leads", value: "847", icon: Users, tone: "text-blue-300" },
      { label: "SEO score", value: "87/100", icon: Globe, tone: "text-cyan-300" },
      { label: "AI cost saved", value: "$4.8K", icon: Zap, tone: "text-amber-300" },
    ],
    [],
  );

  const approvePlan = () => {
    createRuntimeEvent({
      type: "approval",
      title: "CEO growth plan approval requested",
      detail: "Human approval is required before outbound CRM messages, campaign spend, and website deployment.",
      status: "needs_approval",
    });
  };

  return (
    <div dir={dir} className="min-h-screen bg-[#08090f] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-300" />
            <span className="font-semibold">{text.title}</span>
          </div>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
            className="h-9 rounded-md border border-white/10 bg-white/5 px-2 text-sm outline-none"
            aria-label="Language"
          >
            {Object.entries(locales).map(([key, value]) => (
              <option key={key} value={key} className="bg-[#111117]">
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/20 via-purple-600/10 to-cyan-500/10 p-7">
            <Badge className="mb-4 border-blue-500/30 bg-blue-500/20 text-blue-200">
              <Sparkles className="mr-1 h-3 w-3" />
              AI Company Operating System
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{text.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-300">{text.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/business-doctor">
                <Button className="bg-white text-black hover:bg-gray-100">
                  {text.diagnose}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/meeting">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {text.meeting}
                </Button>
              </Link>
              <Button onClick={approvePlan} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <ShieldCheck className="mr-2 h-4 w-4" />
                {text.action}
              </Button>
            </div>
          </Card>

          <Card className="border-white/10 bg-[#111117]/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{text.health}</div>
                <div className="text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  {score}
                </div>
              </div>
              <Badge className="border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
                <Radio className="mr-1 h-3 w-3" />
                Live
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {runtimeSummary.map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <Icon className={`mb-3 h-5 w-5 ${tone}`} />
                  <div className="text-xl font-semibold">{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-white/10 bg-[#111117]/60 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
              <Users className="h-5 w-5 text-blue-300" />
              {text.board}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {boardAgents.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${agent.color}`} />
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.role}</div>
                    </div>
                  </div>
                  <Progress value={agent.signal} className="h-2" />
                  <div className="mt-2 text-xs text-gray-400">{agent.signal}% confidence</div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-[#111117]/60 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
              <AlertTriangle className="h-5 w-5 text-amber-300" />
              {text.risks}
            </h2>
            <div className="space-y-3">
              {risks.map((risk) => (
                <div key={risk.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{risk.title}</div>
                      <div className="text-sm text-gray-400">{risk.desc}</div>
                    </div>
                    <Badge className="border-amber-500/30 bg-amber-500/20 text-amber-300">{risk.level}</Badge>
                  </div>
                  <Progress value={risk.value} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-white/10 bg-[#111117]/60 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
              <TrendingUp className="h-5 w-5 text-emerald-300" />
              {text.recommendations}
            </h2>
            <div className="space-y-3">
              {recommendations.map((item) => (
                <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>{item.owner}</span>
                    <span className="text-emerald-300">{item.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-[#111117]/60 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
              <Workflow className="h-5 w-5 text-cyan-300" />
              {text.workflows}
            </h2>
            <div className="space-y-4">
              {workflows.map(([name, progress, status]) => (
                <div key={name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{name}</span>
                    <span className="text-gray-400">{status}</span>
                  </div>
                  <Progress value={Number(progress)} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-[#111117]/60 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
              <Clock className="h-5 w-5 text-purple-300" />
              {text.timeline}
            </h2>
            <div className="space-y-3">
              {timeline.map(([time, event, owner]) => (
                <div key={`${time}-${event}`} className="grid grid-cols-[54px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <span className="text-xs text-gray-400">{time}</span>
                  <div>
                    <div className="text-sm">{event}</div>
                    <div className="mt-1 text-xs text-blue-300">{owner}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { icon: BarChart3, title: "Predictive growth", desc: "Forecasts sales, SEO, churn, and ad spend." },
            { icon: CheckCircle2, title: "Human approval", desc: "Gates email, spend, publish, deploy, and delete actions." },
            { icon: Brain, title: "Company brain", desc: "Keeps tenant memory, brand voice, CRM context, and SOPs." },
            { icon: ShieldCheck, title: "Enterprise control", desc: "RBAC, audit logs, sandboxed tools, and trace replay." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-white/10 bg-white/[0.04] p-5">
              <Icon className="mb-4 h-6 w-6 text-blue-300" />
              <div className="font-semibold">{title}</div>
              <div className="mt-1 text-sm text-gray-400">{desc}</div>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
