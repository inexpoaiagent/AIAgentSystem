import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, ChevronLeft, Network, Database, Sparkles, TrendingUp, FileText, Users, MessageSquare } from "lucide-react";

export default function CompanyBrain() {
  const knowledgeNodes = [
    { id: 1, label: "Company Info", connections: 5, size: 80, x: 200, y: 150, color: "blue" },
    { id: 2, label: "Products", connections: 8, size: 100, x: 400, y: 100, color: "purple" },
    { id: 3, label: "Customers", connections: 12, size: 120, x: 600, y: 150, color: "green" },
    { id: 4, label: "Marketing", connections: 6, size: 90, x: 300, y: 300, color: "orange" },
    { id: 5, label: "Sales Data", connections: 10, size: 110, x: 500, y: 300, color: "cyan" },
  ];

  const memoryCategories = [
    {
      category: "Business Context",
      items: 156,
      icon: FileText,
      color: "blue",
      examples: ["Company mission", "Product descriptions", "Value propositions"],
    },
    {
      category: "Customer Insights",
      items: 342,
      icon: Users,
      color: "purple",
      examples: ["Customer preferences", "Purchase patterns", "Feedback themes"],
    },
    {
      category: "Conversations",
      items: 1247,
      icon: MessageSquare,
      color: "green",
      examples: ["Past discussions", "Decision history", "Agent interactions"],
    },
    {
      category: "Performance Data",
      items: 89,
      icon: TrendingUp,
      color: "orange",
      examples: ["KPI trends", "Campaign results", "Growth metrics"],
    },
  ];

  const insights = [
    { title: "Q2 revenue trending 23% above target", confidence: 95, category: "Performance" },
    { title: "Customer retention improved after onboarding changes", confidence: 88, category: "Customer" },
    { title: "SEO strategy driving 40% of qualified leads", confidence: 92, category: "Marketing" },
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
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold">Company Brain</h1>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Database className="w-3 h-3 mr-1" />
            1,834 memories
          </Badge>
        </div>
      </nav>

      <div className="p-6">
        {/* Knowledge Graph Visualization */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-8 mb-8 relative overflow-hidden" style={{ height: "500px" }}>
          <div className="absolute top-6 left-6 z-10">
            <h2 className="text-2xl font-bold mb-2">Knowledge Graph</h2>
            <p className="text-gray-400">Visual representation of your company's collective intelligence</p>
          </div>

          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />

          {/* Knowledge Nodes */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Connection Lines */}
            <line x1="240" y1="170" x2="400" y2="140" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" />
            <line x1="450" y1="140" x2="600" y2="170" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="2" />
            <line x1="340" y1="320" x2="440" y2="160" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="2" />
            <line x1="540" y1="320" x2="620" y2="200" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
          </svg>

          {knowledgeNodes.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, type: "spring" }}
              className="absolute cursor-pointer"
              style={{ left: node.x, top: node.y }}
              whileHover={{ scale: 1.1 }}
            >
              <div className={`relative`} style={{ width: node.size, height: node.size }}>
                <div className={`w-full h-full rounded-full bg-gradient-to-br from-${node.color}-500/30 to-${node.color}-600/30 border-2 border-${node.color}-500/50 flex items-center justify-center backdrop-blur-xl`}>
                  <div className="text-center">
                    <div className="text-xs font-semibold mb-1">{node.label}</div>
                    <div className="text-xs text-gray-400">{node.connections} links</div>
                  </div>
                </div>
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 border-${node.color}-500/30`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              </div>
            </motion.div>
          ))}

          {/* Central Brain Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center backdrop-blur-xl border-2 border-blue-500/30">
              <Brain className="w-16 h-16 text-blue-400" />
            </div>
          </div>
        </Card>

        {/* Memory Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {memoryCategories.map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 hover:border-white/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${cat.color}-500/20 to-${cat.color}-600/20 flex items-center justify-center`}>
                    <cat.icon className={`w-6 h-6 text-${cat.color}-400`} />
                  </div>
                  <Badge className={`bg-${cat.color}-500/20 text-${cat.color}-400 border-${cat.color}-500/30`}>
                    {cat.items}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-3">{cat.category}</h3>
                <div className="space-y-1">
                  {cat.examples.map((ex, j) => (
                    <div key={j} className="text-xs text-gray-400">- {ex}</div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI-Generated Insights */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">AI-Generated Insights</h2>
          </div>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{insight.title}</h3>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{insight.confidence}%</div>
                      <div className="text-xs text-gray-400">Confidence</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                      Explore
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Share
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Memory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Network className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">1,834</div>
                <div className="text-sm text-gray-400">Total Memories</div>
              </div>
            </div>
            <div className="text-sm text-green-400">+127 this week</div>
          </Card>

          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">342</div>
                <div className="text-sm text-gray-400">Active Connections</div>
              </div>
            </div>
            <div className="text-sm text-green-400">+28 this week</div>
          </Card>

          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-gray-400">Context Accuracy</div>
              </div>
            </div>
            <div className="text-sm text-green-400">+3% this month</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
