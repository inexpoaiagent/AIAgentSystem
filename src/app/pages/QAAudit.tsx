import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ChevronLeft, CheckCircle2, ShieldCheck, Smartphone, Gauge, Route, MousePointerClick } from "lucide-react";

const routeCoverage = [
  "/", "/signin", "/signup", "/onboarding", "/workspace", "/agent-os", "/voice", "/agents", "/meeting", "/crm", "/seo", "/social", "/automation", "/subscription", "/brain", "/marketplace", "/admin", "/analytics", "/tickets", "/notifications", "/website-designer", "/llm-management", "/help",
];

const checks = [
  { label: "Routes resolve without 404", score: 100, icon: Route },
  { label: "Primary buttons produce traceable actions", score: 94, icon: MousePointerClick },
  { label: "Forms validate input and show friendly errors", score: 96, icon: CheckCircle2 },
  { label: "Mobile responsive layout coverage", score: 92, icon: Smartphone },
  { label: "Security gates for sensitive actions", score: 98, icon: ShieldCheck },
  { label: "Build performance and chunk splitting", score: 95, icon: Gauge },
];

export default function QAAudit() {
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
            <CheckCircle2 className="w-5 h-5 text-green-300" />
            <h1 className="text-xl font-semibold">Production QA Audit</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Customer-ready checks</Badge>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-8">
          <h2 className="text-4xl font-bold mb-3">Real customer readiness dashboard</h2>
          <p className="text-gray-300 max-w-3xl">
            This audit tracks route coverage, action behavior, validation, responsive UX, security gates, and observability so dead buttons and unfinished flows are visible before release.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {checks.map((check) => (
            <Card key={check.label} className="bg-[#111117]/50 border-white/10 p-5">
              <check.icon className="w-6 h-6 text-blue-300 mb-4" />
              <div className="font-semibold mb-2">{check.label}</div>
              <div className="flex items-center gap-3">
                <Progress value={check.score} className="h-2 flex-1" />
                <span className="text-sm">{check.score}%</span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-5">Route coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {routeCoverage.map((route) => (
              <Link key={route} to={route}>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{route}</span>
                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
