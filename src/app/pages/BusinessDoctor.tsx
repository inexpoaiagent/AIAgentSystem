import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { doctorCopy, Locale, locales } from "../lib/i18n";
import { createRuntimeEvent, getSession, saveSession } from "../lib/runtime-store";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Languages,
  LineChart,
  Loader2,
  Megaphone,
  MessageSquare,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
  Youtube,
} from "lucide-react";

type ChannelForm = {
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  industry: string;
};

const initialForm: ChannelForm = {
  website: "https://example-realestate.com",
  instagram: "https://instagram.com/example.realestate",
  facebook: "https://facebook.com/example.realestate",
  youtube: "https://youtube.com/@example-realestate",
  industry: "Real Estate",
};

const modules = [
  {
    title: "SEO Doctor",
    score: 61,
    icon: TrendingUp,
    issues: ["Service pages have weak keyword targeting", "Core Web Vitals need optimization", "No local real estate schema found"],
    actions: ["Build Dubai luxury property topic cluster", "Create schema and sitemap tasks", "Generate 20 SEO briefs"],
  },
  {
    title: "Website UX Doctor",
    score: 68,
    icon: Globe,
    issues: ["Primary CTA is below first viewport", "Property inquiry flow has too many fields", "Mobile listing cards need stronger visual hierarchy"],
    actions: ["Redesign landing page hero", "Simplify lead form", "Generate new website with Website Designer Agent"],
  },
  {
    title: "Content Doctor",
    score: 57,
    icon: FileText,
    issues: ["Content does not match luxury buyer intent", "No consistent weekly publishing plan", "Instagram captions are generic"],
    actions: ["Create 30-day content calendar", "Generate multilingual captions", "Write buyer education articles"],
  },
  {
    title: "Social Growth Doctor",
    score: 54,
    icon: Instagram,
    issues: ["Low save/share ratio", "Weak short-form video hooks", "Facebook retargeting is not connected to CRM"],
    actions: ["Build Instagram campaign", "Create retargeting audience", "Sync lead ads to CRM"],
  },
  {
    title: "Lead & Sales Doctor",
    score: 49,
    icon: Users,
    issues: ["Lead response time is too slow", "No lead scoring model", "Hot leads are not assigned automatically"],
    actions: ["Launch CRM pipeline", "Activate AI sales follow-up", "Create WhatsApp response workflow"],
  },
  {
    title: "Finance Doctor",
    score: 72,
    icon: WalletCards,
    issues: ["Campaign ROI is not tracked per channel", "No projected revenue dashboard", "Agent cost needs budget caps"],
    actions: ["Create profit forecast", "Connect invoices and expenses", "Set AI cost guardrails"],
  },
];

const competitors = [
  "Better Instagram reels cadence",
  "Higher local SEO authority",
  "Clearer property inquiry funnel",
  "More trust signals above the fold",
];

