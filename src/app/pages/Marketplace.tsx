import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Brain,
  ChevronLeft,
  ShoppingBag,
  Star,
  Download,
  ShieldCheck,
  Search,
  Sparkles,
  Bot,
  Workflow,
  Plug,
} from "lucide-react";

const marketplaceItems = [
  {
    name: "Luxury Real Estate Sales Agent",
    type: "Premium Agent",
    category: "Real Estate",
    rating: 4.9,
    installs: "2.8k",
    price: "$149/mo",
    icon: Bot,
    description: "Qualifies VIP buyers, matches properties, schedules visits, and writes follow-up scripts.",
  },
  {
    name: "WordPress Autopublisher Pack",
    type: "Workflow Pack",
    category: "SEO",
    rating: 4.8,
    installs: "5.1k",
    price: "$79/mo",
    icon: Workflow,
    description: "Generates, optimizes, uploads, schedules, and audits WordPress blog posts with Playwright.",
  },
  {
    name: "WhatsApp Lead Response Plugin",
    type: "Integration",
    category: "Sales",
    rating: 4.7,
    installs: "3.4k",
    price: "$99/mo",
    icon: Plug,
    description: "Responds to inbound leads, handles multilingual qualification, and syncs CRM outcomes.",
  },
];

const bundles = [
  "Real Estate Pro Suite",
  "Marketing Agency Growth Suite",
  "Construction Operations Suite",
  "Ecommerce Optimization Suite",
];

export default function Marketplace() {
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
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">AI Agent Marketplace</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Tenant-safe installs
          </Badge>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-8">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Install AI employees
            </Badge>
            <h2 className="text-4xl font-bold mb-3">Expand your company AI team in minutes.</h2>
            <p className="text-gray-300 max-w-3xl">
              Deploy specialized agents, workflow packs, and secure integrations into an isolated tenant workspace with usage tracking, reviews, and approval controls.
            </p>
            <div className="relative mt-6 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full h-12 rounded-lg bg-black/30 border border-white/10 pl-11 pr-4 text-sm outline-none focus:border-blue-500/50"
                placeholder="Search agents, workflows, tools, templates..."
              />
            </div>
          </Card>

          <Card className="bg-[#111117]/70 backdrop-blur-xl border-white/10 p-6">
            <h3 className="font-semibold mb-4">Installed capacity</h3>
            <div className="space-y-5">
              {[
                { label: "Agents", used: 12, limit: 15 },
                { label: "Workflow packs", used: 8, limit: 20 },
                { label: "Premium tools", used: 5, limit: 10 },
              ].map(({ label, used, limit }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{label}</span>
                    <span>{used}/{limit}</span>
                  </div>
                  <Progress value={(used / limit) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-5">
            <h3 className="font-semibold mb-4">Industry bundles</h3>
            <div className="space-y-2">
              {bundles.map((bundle, index) => (
                <button
                  key={bundle}
                  className={`w-full text-left rounded-lg border p-3 text-sm transition-all ${index === 0 ? "border-blue-500/50 bg-blue-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                >
                  {bundle}
                </button>
              ))}
            </div>
          </Card>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketplaceItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 hover:border-blue-500/40 transition-all">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/25 to-purple-600/25 border border-blue-500/30 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-blue-300" />
                    </div>
                    <Badge className="bg-white/5 text-gray-300 border-white/10">{item.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">{item.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-5">
                    <span className="flex items-center gap-1 text-yellow-300">
                      <Star className="w-4 h-4 fill-yellow-300" />
                      {item.rating}
                    </span>
                    <span>{item.installs} installs</span>
                    <span>{item.price}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                    <Download className="w-4 h-4 mr-2" />
                    Install
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-purple-300 shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Marketplace install policy</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every agent install is scoped to the active company tenant, receives least-privilege tool permissions, stores secrets in the encrypted vault, and emits audit events for admin review.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
