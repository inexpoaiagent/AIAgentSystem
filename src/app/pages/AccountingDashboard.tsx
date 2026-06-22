import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { createRuntimeEvent } from "../lib/runtime-store";
import { ArrowRight, ChevronLeft, FileText, Plus, ReceiptText, TrendingUp, WalletCards } from "lucide-react";

const invoices = [
  { number: "INV-1024", customer: "Palm Heights Buyer", amount: 12500, status: "Paid" },
  { number: "INV-1025", customer: "Marina Investor Lead", amount: 8200, status: "Sent" },
  { number: "INV-1026", customer: "Downtown Lease Client", amount: 4300, status: "Draft" },
];

const expenses = [
  { category: "Meta ads", amount: 2400, budget: 3200 },
  { category: "Content production", amount: 1800, budget: 2500 },
  { category: "AI operations", amount: 620, budget: 1000 },
  { category: "CRM tools", amount: 390, budget: 800 },
];

export default function AccountingDashboard() {
  const revenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const cost = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = revenue - cost;

  const createInvoice = () => {
    createRuntimeEvent({
      type: "approval",
      title: "Invoice generation approval required",
      detail: "Accounting Agent prepared an invoice. Human approval is required before sending it to the customer.",
      status: "needs_approval",
    });
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
            <WalletCards className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold">AI Accounting Manager</h1>
          </div>
          <Button onClick={createInvoice} className="bg-white text-black hover:bg-gray-100">
            <Plus className="w-4 h-4 mr-2" />
            New invoice
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            ["Revenue", revenue, TrendingUp, "text-green-300"],
            ["Expenses", cost, ReceiptText, "text-yellow-300"],
            ["Profit", profit, WalletCards, "text-blue-300"],
            ["Next forecast", Math.round(profit * 1.18), FileText, "text-purple-300"],
          ].map(([label, value, Icon, tone]) => (
            <Card key={label as string} className="bg-[#111117]/50 border-white/10 p-5">
              <Icon className={`w-6 h-6 mb-4 ${tone}`} />
              <div className="text-sm text-gray-400">{label as string}</div>
              <div className="text-3xl font-bold">${Number(value).toLocaleString()}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5">Invoices</h2>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.number} className="grid grid-cols-[1fr_auto_auto] gap-4 rounded-lg bg-white/5 border border-white/10 p-4 items-center">
                  <div>
                    <div className="font-medium">{invoice.number}</div>
                    <div className="text-sm text-gray-400">{invoice.customer}</div>
                  </div>
                  <div className="font-semibold">${invoice.amount.toLocaleString()}</div>
                  <Badge className={invoice.status === "Paid" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"}>
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#111117]/50 border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-5">Expense control</h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{expense.category}</span>
                    <span>${expense.amount.toLocaleString()} / ${expense.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={(expense.amount / expense.budget) * 100} className="h-2" />
                </div>
              ))}
            </div>
            <Button
              onClick={() =>
                createRuntimeEvent({
                  type: "action",
                  title: "Profit forecast refreshed",
                  detail: "Accounting Agent recalculated revenue, expenses, AI cost, and campaign ROI.",
                  status: "completed",
                })
              }
              variant="outline"
              className="mt-6 w-full border-white/20 text-white hover:bg-white/10"
            >
              Refresh forecast
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
