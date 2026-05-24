import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ChevronLeft, Globe, Wand2, Download, Eye, Accessibility, Gauge } from "lucide-react";

export default function WebsiteDesigner() {
  const [business, setBusiness] = useState("Luxury real estate agency");
  const [style, setStyle] = useState("Premium, minimal, cinematic");
  const [language, setLanguage] = useState("English + Persian");

  const pages = useMemo(() => ["Home", "Properties", "About", "Blog", "Contact", "Dashboard"], []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Back</Button></Link>
          <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /><h1 className="text-xl font-semibold">Website Designer Agent</h1></div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">AI Builder</Badge>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-6">
        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-5">Website brief</h2>
          <div className="space-y-4">
            <Input value={business} onChange={(e) => setBusiness(e.target.value)} className="bg-white/5 border-white/10 text-white" />
            <Input value={style} onChange={(e) => setStyle(e.target.value)} className="bg-white/5 border-white/10 text-white" />
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-white/5 border-white/10 text-white" />
            <Textarea value="Generate responsive layout, typography, color system, SEO metadata, accessible components, and exportable code." className="min-h-28 bg-white/5 border-white/10 text-white" readOnly />
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600"><Wand2 className="w-4 h-4 mr-2" />Generate website</Button>
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold">Live preview</h2>
                <p className="text-sm text-gray-400">{business} - {style} - {language}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10"><Eye className="w-4 h-4 mr-2" />Preview</Button>
                <Button className="bg-white text-black hover:bg-gray-100"><Download className="w-4 h-4 mr-2" />Export</Button>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="font-semibold">Aurelia Estates</div>
                <div className="hidden md:flex gap-5 text-sm text-gray-300">{pages.slice(0, 5).map((page) => <span key={page}>{page}</span>)}</div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">AI generated</Badge>
                  <h3 className="text-4xl font-bold mb-3">Find premium homes with an AI property team.</h3>
                  <p className="text-gray-400 mb-5">Responsive landing page with CRM capture, SEO sections, listings, and multilingual support.</p>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600">Book consultation</Button>
                </div>
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-500/25 to-purple-600/25 border border-blue-500/30 p-5">
                  <div className="h-full rounded-lg border border-white/10 bg-white/10 grid grid-cols-2 gap-3 p-3">
                    {pages.slice(0, 4).map((page) => <div key={page} className="rounded-lg bg-black/25 border border-white/10 p-3 text-sm">{page}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "SEO", value: "94/100", icon: Gauge },
              { label: "Accessibility", value: "AA", icon: Accessibility },
              { label: "Performance", value: "97", icon: Gauge },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="bg-[#111117]/50 border-white/10 p-5">
                <Icon className="w-5 h-5 text-green-300 mb-3" />
                <div className="text-sm text-gray-400">{label}</div>
                <div className="text-3xl font-bold">{value}</div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
