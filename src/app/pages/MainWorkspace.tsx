import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Brain,
  Send,
  Mic,
  Paperclip,
  Settings,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Globe,
  Zap,
  Bell,
  Search,
  Plus,
  ChevronDown,
  Sparkles,
  MoreVertical,
  ShoppingBag,
  Shield,
  LifeBuoy,
  Cpu,
  Workflow,
} from "lucide-react";

export default function MainWorkspace() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      agent: "SEO Agent",
      content: "I've completed the keyword analysis for your new blog post. Found 15 high-opportunity keywords with low competition.",
      time: "2 min ago",
      status: "completed",
    },
    {
      id: 2,
      type: "user",
      content: "Can you generate a content calendar for next month?",
      time: "5 min ago",
    },
    {
      id: 3,
      type: "ai",
      agent: "Social Media Agent",
      content: "Working on your content calendar now. Analyzing trending topics and optimal posting times...",
      time: "Just now",
      status: "thinking",
    },
  ]);

  const activeAgents = [
    { name: "SEO Agent", status: "active", icon: TrendingUp, color: "blue" },
    { name: "Sales Agent", status: "active", icon: Users, color: "purple" },
    { name: "CRM Agent", status: "idle", icon: BarChart3, color: "green" },
    { name: "Social Agent", status: "active", icon: MessageSquare, color: "orange" },
  ];

  const recentTasks = [
    { title: "Blog post optimization", agent: "SEO Agent", status: "completed", progress: 100 },
    { title: "Lead qualification", agent: "Sales Agent", status: "in-progress", progress: 65 },
    { title: "Social media posts", agent: "Social Agent", status: "in-progress", progress: 40 },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: "user",
        content: message,
        time: "Just now",
      },
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-semibold">AI OS</span>
            </Link>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search or ask anything..."
                className="pl-10 w-96 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </Button>
            <Avatar className="w-8 h-8 border border-white/20">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <div className="w-72 border-r border-white/10 bg-[#0a0a0f] flex flex-col">
          <div className="p-4 border-b border-white/10">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/agents">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Users className="w-4 h-4 mr-2" />
                    AI Agents
                  </Button>
                </Link>
                <Link to="/agent-os">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Workflow className="w-4 h-4 mr-2" />
                    Agent OS
                  </Button>
                </Link>
                <Link to="/ceo">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    AI CEO
                  </Button>
                </Link>
                <Link to="/business-doctor">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Brain className="w-4 h-4 mr-2" />
                    Business Doctor
                  </Button>
                </Link>
                <Link to="/meeting">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Meeting Room
                  </Button>
                </Link>
                <Link to="/voice">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Interface
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Workspaces</h3>
              <div className="space-y-2">
                <Link to="/crm">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    CRM Dashboard
                  </Button>
                </Link>
                <Link to="/seo">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    SEO Workspace
                  </Button>
                </Link>
                <Link to="/social">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Social Media
                  </Button>
                </Link>
                <Link to="/automation">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Zap className="w-4 h-4 mr-2" />
                    Automation
                  </Button>
                </Link>
                <Link to="/brain">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Brain className="w-4 h-4 mr-2" />
                    Company Brain
                  </Button>
                </Link>
                <Link to="/website-designer">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Globe className="w-4 h-4 mr-2" />
                    Website Designer
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Marketplace
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Globe className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Link to="/llm-management">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Cpu className="w-4 h-4 mr-2" />
                    LLM Management
                  </Button>
                </Link>
                <Link to="/tickets">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <LifeBuoy className="w-4 h-4 mr-2" />
                    Tickets
                  </Button>
                </Link>
                <Link to="/notifications">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </Link>
                <Link to="/help">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Help Center
                  </Button>
                </Link>
                <Link to="/qa-audit">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Search className="w-4 h-4 mr-2" />
                    QA Audit
                  </Button>
                </Link>
                <Link to="/architecture">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Architecture
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Active Agents</h3>
              <div className="space-y-2">
                {activeAgents.map((agent) => (
                  <Card key={agent.name} className="bg-white/5 border-white/10 p-3 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-${agent.color}-500/20 flex items-center justify-center`}>
                        <agent.icon className={`w-4 h-4 text-${agent.color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{agent.name}</div>
                        <div className="flex items-center gap-1 text-xs">
                          <div className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                          <span className="text-gray-400 capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <Link to="/subscription">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Agent Selector */}
          <div className="p-4 border-b border-white/10 bg-[#111117]/50 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                All Agents
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  4 Agents Active
                </Badge>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className={msg.type === "ai" ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" : "bg-white/10 text-white"}>
                    {msg.type === "ai" ? <Brain className="w-5 h-5" /> : "You"}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${msg.type === "user" ? "flex flex-col items-end" : ""}`}>
                  {msg.type === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{msg.agent}</span>
                      {msg.status === "thinking" && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse mr-1" />
                          Thinking
                        </Badge>
                      )}
                      {msg.status === "completed" && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Completed
                        </Badge>
                      )}
                    </div>
                  )}
                  <Card className={`p-4 max-w-2xl ${msg.type === "ai" ? "bg-white/5 border-white/10" : "bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30"}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </Card>
                  <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-[#111117]/50 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask your AI agents anything..."
                    className="pr-24 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 min-h-12"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12 px-6">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                AI agents can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Tasks & Memory */}
        <div className="w-80 border-l border-white/10 bg-[#0a0a0f] overflow-y-auto">
          <Tabs defaultValue="tasks" className="h-full">
            <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none p-0">
              <TabsTrigger value="tasks" className="flex-1 rounded-none data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="memory" className="flex-1 rounded-none data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Memory
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Recent Tasks</h3>
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <Card key={task.title} className="bg-white/5 border-white/10 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="text-xs text-gray-400">{task.agent}</div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/10">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">{task.progress}%</span>
                          <Badge className={`${task.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>
                            {task.status}
                          </Badge>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="memory" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Conversation Context</h3>
                <div className="space-y-3">
                  <Card className="bg-white/5 border-white/10 p-3">
                    <div className="text-xs text-gray-400 mb-1">Company Info</div>
                    <div className="text-sm">TechCorp Inc.</div>
                  </Card>
                  <Card className="bg-white/5 border-white/10 p-3">
                    <div className="text-xs text-gray-400 mb-1">Industry</div>
                    <div className="text-sm">SaaS</div>
                  </Card>
                  <Card className="bg-white/5 border-white/10 p-3">
                    <div className="text-xs text-gray-400 mb-1">Active Campaign</div>
                    <div className="text-sm">Q2 Product Launch</div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
