import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ChevronLeft, Cpu, KeyRound, Shuffle, Gauge, ShieldCheck } from "lucide-react";

const providers = [
  { name: "OpenAI", status: "Primary", spend: 62, latency: "210 ms", models: "Realtime, GPT-5, embeddings" },
  { name: "Claude", status: "Reasoning", spend: 21, latency: "340 ms", models: "Claude Opus, Sonnet" },
  { name: "Gemini", status: "Fallback", spend: 11, latency: "280 ms", models: "Gemini Pro, Flash" },
  { name: "Local Models", status: "Private", spend: 6, latency: "95 ms", models: "Ollama, LM Studio" },
];

export default function LLMManagement() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/admin"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Admin</Button></Link>
          <div className="flex items-center gap-2"><Cpu className="w-5 h-5 text-blue-400" /><h1 className="text-xl font-semibold">LLM Provider Management</h1></div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Failover enabled</Badge>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[["Token spend", "$18.4k"], ["Avg latency", "226 ms"], ["Failovers", "18"], ["Rate limit blocks", "342"]].map(([label, value]) => (
            <Card key={label} className="bg-[#111117]/50 border-white/10 p-5"><div className="text-sm text-gray-400">{label}</div><div className="text-3xl font-bold">{value}</div></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <Card key={provider.name} className="bg-[#111117]/50 border-white/10 p-6">
              <div className="flex items-start justify-between mb-4">
                <div><h2 className="text-xl font-semibold">{provider.name}</h2><p className="text-sm text-gray-400">{provider.models}</p></div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{provider.status}</Badge>
              </div>
              <div className="space-y-4">
                <div><div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Spend share</span><span>{provider.spend}%</span></div><Progress value={provider.spend} className="h-2" /></div>
                <div className="grid grid-cols-3 gap-3">
                  {[KeyRound, Shuffle, Gauge].map((Icon, index) => <div key={index} className="rounded-lg bg-white/5 border border-white/10 p-3"><Icon className="w-4 h-4 text-blue-300 mb-2" /><div className="text-xs text-gray-400">{["Keys", "Routing", "Latency"][index]}</div><div className="text-sm">{index === 2 ? provider.latency : "Configured"}</div></div>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-300" />Routing policy</h2>
          <p className="text-sm text-gray-400">Use OpenAI Realtime for voice, low-latency models for chat, reasoning models for planning, local models for private documents, and automatic failover when provider health or budget thresholds are breached.</p>
        </Card>
      </main>
    </div>
  );
}
