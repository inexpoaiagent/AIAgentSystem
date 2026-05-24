import {
  BarChart3,
  Bot,
  Brain,
  Building2,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const industrySuites = [
  {
    name: "Real Estate",
    plan: "Real Estate Professional",
    agents: ["Sales", "Lead Qualification", "Property Matching", "CRM", "SEO", "Website", "WhatsApp"],
  },
  {
    name: "Marketing Agency",
    plan: "Agency Growth",
    agents: ["SEO", "Blog Writer", "Content Strategy", "Social Media", "Ad Copy", "Client Reporting"],
  },
  {
    name: "Construction",
    plan: "Operations Control",
    agents: ["Procurement", "Project Tracking", "Delay Detection", "Budget Analysis", "Reporting"],
  },
  {
    name: "Ecommerce",
    plan: "Commerce Optimization",
    agents: ["Product SEO", "Inventory Forecast", "Customer Support", "Email Marketing", "Conversion"],
  },
];

export const commandCenterMetrics = [
  { label: "Active agents", value: "12", icon: Bot },
  { label: "Open workflows", value: "34", icon: Zap },
  { label: "CRM conversion", value: "28%", icon: Users },
  { label: "Memory accuracy", value: "94%", icon: Brain },
];

export const enterpriseCapabilities = [
  { label: "Multi-tenant isolation", icon: Shield },
  { label: "AI meeting consensus", icon: MessageSquare },
  { label: "Usage billing", icon: BarChart3 },
  { label: "Industry suites", icon: Building2 },
  { label: "Autonomous optimization", icon: TrendingUp },
];
