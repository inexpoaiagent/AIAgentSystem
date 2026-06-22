import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Check, ChevronLeft, Zap, Loader2 } from "lucide-react";
import { usePacks, type Pack as IndustryPack } from "../hooks/usePacks";

export default function IndustryMarketplace() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { packs: INDUSTRY_PACKS, loading } = usePacks();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Industry AI Packs</span>
          </div>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-sm">
              Get Started Free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-6 text-xs px-4 py-1">
            8 Industries · 50+ AI Agents · 1 Platform
          </Badge>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            AI Workforce Built for{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Industry
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Stop using generic AI tools. Get a complete team of AI agents pre-trained on your industry —
            ready to generate leads, close sales, and run operations from day one.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            {["No setup required", "Industry-specific from day 1", "14-day free trial"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pack Grid */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {INDUSTRY_PACKS.map((pack, i) => (
              <PackCard
                key={pack.id}
                pack={pack}
                index={i}
                hovered={hoveredId === pack.id}
                onHover={(id) => setHoveredId(id)}
                onSelect={() => navigate(`/industry/${pack.slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Don't see your industry?</h2>
        <p className="text-gray-400 mb-8">We build custom AI packs for any business type. Talk to us.</p>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 h-12 px-8 text-base">
          Request a Custom Pack <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </section>
    </div>
  );
}

function PackCard({
  pack, index, hovered, onHover, onSelect,
}: {
  pack: IndustryPack;
  index: number;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onMouseEnter={() => onHover(pack.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onSelect}
      className="group cursor-pointer"
    >
      <div
        className={`relative rounded-2xl border transition-all duration-300 overflow-hidden h-full flex flex-col ${
          hovered
            ? "border-white/20 bg-white/5 shadow-2xl -translate-y-1"
            : "border-white/10 bg-[#111117]/60"
        }`}
      >
        {/* Color bar */}
        <div className="h-1 w-full" style={{ background: pack.color }} />

        <div className="p-6 flex flex-col flex-1">
          {/* Icon + tier */}
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{pack.emoji}</div>
            <Badge
              className={`text-xs ${
                pack.tier === "gold"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
              }`}
            >
              {pack.tier === "gold" ? "Gold" : "Professional"}
            </Badge>
          </div>

          {/* Name + tagline */}
          <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">{pack.tagline}</p>

          {/* Pain points preview */}
          <div className="space-y-1.5 mb-5 flex-1">
            {pack.painPoints.slice(0, 3).map((p) => (
              <div key={p} className="flex items-start gap-2 text-xs text-gray-400">
                <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                <span>{p}</span>
              </div>
            ))}
          </div>

          {/* Agent count */}
          <div className="flex items-center gap-3 mb-5 py-3 border-t border-white/10">
            <div className="flex -space-x-2">
              {pack.agents.slice(0, 4).map((a) => (
                <div
                  key={a.slug}
                  className="w-7 h-7 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-xs"
                  style={{ background: `${pack.color}33` }}
                  title={a.name}
                >
                  {a.icon}
                </div>
              ))}
              {pack.agents.length > 4 && (
                <div className="w-7 h-7 rounded-full border-2 border-[#0a0a0f] bg-white/10 flex items-center justify-center text-[10px] font-medium">
                  +{pack.agents.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-400">{pack.agents.length} AI Agents</span>
          </div>

          {/* Outcomes preview */}
          <div className="space-y-1 mb-5">
            {pack.outcomes.slice(0, 2).map((o) => (
              <div key={o.metric} className="flex items-center gap-2 text-xs">
                <Check className="w-3 h-3 text-green-400 shrink-0" />
                <span className="font-medium" style={{ color: pack.color }}>{o.metric}</span>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
            <div>
              <span className="text-2xl font-bold">${pack.price}</span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
            <Button
              size="sm"
              className="text-xs border-0 text-white"
              style={{ background: pack.color }}
            >
              View Pack <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
