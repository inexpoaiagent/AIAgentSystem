import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Brain, Send, Mic, Paperclip, Settings, Users, TrendingUp,
  BarChart3, MessageSquare, Globe, Zap, Bell, Search, Plus,
  ChevronDown, Sparkles, MoreVertical, ShoppingBag, Shield,
  LifeBuoy, Cpu, Workflow, CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";
import { streamChatMessages, api, AgentSummary } from "../lib/api";
import { getUser, getAuth } from "../lib/auth-store";

// ── Types ─────────────────────────────────────────────────────────────────────

type MsgRole = "user" | "system" | "agent" | "ceo" | "planner";

interface ChatMsg {
  id: string;
  role: MsgRole;
  agentSlug?: string;
  agentName?: string;
  content: string;
  status?: "streaming" | "done" | "error";
  timestamp: string;
}

interface AgentMeetingEvent {
  type: string;
  agent?: string;
  agent_name?: string;
  content?: string;
  chunk?: string;
  message?: string;
  agents?: string[];
  action_plan?: string[];
}

const AGENT_COLORS: Record<string, string> = {
  planner: "blue", ceo: "purple", sales: "emerald", seo: "amber",
  content: "pink", social: "orange", finance: "cyan", "qa": "red",
  security: "rose", "website-designer": "indigo", "project-manager": "teal",
  "cost-optimizer": "yellow",
};

const agentColor = (slug: string) => AGENT_COLORS[slug] ?? "gray";

// ── Sidebar links ─────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { to: "/agents", Icon: Users, label: "AI Agents" },
  { to: "/agent-os", Icon: Workflow, label: "Agent OS" },
  { to: "/ceo", Icon: BarChart3, label: "AI CEO" },
  { to: "/business-doctor", Icon: Brain, label: "Business Doctor" },
  { to: "/meeting", Icon: MessageSquare, label: "AI Meeting Room" },
  { to: "/voice", Icon: Mic, label: "Voice Interface" },
];

const WORKSPACE_LINKS = [
  { to: "/crm", Icon: BarChart3, label: "CRM Dashboard" },
  { to: "/seo", Icon: TrendingUp, label: "SEO Workspace" },
  { to: "/social", Icon: MessageSquare, label: "Social Media" },
  { to: "/automation", Icon: Zap, label: "Automation" },
  { to: "/brain", Icon: Brain, label: "Company Brain" },
  { to: "/website-designer", Icon: Globe, label: "Website Designer" },
  { to: "/industry", Icon: ShoppingBag, label: "Industry AI Packs" },
  { to: "/marketplace", Icon: ShoppingBag, label: "Marketplace" },
  { to: "/analytics", Icon: Globe, label: "Analytics" },
  { to: "/admin", Icon: Shield, label: "Admin" },
  { to: "/llm-management", Icon: Cpu, label: "API & LLM Settings" },
  { to: "/accounting", Icon: Settings, label: "Accounting" },
  { to: "/tickets", Icon: LifeBuoy, label: "Tickets" },
  { to: "/notifications", Icon: Bell, label: "Notifications" },
  { to: "/help", Icon: Sparkles, label: "Help Center" },
  { to: "/qa-audit", Icon: Search, label: "QA Audit" },
];

