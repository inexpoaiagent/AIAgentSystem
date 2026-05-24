import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Bell, ChevronLeft, Mail, MessageSquare, Smartphone, Radio } from "lucide-react";
import { getRuntimeEvents } from "../lib/runtime-store";

const events = [
  "Subscription purchased",
  "Ticket reply received",
  "SEO analysis completed",
  "Content generation finished",
  "System error detected",
  "Team invitation accepted",
  "Admin message received",
];

export default function Notifications() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(events.map((event) => [event, true])),
  );
  const runtimeEvents = getRuntimeEvents().slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Back</Button></Link>
          <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-blue-400" /><h1 className="text-xl font-semibold">Notification Center</h1></div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Realtime</Badge>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-6">
        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-5">Event preferences</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event} className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{event}</div>
                  <div className="text-sm text-gray-400">Send in-app, email, push, SMS, and realtime alerts based on channel rules.</div>
                </div>
                <Switch checked={enabled[event]} onCheckedChange={(checked) => setEnabled({ ...enabled, [event]: checked })} />
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5">Live event feed</h2>
            {runtimeEvents.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                No runtime events yet. Run an agent, submit a ticket, or complete onboarding to generate traceable events.
              </div>
            ) : (
              <div className="space-y-3">
                {runtimeEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="font-medium text-sm">{event.title}</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{event.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-400">{event.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5">Channels</h2>
            {[Mail, Smartphone, MessageSquare, Radio].map((Icon, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 p-4 mb-3">
                <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-blue-300" /><span>{["Email", "Push", "SMS", "Realtime"][index]}</span></div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
              </div>
            ))}
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30 p-6">
            <h3 className="font-semibold mb-2">Smart digest</h3>
            <p className="text-sm text-gray-300">Low-priority agent events are grouped into a daily executive summary to avoid notification fatigue.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
