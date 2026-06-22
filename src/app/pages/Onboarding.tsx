import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Brain, TrendingUp, Users, MessageSquare, BarChart3, Globe, Shield, Zap, Bot, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createRuntimeEvent, getSession, saveSession } from "../lib/runtime-store";
import { api } from "../lib/api";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [channels, setChannels] = useState({
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  });

  const industries = [
    "E-commerce",
    "SaaS",
    "Marketing Agency",
    "Consulting",
    "Real Estate",
    "Healthcare",
    "Finance",
    "Education",
  ];

  const agents = [
    { id: "seo", name: "SEO Agent", icon: TrendingUp, color: "from-blue-500 to-cyan-500", desc: "Optimize content & rankings" },
    { id: "sales", name: "Sales Agent", icon: Users, color: "from-purple-500 to-pink-500", desc: "Qualify leads automatically" },
    { id: "crm", name: "CRM Agent", icon: BarChart3, color: "from-green-500 to-emerald-500", desc: "Manage customer relationships" },
    { id: "social", name: "Social Media Agent", icon: MessageSquare, color: "from-orange-500 to-red-500", desc: "Generate & schedule content" },
    { id: "website", name: "Website Agent", icon: Globe, color: "from-indigo-500 to-blue-500", desc: "Build & optimize websites" },
    { id: "finance", name: "Finance Agent", icon: Shield, color: "from-teal-500 to-cyan-500", desc: "Track expenses & invoices" },
    { id: "automation", name: "Automation Agent", icon: Zap, color: "from-yellow-500 to-orange-500", desc: "Create custom workflows" },
    { id: "support", name: "Support Agent", icon: Bot, color: "from-pink-500 to-purple-500", desc: "24/7 customer service" },
  ];

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleComplete = async () => {
    const session = getSession();
    saveSession({ ...session, industry: selectedIndustry, agents: selectedAgents, businessChannels: { ...channels, industry: selectedIndustry }, onboardingComplete: true });
    // Save industry + channels to backend
    try {
      await api.updateCompany({ industry: selectedIndustry, ...channels });
    } catch {
      // non-fatal — session is saved locally
    }
    createRuntimeEvent({
      type: "audit",
      title: "Onboarding completed",
      detail: `${selectedIndustry} workspace activated with ${selectedAgents.length} AI agents.`,
      status: "completed",
    });
    toast.success("AI team activated", { description: "Run the Business Doctor diagnosis next." });
    navigate("/business-doctor");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= num ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-white/10"}`}>
                  {num}
                </div>
                {num < 3 && <div className={`w-20 h-1 ${step > num ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-400 text-sm">
            Step {step} of 3
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 ? (
            <Card className="bg-[#111117]/80 backdrop-blur-xl border-white/10 p-8">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <Brain className="w-8 h-8" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">What's Your Industry?</h1>
                <p className="text-gray-400">This helps us customize your AI agents</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    onClick={() => setSelectedIndustry(industry)}
                    variant="outline"
                    className={`h-auto py-4 ${
                      selectedIndustry === industry
                        ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    {industry}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!selectedIndustry}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12"
              >
                Continue
              </Button>
            </Card>
          ) : step === 2 ? (
            <Card className="bg-[#111117]/80 backdrop-blur-xl border-white/10 p-8">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <Brain className="w-8 h-8" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Select Your AI Team</h1>
                <p className="text-gray-400">Choose the agents you want to activate</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAgents.includes(agent.id)
                        ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {selectedAgents.includes(agent.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center shrink-0`}>
                        <agent.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{agent.name}</h3>
                        <p className="text-sm text-gray-400">{agent.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={selectedAgents.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12"
                >
                  Continue
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="bg-[#111117]/80 backdrop-blur-xl border-white/10 p-8">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <Globe className="w-8 h-8" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Connect Your Business Channels</h1>
                <p className="text-gray-400">The AI Business Doctor will analyze your website and social presence.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  ["website", "Website URL", "https://company.com"],
                  ["instagram", "Instagram URL", "https://instagram.com/company"],
                  ["facebook", "Facebook URL", "https://facebook.com/company"],
                  ["youtube", "YouTube URL", "https://youtube.com/@company"],
                ].map(([key, label, placeholder]) => (
                  <label key={key} className="block">
                    <span className="text-sm text-gray-300 mb-2 block">{label}</span>
                    <Input
                      value={channels[key as keyof typeof channels]}
                      onChange={(event) => setChannels({ ...channels, [key]: event.target.value })}
                      placeholder={placeholder}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!channels.website || !channels.instagram || !channels.facebook || !channels.youtube}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12"
                >
                  Analyze Company
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
