import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  Brain,
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Bot,
  ChevronLeft,
  Activity,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

export default function AgentDashboard() {
  const agents = [
    {
      id: 1,
      name: "SEO Agent",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      status: "active",
      activity: "Optimizing blog post: 'AI in Marketing'",
      performance: 94,
      activeTasks: 3,
      completedToday: 12,
      recentActions: [
        "Analyzed keyword density for 5 pages",
        "Updated meta descriptions",
        "Generated sitemap",
      ],
    },
    {
      id: 2,
      name: "Sales Agent",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      status: "active",
      activity: "Qualifying 8 new leads from website form",
      performance: 89,
      activeTasks: 5,
      completedToday: 8,
      recentActions: [
        "Sent personalized emails to 15 leads",
        "Updated CRM with new contacts",
        "Scheduled 3 demo calls",
      ],
    },
    {
      id: 3,
      name: "CRM Agent",
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
      status: "idle",
      activity: "Monitoring pipeline for updates",
      performance: 96,
      activeTasks: 1,
      completedToday: 15,
      recentActions: [
        "Updated 24 contact records",
        "Generated weekly sales report",
        "Cleaned duplicate entries",
      ],
    },
    {
      id: 4,
      name: "Social Media Agent",
      icon: MessageSquare,
      color: "from-orange-500 to-red-500",
      status: "active",
      activity: "Scheduling posts for next week",
      performance: 91,
      activeTasks: 4,
      completedToday: 10,
      recentActions: [
        "Created 7 social media posts",
        "Scheduled LinkedIn content",
        "Analyzed engagement metrics",
      ],
    },
    {
      id: 5,
      name: "Website Builder Agent",
      icon: Globe,
      color: "from-indigo-500 to-blue-500",
      status: "idle",
      activity: "Awaiting design approval",
      performance: 87,
      activeTasks: 2,
      completedToday: 5,
      recentActions: [
        "Updated product page layout",
        "Optimized page load speed",
        "Added new testimonial section",
      ],
    },
    {
      id: 6,
      name: "Finance Agent",
      icon: Shield,
      color: "from-teal-500 to-cyan-500",
      status: "active",
      activity: "Processing monthly invoices",
      performance: 98,
      activeTasks: 6,
      completedToday: 20,
      recentActions: [
        "Sent 12 payment reminders",
        "Reconciled Q1 expenses",
        "Updated financial dashboard",
      ],
    },
    {
      id: 7,
      name: "Procurement Agent",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      status: "idle",
      activity: "Monitoring supplier inventory",
      performance: 92,
      activeTasks: 1,
      completedToday: 7,
      recentActions: [
        "Requested quotes from 3 vendors",
        "Updated supplier database",
        "Negotiated bulk pricing",
      ],
    },
    {
      id: 8,
      name: "Project Tracking Agent",
      icon: Bot,
      color: "from-pink-500 to-purple-500",
      status: "active",
      activity: "Updating task dependencies",
      performance: 93,
      activeTasks: 8,
      completedToday: 18,
      recentActions: [
        "Created 5 new project tasks",
        "Sent deadline reminders",
        "Generated progress reports",
      ],
    },
  ];

  const stats = [
    { label: "Total Tasks Completed", value: "95", icon: CheckCircle2, color: "text-green-400" },
    { label: "Active Tasks", value: "30", icon: Activity, color: "text-blue-400" },
    { label: "Avg. Performance", value: "92%", icon: Target, color: "text-purple-400" },
    { label: "Time Saved Today", value: "6.5h", icon: Clock, color: "text-orange-400" },
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
            <h1 className="text-xl font-semibold">AI Agent Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {agents.filter(a => a.status === "active").length} Agents Active
            </Badge>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
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
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 hover:border-white/20 transition-all cursor-pointer group">
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className={`bg-gradient-to-br ${agent.color}`}>
                        <agent.icon className="w-8 h-8 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                        <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {agent.performance}%
                  </Badge>
                </div>

                {/* Current Activity */}
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Current Activity</div>
                  <div className="text-sm flex items-start gap-2">
                    <Activity className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>{agent.activity}</span>
                  </div>
                </div>

                {/* Performance */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Performance Score</span>
                    <span className="font-semibold">{agent.performance}%</span>
                  </div>
                  <Progress value={agent.performance} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-blue-400">{agent.activeTasks}</div>
                    <div className="text-xs text-gray-400">Active Tasks</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-green-400">{agent.completedToday}</div>
                    <div className="text-xs text-gray-400">Completed Today</div>
                  </div>
                </div>

                {/* Recent Actions */}
                <div>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Recent Actions</div>
                  <div className="space-y-2">
                    {agent.recentActions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Configure
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
