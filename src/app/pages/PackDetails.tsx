import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import {
  ChevronLeft, Check, X, ArrowRight, Zap, BarChart3,
  Users, TrendingUp, Shield, Crown, Briefcase, Wrench, Loader2,
} from "lucide-react";
import { usePackBySlug } from "../hooks/usePacks";
import { authApi, api } from "../lib/api";
import { getAuth } from "../lib/auth-store";
import { useState } from "react";
import { toast } from "sonner";

const TIER_ICONS: Record<string, React.ElementType> = {
  CEO: Crown,
  MANAGER: Briefcase,
  SPECIALIST: Zap,
  WORKER: Wrench,
  QA: Shield,
};

const TIER_COLORS: Record<string, string> = {
  CEO: "text-amber-400",
  MANAGER: "text-blue-400",
  SPECIALIST: "text-purple-400",
  WORKER: "text-green-400",
  QA: "text-orange-400",
};

export default function PackDetails() {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { pack, loading, error } = usePackBySlug(packId);
  const auth = getAuth();
  const [activating, setActivating] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!pack || error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Pack not found</p>
          <Link to="/industry"><Button variant="outline">Back to Marketplace</Button></Link>
        </div>
      </div>
    );
  }

  const activatePack = async () => {
    if (!auth) {
      toast.info("Please sign in to activate this pack");
      navigate("/signin");
      return;
    }
    setActivating(true);
    try {
      await api.activatePack(pack.id);
      toast.success(`${pack.name} Pack activated!`, {
        description: `${pack.agents.length} AI agents are now active for your business.`,
      });
      navigate("/agents");
    } catch (e) {
      toast.error("Activation failed", { description: (e as Error).message });
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/industry">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" /> All Packs
            </Button>
          </Link>
          <span className="font-semibold">{pack.emoji} {pack.name} AI Pack</span>
          <Button
            onClick={activatePack}
            disabled={activating}
            className="border-0 text-white text-sm"
            style={{ background: pack.color }}
          >
            {activating ? "Activating..." : "Activate Pack"} <Zap className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-start gap-6 mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
              style={{ background: `${pack.color}22`, border: `1px solid ${pack.color}44` }}
            >
              {pack.emoji}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{pack.name} AI Pack</h1>
                <Badge
                  className={pack.tier === "gold"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"}
                >
                  {pack.tier === "gold" ? "✦ Gold" : "Professional"}
                </Badge>
              </div>
              <p className="text-xl text-gray-300 mb-3">{pack.tagline}</p>
              <p className="text-gray-400 max-w-2xl">{pack.valueProposition}</p>
            </div>
          </div>

          {/* Outcomes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pack.outcomes.map((o) => (
              <div
                key={o.metric}
                className="rounded-xl p-5 border"
                style={{ background: `${pack.color}11`, borderColor: `${pack.color}33` }}
              >
                <div className="text-xl font-bold mb-1" style={{ color: pack.color }}>{o.metric}</div>
                <div className="text-xs text-gray-400">{o.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Agents + Pain Points */}
          <div className="lg:col-span-2 space-y-8">

            {/* Pain Points */}
            <Card className="bg-[#111117]/50 border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                Problems This Pack Solves
              </h2>
              <div className="space-y-3">
                {pack.painPoints.map((p) => (
                  <div key={p} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-300">{p}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Agents */}
            <Card className="bg-[#111117]/50 border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Your AI Team — {pack.agents.length} Agents
              </h2>
              <div className="space-y-3">
                {pack.agents.map((agent) => {
                  const Icon = TIER_ICONS[agent.role] ?? Zap;
                  const colorClass = TIER_COLORS[agent.role] ?? "text-gray-400";
                  return (
                    <motion.div
                      key={agent.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 transition-all"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ background: `${pack.color}22` }}
                      >
                        {agent.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm">{agent.name}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${colorClass} bg-transparent border-current/30`}>
                            {agent.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{agent.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400">Active</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* KPIs */}
            <Card className="bg-[#111117]/50 border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                KPIs You'll Track
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pack.kpis.map((kpi) => (
                  <div
                    key={kpi}
                    className="p-3 rounded-lg border text-center"
                    style={{ background: `${pack.color}11`, borderColor: `${pack.color}33` }}
                  >
                    <div className="text-xs text-gray-300">{kpi}</div>
                    <div className="text-lg font-bold mt-1 text-gray-500">—</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Pricing + Target + CTA */}
          <div className="space-y-6">

            {/* Pricing Card */}
            <Card className="bg-[#111117]/50 border-white/10 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-1">${pack.price}</div>
                <div className="text-gray-400 text-sm">/month · billed monthly</div>
              </div>

              <Button
                onClick={activatePack}
                disabled={activating}
                className="w-full h-12 text-base font-semibold border-0 text-white mb-4"
                style={{ background: pack.color }}
              >
                {activating ? "Activating..." : "Activate This Pack"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-xs text-center text-gray-500 mb-5">
                14-day free trial · No credit card required
              </div>

              <div className="space-y-3">
                {[
                  `${pack.agents.length} pre-built AI agents`,
                  "Industry-specific workflows",
                  "AI Business Doctor diagnosis",
                  "AI Meeting Room",
                  "KPI dashboard",
                  "Priority support",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </Card>

            {/* Who is this for */}
            <Card className="bg-[#111117]/50 border-white/10 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Perfect For
              </h3>
              <div className="space-y-2">
                {pack.targetCustomers.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pack.color }} />
                    {c}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
