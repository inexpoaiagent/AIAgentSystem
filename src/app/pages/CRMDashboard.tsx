import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  Brain,
  ChevronLeft,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CRMDashboard() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stages = [
    { name: "New Leads", count: 24, color: "blue", value: "$120K" },
    { name: "Qualified", count: 18, color: "purple", value: "$280K" },
    { name: "Proposal", count: 12, color: "cyan", value: "$450K" },
    { name: "Negotiation", count: 8, color: "orange", value: "$320K" },
    { name: "Closed Won", count: 15, color: "green", value: "$680K" },
  ];

  const leads = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      value: "$45,000",
      score: 92,
      stage: "Qualified",
      lastContact: "2 hours ago",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      aiInsight: "High engagement, ready for demo call",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "DataFlow Systems",
      value: "$78,000",
      score: 88,
      stage: "Proposal",
      lastContact: "1 day ago",
      email: "michael@dataflow.com",
      phone: "+1 (555) 234-5678",
      aiInsight: "Reviewing pricing, follow up in 2 days",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "CloudScale",
      value: "$52,000",
      score: 85,
      stage: "Qualified",
      lastContact: "3 hours ago",
      email: "emily@cloudscale.io",
      phone: "+1 (555) 345-6789",
      aiInsight: "Budget approved, schedule technical review",
    },
  ];

  const salesData = [
    { month: "Jan", deals: 12, revenue: 240 },
    { month: "Feb", deals: 15, revenue: 310 },
    { month: "Mar", deals: 18, revenue: 380 },
    { month: "Apr", deals: 22, revenue: 450 },
    { month: "May", deals: 28, revenue: 580 },
  ];

  const stats = [
    { label: "Total Pipeline", value: "$1.85M", icon: DollarSign, trend: "+12%", color: "text-green-400" },
    { label: "Active Deals", value: "77", icon: Target, trend: "+8", color: "text-blue-400" },
    { label: "Conversion Rate", value: "32%", icon: TrendingUp, trend: "+5%", color: "text-purple-400" },
    { label: "Avg Deal Size", value: "$24K", icon: Users, trend: "+$2K", color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Workspace
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold">AI-Powered CRM</h1>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </nav>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className={`text-sm ${stat.color}`}>{stat.trend} from last month</div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${stat.color.split('-')[1]}-500/20 to-${stat.color.split('-')[1]}-600/20 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sales Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="font-semibold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: "#111117", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="font-semibold mb-4">Deals Closed</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: "#111117", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="deals" fill="url(#colorGradient)" />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Pipeline Kanban */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Sales Pipeline</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm">{stage.name}</h3>
                    <Badge className={`bg-${stage.color}-500/20 text-${stage.color}-400 border-${stage.color}-500/30`}>
                      {stage.count}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold mb-3">{stage.value}</div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white/5 rounded p-2 border border-white/10 hover:border-white/20 cursor-pointer transition-all">
                        <div className="text-sm font-medium mb-1 truncate">Deal #{item}</div>
                        <div className="text-xs text-gray-400">${(Math.random() * 50 + 20).toFixed(0)}K</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Lead Details */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-6">High-Priority Leads</h2>
          <div className="space-y-4">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 p-5 hover:border-white/20 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold mb-1">{lead.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <Building className="w-4 h-4" />
                          {lead.company}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold mb-1">{lead.value}</div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {lead.stage}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Lead Score</div>
                      <div className="flex items-center gap-2">
                        <Progress value={lead.score} className="flex-1 h-2" />
                        <span className="text-sm font-semibold">{lead.score}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Last Contact</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {lead.lastContact}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-blue-400 font-semibold mb-1">AI Insight</div>
                        <div className="text-sm text-gray-300">{lead.aiInsight}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                      <Mail className="w-3 h-3 mr-1" />
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
