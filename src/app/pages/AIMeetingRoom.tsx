import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  Brain,
  ChevronLeft,
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Mic,
  Video,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Target,
  TrendingDown,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AIMeetingRoom() {
  const [isMeetingActive, setIsMeetingActive] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      agent: "SEO Agent",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      message: "I've analyzed our current search rankings. We're on page 2 for our primary keywords. I recommend focusing on long-tail keywords to gain quick wins.",
      votes: { up: 3, down: 0 },
      timestamp: "2 min ago",
    },
    {
      id: 2,
      agent: "Sales Agent",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      message: "From my analysis, 68% of qualified leads are coming from organic search. If we can improve SEO rankings, we could see a 40% increase in lead volume.",
      votes: { up: 4, down: 0 },
      timestamp: "1 min ago",
    },
    {
      id: 3,
      agent: "Social Media Agent",
      icon: MessageSquare,
      color: "from-orange-500 to-red-500",
      message: "I can amplify the content strategy. Once we rank for those keywords, I'll create social posts to drive additional traffic and engagement.",
      votes: { up: 2, down: 0 },
      timestamp: "30 sec ago",
    },
    {
      id: 4,
      agent: "CRM Agent",
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
      message: "Based on our conversion data, leads from organic search have a 32% higher close rate. I support prioritizing SEO.",
      votes: { up: 4, down: 0 },
      timestamp: "Just now",
      typing: true,
    },
  ]);

  const participants = [
    { name: "SEO Agent", icon: TrendingUp, status: "speaking", color: "from-blue-500 to-cyan-500" },
    { name: "Sales Agent", icon: Users, status: "active", color: "from-purple-500 to-pink-500" },
    { name: "CRM Agent", icon: BarChart3, status: "active", color: "from-green-500 to-emerald-500" },
    { name: "Social Agent", icon: MessageSquare, status: "active", color: "from-orange-500 to-red-500" },
  ];

  const kpis = [
    { label: "Projected Lead Increase", value: "+40%", trend: "up", icon: TrendingUp },
    { label: "Expected ROI", value: "285%", trend: "up", icon: Target },
    { label: "Implementation Time", value: "3 weeks", trend: "neutral", icon: Clock },
    { label: "Resource Cost", value: "Low", trend: "down", icon: TrendingDown },
  ];

  const consensusScore = 92;

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
          <div className="flex items-center gap-3">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Meeting in Progress
            </Badge>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100vh-73px)]">
        {/* Left Panel - Participants */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              AI Agents in Meeting
            </h2>
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <motion.div
                  key={participant.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`bg-gradient-to-br ${participant.color}`}>
                      <participant.icon className="w-6 h-6 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{participant.name}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${participant.status === "speaking" ? "bg-green-500 animate-pulse" : "bg-blue-500"}`} />
                      <span className="text-gray-400 capitalize">{participant.status}</span>
                    </div>
                  </div>
                  {participant.status === "speaking" && (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((bar) => (
                        <motion.div
                          key={bar}
                          className="w-1 bg-green-500 rounded-full"
                          animate={{
                            height: ["8px", "16px", "8px"],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: bar * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Meeting Controls */}
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="font-semibold mb-4">Meeting Controls</h2>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                <Mic className="w-4 h-4 mr-2" />
                Join Voice Mode
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Video className="w-4 h-4 mr-2" />
                Share Screen
              </Button>
              <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
                End Meeting
              </Button>
            </div>
          </Card>

          {/* Consensus Score */}
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Consensus Score
            </h2>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {consensusScore}%
              </div>
              <div className="text-sm text-gray-400">High Agreement</div>
            </div>
            <Progress value={consensusScore} className="h-3 mb-2" />
            <div className="text-xs text-gray-400 text-center">
              4 out of 4 agents support this strategy
            </div>
          </Card>
        </div>

        {/* Center Panel - Discussion */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Q2 Growth Strategy Discussion</h1>
                <p className="text-gray-400">AI agents are collaborating on your business strategy</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Collaboration
              </Badge>
            </div>

            {/* KPI Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {kpis.map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className={`w-5 h-5 ${
                        kpi.trend === "up" ? "text-green-400" :
                        kpi.trend === "down" ? "text-red-400" :
                        "text-gray-400"
                      }`} />
                    </div>
                    <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                    <div className="text-xs text-gray-400">{kpi.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Discussion Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/5 border-white/10 p-4 hover:border-white/20 transition-all">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback className={`bg-gradient-to-br ${msg.color}`}>
                            <msg.icon className="w-5 h-5 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{msg.agent}</span>
                            <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            {msg.typing && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                Typing...
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed mb-3">{msg.message}</p>
                          <div className="flex items-center gap-3">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {msg.votes.up}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10">
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              {msg.votes.down}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10">
                              <Lightbulb className="w-3 h-3 mr-1" />
                              Expand
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-gray-400 px-4"
              >
                <div className="flex gap-1">
                  {[1, 2, 3].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: dot * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span>SEO Agent is formulating a response...</span>
              </motion.div>
            </div>

            {/* Action Summary */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Proposed Action Plan</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>- Phase 1: SEO Agent to optimize top 10 pages for long-tail keywords</li>
                    <li>- Phase 2: Social Agent to amplify content through targeted campaigns</li>
                    <li>- Phase 3: Sales Agent to engage increased lead volume</li>
                    <li>- Expected timeline: 3 weeks to see initial results</li>
                  </ul>
                  <div className="mt-4 flex gap-3">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                      Approve & Execute
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Modify Plan
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
}
