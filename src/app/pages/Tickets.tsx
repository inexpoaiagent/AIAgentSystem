import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ChevronLeft, LifeBuoy, Paperclip, Send, Clock, UserCheck } from "lucide-react";

const tickets = [
  { id: "TCK-1042", title: "SEO audit did not finish", status: "Open", priority: "High", assignee: "Support Lead", updated: "8 min ago" },
  { id: "TCK-1039", title: "Need invoice with VAT details", status: "Waiting", priority: "Medium", assignee: "Billing", updated: "1 hour ago" },
  { id: "TCK-1028", title: "Add Turkish translations to email template", status: "Resolved", priority: "Low", assignee: "Localization", updated: "Yesterday" },
];

export default function Tickets() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState<string | null>(null);

  const submitTicket = () => {
    if (!subject.trim() || !message.trim()) return;
    setCreated(`Ticket TCK-${Math.floor(1100 + Math.random() * 100)} created and routed to support.`);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <TopBar title="Support Tickets" icon={<LifeBuoy className="w-5 h-5 text-blue-400" />} />
      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6">
        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4">Create ticket</h2>
          <div className="space-y-4">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What do you need help with?" className="bg-white/5 border-white/10 text-white" />
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe the issue, expected result, and affected workspace." className="min-h-36 bg-white/5 border-white/10 text-white" />
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Paperclip className="w-4 h-4 mr-2" />
                Attach file
              </Button>
              <Button onClick={submitTicket} className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>
            {created && <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{created}</Badge>}
          </div>
        </Card>

        <Card className="bg-[#111117]/50 border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4">Ticket queue</h2>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg bg-white/5 border border-white/10 p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{ticket.title}</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{ticket.id}</Badge>
                  </div>
                  <div className="text-sm text-gray-400 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> {ticket.assignee}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ticket.updated}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-white/5 text-gray-300 border-white/10">{ticket.priority}</Badge>
                  <Badge className={ticket.status === "Resolved" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}>{ticket.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

function TopBar({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link to="/workspace"><Button variant="ghost" className="text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" />Back</Button></Link>
        <div className="flex items-center gap-2">{icon}<h1 className="text-xl font-semibold">{title}</h1></div>
        <div />
      </div>
    </nav>
  );
}
