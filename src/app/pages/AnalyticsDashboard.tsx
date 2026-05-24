import { motion } from "motion/react";
import { Link } from "react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ChevronLeft, BarChart3, TrendingUp, Brain, Mic, Workflow, DollarSign } from "lucide-react";

const data = [
  { day: "Mon", tasks: 12800, revenue: 42000, voice: 3800 },
  { day: "Tue", tasks: 18200, revenue: 48000, voice: 5200 },
  { day: "Wed", tasks: 21500, revenue: 53000, voice: 6100 },
  { day: "Thu", tasks: 19800, revenue: 51000, voice: 5700 },
  { day: "Fri", tasks: 24600, revenue: 62000, voice: 7600 },
  { day: "Sat", tasks: 22400, revenue: 59000, voice: 6900 },
  { day: "Sun", tasks: 27100, revenue: 71000, voice: 8200 },
];

const metrics = [
  { label: "AI task success", value: "98.4%", icon: Brain, color: "text-blue-400" },
  { label: "Workflow executions", value: "418k", icon: Workflow, color: "text-purple-400" },
  { label: "Voice minutes", value: "43.1k", icon: Mic, color: "text-cyan-400" },
  { label: "Usage revenue", value: "$71k", icon: DollarSign, color: "text-green-400" },
];

export default function AnalyticsDashboard() {
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
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">AI Operations Analytics</h1>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Last 7 days</Badge>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div key={metric.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className={`w-7 h-7 ${metric.color}`} />
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-6">Platform growth curve</h2>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="tasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="voice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" />
                <YAxis stroke="rgba(255,255,255,0.45)" />
                <Tooltip contentStyle={{ background: "#111117", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fill="url(#tasks)" strokeWidth={2} />
                <Area type="monotone" dataKey="voice" stroke="#a855f7" fill="url(#voice)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            ["Top performing agent", "Sales Agent", "Closed-loop follow-up raised lead response by 31%."],
            ["Highest cost driver", "Voice Realtime", "Usage-based billing captured 94% of marginal cost."],
            ["Optimization insight", "CRM hygiene", "Duplicate cleanup improved pipeline confidence from 81% to 93%."],
          ].map(([label, value, detail]) => (
            <Card key={label} className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
              <div className="text-sm text-gray-400 mb-2">{label}</div>
              <div className="text-2xl font-bold mb-3">{value}</div>
              <p className="text-sm text-gray-400 leading-relaxed">{detail}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
