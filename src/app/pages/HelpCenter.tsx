import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ChevronLeft, HelpCircle, BookOpen, PlayCircle, Wand2, Search } from "lucide-react";

const guides = [
  "Create your first company workspace",
  "Invite your team and configure roles",
  "Connect CRM, WordPress, and social accounts",
  "Run an AI meeting and approve an action plan",
  "Configure billing limits and usage alerts",
  "Build a website with Website Designer Agent",
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Back</Button></Link>
          <div className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-400" /><h1 className="text-xl font-semibold">Help Center</h1></div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Smart help</Badge>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-8">
          <h2 className="text-4xl font-bold mb-4">What do you want to automate today?</h2>
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search guides, videos, agents, billing, API, CRM, SEO..." className="h-12 pl-11 bg-black/30 border-white/10 text-white" />
          </div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[BookOpen, PlayCircle, Wand2].map((Icon, index) => (
            <Card key={index} className="bg-[#111117]/50 border-white/10 p-6">
              <Icon className="w-7 h-7 text-blue-300 mb-4" />
              <h3 className="font-semibold mb-2">{["Step-by-step guides", "Video tutorials", "AI assistant guide"][index]}</h3>
              <p className="text-sm text-gray-400">{["Guided onboarding for every module.", "Short product walkthroughs for teams.", "Contextual help and smart suggestions."][index]}</p>
            </Card>
          ))}
        </div>
        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended onboarding path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guides.map((guide, index) => (
              <div key={guide} className="rounded-lg bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">{index + 1}</span>
                <span className="text-sm">{guide}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
