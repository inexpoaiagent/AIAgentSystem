import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Brain, ChevronLeft, Check, CreditCard, Zap, Clock, BarChart3 } from "lucide-react";

export default function Subscription() {
  const plans = [
    {
      name: "Starter",
      price: "$299",
      description: "Perfect for small businesses",
      features: [
        "5 AI Agents",
        "10,000 AI operations/month",
        "Basic analytics",
        "Email support",
        "Voice AI (100 min/month)",
      ],
    },
    {
      name: "Professional",
      price: "$799",
      description: "For growing companies",
      features: [
        "15 AI Agents",
        "100,000 AI operations/month",
        "Advanced analytics",
        "Priority support",
        "Voice AI (500 min/month)",
        "Custom workflows",
        "API access",
      ],
      popular: true,
      current: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited AI Agents",
        "Unlimited operations",
        "Enterprise analytics",
        "Dedicated support",
        "Unlimited Voice AI",
        "Custom AI models",
        "White-label options",
        "SLA guarantee",
      ],
    },
  ];

  const usage = [
    { label: "AI Operations", used: 45230, limit: 100000, unit: "ops" },
    { label: "Voice Minutes", used: 187, limit: 500, unit: "min" },
    { label: "Active Agents", used: 8, limit: 15, unit: "agents" },
    { label: "Storage", used: 12.4, limit: 50, unit: "GB" },
  ];

  const invoices = [
    { date: "May 1, 2026", amount: "$799.00", status: "Paid", invoice: "#INV-0521" },
    { date: "Apr 1, 2026", amount: "$799.00", status: "Paid", invoice: "#INV-0421" },
    { date: "Mar 1, 2026", amount: "$799.00", status: "Paid", invoice: "#INV-0321" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Subscription & Billing</h1>
          <div />
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Current Plan */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge className="mb-3 bg-blue-500 text-white border-0">Current Plan</Badge>
              <h2 className="text-3xl font-bold mb-2">Professional</h2>
              <p className="text-gray-300">Your subscription renews on June 1, 2026</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">$799</div>
              <div className="text-gray-400">per month</div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button className="bg-white text-black hover:bg-gray-100">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Payment
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Cancel Subscription
            </Button>
          </div>
        </Card>

        {/* Usage Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Usage This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usage.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {item.used.toLocaleString()}
                    <span className="text-sm text-gray-400 ml-1">/ {item.limit.toLocaleString()} {item.unit}</span>
                  </div>
                  <Progress value={(item.used / item.limit) * 100} className="h-2 mt-3" />
                  <div className="text-xs text-gray-400 mt-2">
                    {((item.used / item.limit) * 100).toFixed(0)}% used
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={`bg-[#111117]/50 backdrop-blur-xl border-white/10 p-8 relative h-full flex flex-col ${plan.popular ? "border-blue-500/50 shadow-2xl shadow-blue-500/20" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute top-4 right-4 bg-blue-500 text-white border-0">
                      Popular
                    </Badge>
                  )}
                  {plan.current && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white border-0">
                      Current Plan
                    </Badge>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-gray-400">/month</span>}
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className={`w-full ${plan.current ? "opacity-50 cursor-not-allowed" : plan.popular ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0" : "border-white/20 hover:bg-white/10"}`} variant={plan.popular ? "default" : "outline"} disabled={plan.current}>
                    {plan.current ? "Current Plan" : plan.price === "Custom" ? "Contact Sales" : "Upgrade"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-6">Billing History</h2>
          <div className="space-y-3">
            {invoices.map((invoice, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.invoice}</div>
                    <div className="text-sm text-gray-400">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{invoice.amount}</div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