// ── Suggestion prompts ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Why are my sales down this month?",
  "Create a content calendar for next month",
  "Analyze my website SEO and fix critical issues",
  "What's my projected revenue for Q3?",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function MainWorkspace() {
  const user = getUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "system",
      content: "AI Business OS is ready. All agents are standing by. Ask anything about your business.",
      status: "done",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [meetingActive, setMeetingActive] = useState(false);
  const [activeAgentsInMeeting, setActiveAgentsInMeeting] = useState<string[]>([]);
  const [llmConfigured, setLlmConfigured] = useState(false);
  const [sidebarAgents, setSidebarAgents] = useState<AgentSummary[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`ws-${Date.now()}`);
  const historyRef = useRef<Array<{ role: "user" | "assistant"; content: string; createdAt: string }>>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadAgents = () =>
      api.getAgentsSummary().then(setSidebarAgents).catch(() => {});
    loadAgents();
    const i = setInterval(loadAgents, 15_000);
    return () => clearInterval(i);
  }, []);

  const addMsg = useCallback((msg: Partial<ChatMsg> & { id: string }) => {
    setMessages((prev) => {
      const exists = prev.findIndex((m) => m.id === msg.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = { ...updated[exists], ...msg };
        return updated;
      }
      return [...prev, { role: "agent", content: "", status: "streaming", timestamp: new Date().toISOString(), ...msg } as ChatMsg];
    });
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isStreaming) return;
    setInput("");
    setIsStreaming(true);

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMsg = { id: userMsgId, role: "user", content: msg, status: "done", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    historyRef.current.push({ role: "user", content: msg, createdAt: userMsg.timestamp });

    let plannerMsgId = `planner-${Date.now()}`;
    let ceoMsgId = `ceo-${Date.now()}`;
    const agentMsgIds: Record<string, string> = {};

    try {
      for await (const event of streamChatMessages(msg, historyRef.current.slice(-8), sessionId.current)) {
        const e = event as AgentMeetingEvent;

        switch (e.type) {
          case "status":
            addMsg({ id: "status-bar", role: "system", content: e.message ?? "Processing...", status: "streaming" });
            break;

          case "planner":
            addMsg({
              id: plannerMsgId,
              role: "planner",
              agentSlug: "planner",
              agentName: "Planner Agent",
              content: e.content ?? "",
              status: "done",
            });
            if (e.agents?.length) {
              setActiveAgentsInMeeting(e.agents);
              setMeetingActive(true);
            }
            break;

          case "meeting_start":
            addMsg({ id: "meeting-header", role: "system", content: `Agent meeting started — ${(e.agents ?? []).join(", ")}`, status: "done" });
            break;

          case "agent_chunk":
            if (!agentMsgIds[e.agent ?? ""]) {
              agentMsgIds[e.agent ?? ""] = `agent-${e.agent}-${Date.now()}`;
            }
            addMsg({
              id: agentMsgIds[e.agent ?? ""],
              role: "agent",
              agentSlug: e.agent,
              agentName: e.agent_name ?? e.agent,
              content: (messages.find((m) => m.id === agentMsgIds[e.agent ?? ""])?.content ?? "") + (e.chunk ?? ""),
              status: "streaming",
            });
            break;

          case "agent_done":
            if (agentMsgIds[e.agent ?? ""]) {
              setMessages((prev) =>
                prev.map((m) => m.id === agentMsgIds[e.agent ?? ""] ? { ...m, status: "done" } : m)
              );
            }
            break;

          case "synthesis_chunk":
            setMessages((prev) => {
              const exists = prev.find((m) => m.id === ceoMsgId);
              if (exists) return prev.map((m) => m.id === ceoMsgId ? { ...m, content: m.content + (e.chunk ?? "") } : m);
              return [...prev, { id: ceoMsgId, role: "ceo", agentSlug: "ceo", agentName: "CEO Agent", content: e.chunk ?? "", status: "streaming", timestamp: new Date().toISOString() }];
            });
            break;

          case "action_plan":
            setMessages((prev) =>
              prev.map((m) => m.id === ceoMsgId ? { ...m, status: "done" } : m)
            );
            if (e.action_plan?.length) {
              addMsg({
                id: `plan-${Date.now()}`,
                role: "system",
                content: "**Action Plan:**\n" + e.action_plan.map((a, i) => `${i + 1}. ${a}`).join("\n"),
                status: "done",
              });
            }
            break;

          case "done":
            setMessages((prev) => prev.filter((m) => m.id !== "status-bar"));
            setMeetingActive(false);
            setActiveAgentsInMeeting([]);
            setLlmConfigured((event as { llm_configured?: boolean }).llm_configured ?? llmConfigured);
            // Add final assistant turn to history
            const lastCeo = [...messages].reverse().find((m: ChatMsg) => m.role === "ceo");
            if (lastCeo) historyRef.current.push({ role: "assistant", content: lastCeo.content, createdAt: new Date().toISOString() });
            break;

          case "error":
            addMsg({ id: `err-${Date.now()}`, role: "system", content: `Error: ${e.message}`, status: "error" });
            break;
        }
      }
    } catch (err) {
      addMsg({ id: `err-${Date.now()}`, role: "system", content: `Connection error: ${String(err)}`, status: "error" });
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [input, isStreaming, addMsg, messages, llmConfigured]);

  const roleLabel = (msg: ChatMsg) => {
    if (msg.role === "user") return "You";
    if (msg.role === "ceo") return "CEO Agent";
    if (msg.role === "planner") return "Planner Agent";
    return msg.agentName ?? "Agent";
  };

  const roleColor = (msg: ChatMsg) => {
    if (msg.role === "user") return "from-blue-500 to-purple-600";
    if (msg.role === "ceo") return "from-purple-500 to-pink-600";
    if (msg.role === "planner") return "from-blue-400 to-cyan-500";
    return `from-${agentColor(msg.agentSlug ?? "")}-500 to-${agentColor(msg.agentSlug ?? "")}-700`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Nav */}
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
            {!llmConfigured && (
              <Link to="/llm-management">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 cursor-pointer hover:bg-amber-500/30">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Add LLM Key
                </Badge>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </Button>
            <Avatar className="w-8 h-8 border border-white/20">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {user?.name?.slice(0, 2).toUpperCase() ?? "AI"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <div className="w-72 border-r border-white/10 bg-[#0a0a0f] flex flex-col">
          <div className="p-4 border-b border-white/10">
            <Button
              onClick={() => { setMessages([{ id: "welcome", role: "system", content: "New conversation started.", status: "done", timestamp: new Date().toISOString() }]); historyRef.current = []; sessionId.current = `ws-${Date.now()}`; }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-1">
                {QUICK_LINKS.map(({ to, Icon, label }) => (
                  <Link key={to} to={to}>
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 h-8 text-sm">
                      <Icon className="w-4 h-4 mr-2" />{label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Workspaces</h3>
              <div className="space-y-1">
                {WORKSPACE_LINKS.map(({ to, Icon, label }) => (
                  <Link key={to} to={to}>
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 h-8 text-sm">
                      <Icon className="w-4 h-4 mr-2" />{label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Active Agents Panel — always visible */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center justify-between">
                <span>Active Agents</span>
                <Link to="/agents" className="text-blue-400 hover:text-blue-300 normal-case font-normal tracking-normal">
                  View all
                </Link>
              </h3>
              {sidebarAgents.length === 0 ? (
                <div className="text-xs text-gray-600 py-2">Loading agents...</div>
              ) : (
                <div className="space-y-1.5">
                  {sidebarAgents.slice(0, 12).map((agent) => {
                    const isActive = agent.status === "ACTIVE";
                    const inMeeting = isActive && meetingActive && activeAgentsInMeeting.some(
                      (slug) => agent.slug.includes(slug) || slug.includes(agent.slug.split("-")[0])
                    );
                    return (
                      <div
                        key={agent.id}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                          inMeeting
                            ? "bg-amber-500/10 border border-amber-500/20"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            inMeeting
                              ? "bg-amber-400 animate-pulse"
                              : isActive
                              ? "bg-green-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        />
                        <span className={`text-xs truncate flex-1 ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                          {agent.name}
                        </span>
                        {isActive && (agent.stats?.activeTasks ?? 0) > 0 && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full shrink-0">
                            {agent.stats!.activeTasks}
                          </span>
                        )}
                        {inMeeting && (
                          <span className="text-[10px] text-amber-400 shrink-0">🎤</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {meetingActive && activeAgentsInMeeting.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">
                  🔴 Meeting In Progress
                </h3>
                <div className="space-y-1">
                  {activeAgentsInMeeting.map((slug) => (
                    <div key={slug} className="flex items-center gap-2 text-xs text-amber-300 px-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="capitalize">{slug.replace(/-/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <Link to="/llm-management">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                API Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-[#111117]/50 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                All Agents
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center gap-2">
                {meetingActive ? (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Meeting Active
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Agents Ready
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role !== "system" && (
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className={`bg-gradient-to-br ${roleColor(msg)} text-white text-xs`}>
                        {msg.role === "user" ? (user?.name?.slice(0, 2).toUpperCase() ?? "U") : <Brain className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex-1 max-w-2xl ${msg.role === "user" ? "flex flex-col items-end" : ""} ${msg.role === "system" ? "mx-auto max-w-full" : ""}`}>
                    {msg.role !== "user" && msg.role !== "system" && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-semibold text-sm capitalize">{roleLabel(msg)}</span>
                        {msg.status === "streaming" && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            <Loader2 className="w-2 h-2 animate-spin mr-1" />Typing
                          </Badge>
                        )}
                        {msg.status === "done" && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        )}
                      </div>
                    )}
                    {msg.role === "system" ? (
                      <div className="text-xs text-gray-500 text-center py-1">{msg.content}</div>
                    ) : (
                      <Card className={`p-4 ${msg.role === "user" ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30" : msg.status === "error" ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10"}`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </Card>
                    )}
                    {msg.role !== "system" && (
                      <span className="text-xs text-gray-600 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isStreaming && !messages.some((m) => m.status === "streaming") && (
              <div className="flex gap-3">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Brain className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="p-4 bg-white/5 border-white/10">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </Card>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestion pills */}
          {messages.length <= 2 && !isStreaming && (
            <div className="px-6 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-[#111117]/50 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask your AI agents anything..."
                    disabled={isStreaming}
                    className="pr-20 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 min-h-12 disabled:opacity-50"
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
                <Button
                  onClick={() => sendMessage()}
                  disabled={isStreaming || !input.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12 px-6 disabled:opacity-50"
                >
                  {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                AI agents may make mistakes. Review important decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l border-white/10 bg-[#0a0a0f] overflow-y-auto">
          <Tabs defaultValue="context" className="h-full">
            <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none p-0">
              <TabsTrigger value="context" className="flex-1 rounded-none data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Context
              </TabsTrigger>
              <TabsTrigger value="meeting" className="flex-1 rounded-none data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                Meeting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="context" className="p-4 space-y-4 mt-0">
              <h3 className="text-sm font-semibold">Company Context</h3>
              <Card className="bg-white/5 border-white/10 p-3">
                <div className="text-xs text-gray-400 mb-1">Account</div>
                <div className="text-sm">{user?.name ?? "—"}</div>
              </Card>
              <Card className="bg-white/5 border-white/10 p-3">
                <div className="text-xs text-gray-400 mb-1">Email</div>
                <div className="text-sm truncate">{user?.email ?? "—"}</div>
              </Card>
              <Card className="bg-white/5 border-white/10 p-3">
                <div className="text-xs text-gray-400 mb-1">LLM Status</div>
                <div className={`text-sm ${llmConfigured ? "text-green-400" : "text-amber-400"}`}>
                  {llmConfigured ? "Connected" : "Not configured"}
                </div>
              </Card>
              {!llmConfigured && (
                <Link to="/llm-management">
                  <Button variant="outline" size="sm" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 mt-2">
                    <Cpu className="w-3 h-3 mr-2" />
                    Connect OpenAI Key
                  </Button>
                </Link>
              )}
            </TabsContent>

            <TabsContent value="meeting" className="p-4 space-y-3 mt-0">
              <h3 className="text-sm font-semibold">
                {meetingActive ? "Meeting in progress" : "Last meeting"}
              </h3>
              {activeAgentsInMeeting.length > 0 ? (
                activeAgentsInMeeting.map((slug) => (
                  <Card key={slug} className="bg-white/5 border-white/10 p-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-${agentColor(slug)}-500/20 flex items-center justify-center`}>
                      <Brain className={`w-4 h-4 text-${agentColor(slug)}-400`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium capitalize">{slug.replace("-", " ")}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Speaking
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-gray-500">Send a message to start an agent meeting.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
