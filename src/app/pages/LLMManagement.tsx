import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { api } from "../lib/api";
import { createRuntimeEvent } from "../lib/runtime-store";
import { ChevronLeft, Cpu, Gauge, KeyRound, Save, ShieldCheck, Shuffle } from "lucide-react";

const providerPresets = [
  { provider: "openai", label: "OpenAI", model: "gpt-4.1-mini", use: "Business Doctor reasoning, agents, embeddings, voice-ready routing" },
  { provider: "anthropic", label: "Claude", model: "claude-3-5-sonnet-latest", use: "Long strategy analysis and agent review" },
  { provider: "gemini", label: "Gemini", model: "gemini-1.5-pro", use: "Document and multimodal analysis" },
  { provider: "local", label: "Local / Ollama", model: "llama3.1", use: "Private company documents and low-cost tasks" },
];

type SavedProvider = {
  provider?: string;
  model?: string;
  api_key_masked?: string;
  enabled?: boolean;
};

export default function LLMManagement() {
  const [provider, setProvider] = useState(providerPresets[0].provider);
  const [model, setModel] = useState(providerPresets[0].model);
  const [apiKey, setApiKey] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState<SavedProvider[]>([]);
  const [configured, setConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPreset = providerPresets.find((item) => item.provider === provider) ?? providerPresets[0];

  useEffect(() => {
    api
      .getProviderSettings()
      .then((result) => {
        setSaved(result.providers as SavedProvider[]);
        setConfigured(result.llm_configured);
      })
      .catch(() => {
        setError("AI engine is not running. Start FastAPI on port 8000 to save provider keys.");
      });
  }, []);

  const save = async () => {
    if (!apiKey.trim()) {
      toast.error("API key required", { description: "Paste a provider key before saving." });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await api.saveProviderSettings({ provider, model, api_key: apiKey, enabled });
      setSaved(result.providers as SavedProvider[]);
      setConfigured(result.llm_configured);
      setApiKey("");
      createRuntimeEvent({
        type: "audit",
        title: "LLM provider configured",
        detail: `${selectedPreset.label} saved for local AI engine routing. Key is masked in responses.`,
        status: "completed",
      });
      toast.success("Provider saved", { description: `${selectedPreset.label} is ready for Business Doctor and agents.` });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save provider";
      setError(message);
      toast.error("Save failed", { description: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Workspace
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">LLM & API Settings</h1>
          </div>
          <Badge className={configured ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}>
            {configured ? "LLM configured" : "Needs API key"}
          </Badge>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-2xl font-bold mb-2">Connect real model providers</h2>
          <p className="text-sm text-gray-400 mb-6">
            These keys are sent to the local FastAPI engine for this development environment. In production they should be encrypted in the backend secrets vault and scoped per tenant.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-6">
            <div className="space-y-3">
              {providerPresets.map((item) => (
                <button
                  key={item.provider}
                  onClick={() => {
                    setProvider(item.provider);
                    setModel(item.model);
                  }}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    provider === item.provider ? "border-blue-500/50 bg-blue-500/15" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.use}</div>
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label>
                  <span className="mb-2 block text-sm text-gray-300">Provider</span>
                  <Input value={provider} onChange={(event) => setProvider(event.target.value)} className="bg-white/5 border-white/10 text-white" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-gray-300">Model</span>
                  <Input value={model} onChange={(event) => setModel(event.target.value)} className="bg-white/5 border-white/10 text-white" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-gray-300">API key</span>
                <Input
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  type="password"
                  placeholder="Paste provider API key"
                  className="bg-white/5 border-white/10 text-white"
                />
              </label>
              <label className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
                Enable this provider for agent routing
              </label>
              {error && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}
              <Button onClick={save} disabled={saving} className="mt-5 bg-white text-black hover:bg-gray-100">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save provider"}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[["Routing mode", configured ? "LLM + tools" : "Rules only"], ["Avg latency", configured ? "Provider based" : "n/a"], ["Failover", "Ready"], ["Business Doctor", configured ? "Enhanced" : "Crawler only"]].map(([label, value]) => (
            <Card key={label} className="bg-[#111117]/50 border-white/10 p-5">
              <div className="text-sm text-gray-400">{label}</div>
              <div className="text-2xl font-bold">{value}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {saved.map((item) => (
            <Card key={`${item.provider}-${item.model}`} className="bg-[#111117]/50 border-white/10 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{item.provider}</h2>
                  <p className="text-sm text-gray-400">{item.model}</p>
                </div>
                <Badge className={item.enabled ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-gray-500/20 text-gray-300 border-gray-500/30"}>
                  {item.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Routing readiness</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[KeyRound, Shuffle, Gauge].map((Icon, index) => (
                    <div key={index} className="rounded-lg bg-white/5 border border-white/10 p-3">
                      <Icon className="w-4 h-4 text-blue-300 mb-2" />
                      <div className="text-xs text-gray-400">{["Key", "Routing", "Health"][index]}</div>
                      <div className="text-sm">{index === 0 ? item.api_key_masked : "Ready"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-300" />
            Required production rule
          </h2>
          <p className="text-sm text-gray-400">
            For real customers, move provider keys from this local memory endpoint into encrypted backend storage with tenant scopes, audit logs, key rotation, and per-provider rate limits.
          </p>
        </Card>
      </main>
    </div>
  );
}
