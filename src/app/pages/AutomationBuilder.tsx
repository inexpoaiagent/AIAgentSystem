import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, ChevronLeft, Zap, Plus, Play, Settings, GitBranch } from "lucide-react";

export default function AutomationBuilder() {
  const [nodes] = useState([
    { id: 1, type: "trigger", label: "New Lead Form", x: 50, y: 100, color: "blue" },
    { id: 2, type: "action", label: "Qualify Lead (AI)", x: 250, y: 100, color: "purple" },
    { id: 3, type: "condition", label: "Score > 70?", x: 450, y: 100, color: "orange" },
    { id: 4, type: "action", label: "Send to CRM", x: 650, y: 50, color: "green" },
    { id: 5, type: "action", label: "Nurture Email", x: 650, y: 150, color: "cyan" },
  ]);

  const workflows = [
    { name: "Lead Qualification Flow", status: "active", runs: 342, success: 98 },
    { name: "Content Publishing Pipeline", status: "active", runs: 156, success: 100 },
    { name: "Customer Onboarding", status: "draft", runs: 0, success: 0 },
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
          <h1 className="text-xl font-semibold">Automation Builder</h1>
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(100vh-73px)]">
        {/* Sidebar - Workflow List */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-4">
            <h3 className="font-semibold mb-4">My Workflows</h3>
            <div className="space-y-2">
              {workflows.map((wf, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 cursor-pointer transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{wf.name}</span>
                    <Badge className={wf.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                      {wf.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Runs: {wf.runs}</span>
                    {wf.runs > 0 && <span>Success: {wf.success}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-4">
            <h3 className="font-semibold mb-4">Node Library</h3>
            <div className="space-y-2">
              {[
                { label: "Trigger", icon: Zap, color: "blue" },
                { label: "AI Action", icon: Brain, color: "purple" },
                { label: "Condition", icon: GitBranch, color: "orange" },
                { label: "Integration", icon: Settings, color: "green" },
              ].map((node, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 cursor-grab active:cursor-grabbing transition-all">
                  <div className="flex items-center gap-2">
                    <node.icon className={`w-4 h-4 text-${node.color}-400`} />
                    <span className="text-sm">{node.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 flex-1 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0">
                <Play className="w-4 h-4 mr-2" />
                Test Run
              </Button>
            </div>

            {/* Canvas Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Workflow Nodes */}
            <div className="relative h-full">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Connection Lines */}
                <line x1="120" y1="115" x2="250" y2="115" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
                <line x1="380" y1="115" x2="450" y2="115" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
                <line x1="520" y1="115" x2="650" y2="65" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="2" />
                <line x1="520" y1="115" x2="650" y2="165" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="2" />
              </svg>

              {nodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute cursor-move"
                  style={{ left: node.x, top: node.y }}
                >
                  <Card className={`w-32 bg-white/5 border border-${node.color}-500/50 p-3 hover:border-${node.color}-500 transition-all shadow-lg`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${node.color}-500/20 to-${node.color}-600/20 flex items-center justify-center mb-2`}>
                      {node.type === 'trigger' && <Zap className={`w-4 h-4 text-${node.color}-400`} />}
                      {node.type === 'action' && <Brain className={`w-4 h-4 text-${node.color}-400`} />}
                      {node.type === 'condition' && <GitBranch className={`w-4 h-4 text-${node.color}-400`} />}
                    </div>
                    <div className="text-xs font-medium text-center">{node.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Info Panel */}
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-blue-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Lead Qualification Automation</h3>
                    <p className="text-sm text-gray-300">Automatically qualifies leads using AI and routes them to the right team</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">98%</div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