export default function BusinessDoctor() {
  const session = getSession<{ industry?: string; businessChannels?: ChannelForm }>();
  const [locale, setLocale] = useState<Locale>("en");
  const [form, setForm] = useState<ChannelForm>({
    ...initialForm,
    industry: session.industry ?? initialForm.industry,
    ...session.businessChannels,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasReport, setHasReport] = useState(false);
  const copy = doctorCopy[locale];

  const overallScore = useMemo(
    () => Math.round(modules.reduce((sum, module) => sum + module.score, 0) / modules.length),
    [],
  );

  const update = (key: keyof ChannelForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const runAnalysis = async () => {
    const missing = Object.entries(form).filter(([, value]) => !value.trim());
    if (missing.length > 0) {
      toast.error("Complete all channels", { description: "Website, social channels, and industry are required for a full diagnosis." });
      return;
    }

    setIsAnalyzing(true);
    createRuntimeEvent({
      type: "action",
      title: "Business Doctor analysis started",
      detail: `Analyzing ${form.website}, Instagram, Facebook, YouTube, CRM readiness, SEO, design, leads, and content.`,
      status: "running",
    });
    await new Promise((resolve) => setTimeout(resolve, 900));
    saveSession({ ...session, businessChannels: form, lastBusinessDiagnosisScore: overallScore });
    createRuntimeEvent({
      type: "audit",
      title: "Business Doctor diagnosis completed",
      detail: `${form.industry} scored ${overallScore}/100. AI team proposed CRM, SEO, social, website, sales, and finance actions.`,
      status: "completed",
    });
    setHasReport(true);
    setIsAnalyzing(false);
    toast.success("Diagnosis ready", { description: "AI agents generated a full business health report and action plan." });
  };

  const queueAction = (title: string, risk: "low" | "medium" | "high" = "medium") => {
    createRuntimeEvent({
      type: risk === "high" ? "approval" : "action",
      title,
      detail:
        risk === "high"
          ? "This action is ready but requires human approval before sending messages, publishing, or changing connected systems."
          : "The AI team queued this action with trace logging and automation workflow context.",
      status: risk === "high" ? "needs_approval" : "queued",
    });
    toast(risk === "high" ? "Approval required" : "Action queued", {
      description: title,
    });
  };

  return (
    <div dir={locales[locale].dir} className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">{copy.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-400" />
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              className="h-9 rounded-md bg-white/5 border border-white/10 px-2 text-sm outline-none"
            >
              {Object.entries(locales).map(([key, value]) => (
                <option key={key} value={key} className="bg-[#111117]">
                  {value.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-8">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI CEO Platform
            </Badge>
            <h2 className="text-4xl font-bold mb-3">{copy.title}</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{copy.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ChannelInput label={copy.website} icon={Globe} value={form.website} onChange={(value) => update("website", value)} />
              <ChannelInput label={copy.instagram} icon={Instagram} value={form.instagram} onChange={(value) => update("instagram", value)} />
              <ChannelInput label={copy.facebook} icon={Facebook} value={form.facebook} onChange={(value) => update("facebook", value)} />
              <ChannelInput label={copy.youtube} icon={Youtube} value={form.youtube} onChange={(value) => update("youtube", value)} />
            </div>
            <div className="mt-3">
              <ChannelInput label={copy.industry} icon={Building2} value={form.industry} onChange={(value) => update("industry", value)} />
            </div>
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="mt-5 w-full h-12 bg-white text-black hover:bg-gray-100"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
              {isAnalyzing ? copy.analyzing : copy.analyze}
            </Button>
          </Card>

          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{copy.diagnosis}</h2>
                <p className="text-sm text-gray-400">Business health, lead leaks, SEO gaps, social performance, and execution roadmap.</p>
              </div>
              <Badge className={hasReport ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}>
                {hasReport ? "Report ready" : "Awaiting analysis"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-center">
              <div className="aspect-square rounded-full border border-blue-500/30 bg-blue-500/10 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{hasReport ? overallScore : "--"}</span>
                <span className="text-sm text-gray-400">Health score</span>
              </div>
              <div className="space-y-4">
                {[
                  ["Lead capture", 49],
                  ["SEO visibility", 61],
                  ["Social growth", 54],
                  ["Website conversion", 68],
                ].map(([label, score]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{label as string}</span>
                      <span>{hasReport ? `${score}/100` : "Pending"}</span>
                    </div>
                    <Progress value={hasReport ? Number(score) : 0} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
              {[
                { label: "AI CRM Manager", icon: Users },
                { label: "AI Sales Director", icon: MessageSquare },
                { label: "AI Growth Strategist", icon: LineChart },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <item.icon className="w-5 h-5 text-blue-300 mb-3" />
                  <div className="font-medium text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {hasReport && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {modules.map((module) => (
                <Card key={module.title} className="bg-[#111117]/50 border-white/10 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                        <module.icon className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <div className="text-xs text-gray-400">AI diagnosis module</div>
                      </div>
                    </div>
                    <Badge className={module.score < 60 ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}>
                      {module.score}/100
                    </Badge>
                  </div>
                  <Progress value={module.score} className="h-2 mb-4" />
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Problems</div>
                    <div className="space-y-2">
                      {module.issues.map((issue) => (
                        <div key={issue} className="flex items-start gap-2 text-sm text-gray-300">
                          <AlertTriangle className="w-4 h-4 text-yellow-300 mt-0.5 shrink-0" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">AI can fix</div>
                    <div className="space-y-2">
                      {module.actions.map((action) => (
                        <button
                          key={action}
                          onClick={() => queueAction(action, action.includes("WhatsApp") || action.includes("Publish") ? "high" : "medium")}
                          className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-left text-sm hover:border-blue-500/40 transition-colors"
                        >
                          <CheckCircle2 className="inline w-4 h-4 text-green-300 mr-2" />
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6">
              <Card className="bg-[#111117]/50 border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-300" />
                  AI agent meeting outcome
                </h2>
                {[
                  ["CEO Agent", "Prioritize lead response and website conversion before scaling ads."],
                  ["CRM Agent", "Create pipeline, score all leads, and assign hot prospects instantly."],
                  ["SEO Agent", "Fix technical SEO and launch local luxury real estate content cluster."],
                  ["Social Agent", "Build Instagram and Facebook campaigns connected to CRM."],
                  ["Finance Agent", "Track cost per lead, forecast sales, and cap AI/ad spend."],
                ].map(([agent, message]) => (
                  <div key={agent} className="rounded-lg bg-white/5 border border-white/10 p-4 mb-3">
                    <div className="font-medium text-sm mb-1">{agent}</div>
                    <p className="text-sm text-gray-400">{message}</p>
                  </div>
                ))}
              </Card>

              <Card className="bg-[#111117]/50 border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-blue-300" />
                  Autonomous action center
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { title: "Launch AI CRM", icon: Users, risk: "medium" as const },
                    { title: "Create Facebook lead campaign", icon: Facebook, risk: "high" as const },
                    { title: "Generate real estate website", icon: Globe, risk: "medium" as const },
                    { title: "Schedule AI strategy meeting", icon: Brain, risk: "medium" as const },
                    { title: "Build SEO repair workflow", icon: TrendingUp, risk: "medium" as const },
                    { title: "Create accounting dashboard", icon: WalletCards, risk: "medium" as const },
                  ].map((action) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      onClick={() => queueAction(action.title, action.risk)}
                      className="h-auto justify-start border-white/10 bg-white/5 p-4 text-white hover:bg-white/10"
                    >
                      <action.icon className="w-5 h-5 mr-3 text-blue-300" />
                      <span className="text-left">{action.title}</span>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  ))}
                </div>
                <div className="mt-5 rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-100">
                  <ShieldCheck className="inline w-4 h-4 mr-2" />
                  Sensitive actions like messaging leads, publishing content, running ads, or changing a website require human approval.
                </div>
              </Card>
            </section>

            <Card className="bg-[#111117]/50 border-white/10 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-300" />
                Competitor intelligence to add next
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {competitors.map((item) => (
                  <div key={item} className="rounded-lg bg-white/5 border border-white/10 p-4 text-sm text-gray-300">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

function ChannelInput({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: typeof Globe;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm text-gray-300">
        <Icon className="w-4 h-4 text-blue-300" />
        {label}
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-black/30 border-white/10 text-white"
      />
    </label>
  );
}
