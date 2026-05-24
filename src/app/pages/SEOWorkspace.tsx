import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Brain, ChevronLeft, TrendingUp, TrendingDown, Search, FileText, Link as LinkIcon, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SEOWorkspace() {
  const seoData = [
    { month: "Jan", traffic: 12000, keywords: 45 },
    { month: "Feb", traffic: 15000, keywords: 52 },
    { month: "Mar", traffic: 18500, keywords: 61 },
    { month: "Apr", traffic: 22000, keywords: 68 },
    { month: "May", traffic: 28000, keywords: 75 },
  ];

  const keywords = [
    { keyword: "AI business automation", position: 3, volume: 8900, difficulty: 45, trend: "up" },
    { keyword: "autonomous AI agents", position: 5, volume: 12400, difficulty: 52, trend: "up" },
    { keyword: "AI operating system", position: 8, volume: 6700, difficulty: 38, trend: "up" },
    { keyword: "business AI platform", position: 12, volume: 5200, difficulty: 41, trend: "down" },
  ];

  const pages = [
    { title: "AI Automation Guide", score: 92, traffic: 5400, backlinks: 23, status: "Optimized" },
    { title: "Enterprise AI Solutions", score: 88, traffic: 4200, backlinks: 18, status: "In Progress" },
    { title: "AI Agent Capabilities", score: 76, traffic: 3100, backlinks: 12, status: "Needs Work" },
  ];

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
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold">SEO Workspace</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            SEO Score: 85
          </Badge>
        </div>
      </nav>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Organic Traffic", value: "28K", trend: "+27%", icon: TrendingUp, color: "green" },
            { label: "Keyword Rankings", value: "75", trend: "+10", icon: Search, color: "blue" },
            { label: "Backlinks", value: "423", trend: "+18", icon: LinkIcon, color: "purple" },
            { label: "Domain Authority", value: "62", trend: "+4", icon: Target, color: "orange" },
          ].map((stat, i) => (
            <Card key={i} className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-green-400">{stat.trend}</div>
                </div>
                <stat.icon className="w-8 h-8 text-blue-400" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="font-semibold mb-4">Traffic Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={seoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: "#111117", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Line type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="font-semibold mb-4">Keyword Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={seoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: "#111117", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="keywords" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Top Keywords</h2>
          <div className="space-y-3">
            {keywords.map((kw, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{kw.keyword}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Volume: {kw.volume.toLocaleString()}</span>
                      <span>Difficulty: {kw.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${kw.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {kw.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      Position {kw.position}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Page Optimization</h2>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
              <FileText className="w-4 h-4 mr-2" />
              Generate Content
            </Button>
          </div>
          <div className="space-y-4">
            {pages.map((page, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-2">{page.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Traffic: {page.traffic.toLocaleString()}</span>
                      <span>Backlinks: {page.backlinks}</span>
                    </div>
                  </div>
                  <Badge className={`${
                    page.status === 'Optimized' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    page.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  }`}>
                    {page.status}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">SEO Score</span>
                    <span className="font-semibold">{page.score}%</span>
                  </div>
                  <Progress value={page.score} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
