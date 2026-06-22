import React from "react";
import { createBrowserRouter } from "react-router";
import AuthGuard from "./components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import MainWorkspace from "./pages/MainWorkspace";
import AIVoiceInterface from "./pages/AIVoiceInterface";
import AgentDashboard from "./pages/AgentDashboard";
import AIMeetingRoom from "./pages/AIMeetingRoom";
import CRMDashboard from "./pages/CRMDashboard";
import SEOWorkspace from "./pages/SEOWorkspace";
import SocialMediaWorkspace from "./pages/SocialMediaWorkspace";
import AutomationBuilder from "./pages/AutomationBuilder";
import Subscription from "./pages/Subscription";
import CompanyBrain from "./pages/CompanyBrain";
import Marketplace from "./pages/Marketplace";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Architecture from "./pages/Architecture";
import Tickets from "./pages/Tickets";
import Notifications from "./pages/Notifications";
import WebsiteDesigner from "./pages/WebsiteDesigner";
import LLMManagement from "./pages/LLMManagement";
import AccountingDashboard from "./pages/AccountingDashboard";
import HelpCenter from "./pages/HelpCenter";
import AgentOS from "./pages/AgentOS";
import CEOCommandCenter from "./pages/CEOCommandCenter";
import QAAudit from "./pages/QAAudit";
import NotFound from "./pages/NotFound";
import BusinessDoctor from "./pages/BusinessDoctor";
import IndustryMarketplace from "./pages/IndustryMarketplace";
import PackDetails from "./pages/PackDetails";
import AdminUsers from "./pages/AdminUsers";
import AdminCompanies from "./pages/AdminCompanies";
import AdminIndustryPacks from "./pages/AdminIndustryPacks";
import AdminCategories from "./pages/AdminCategories";

const guard = (C: React.ComponentType) => () => <AuthGuard><C /></AuthGuard>;

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/signin", Component: SignIn },
  { path: "/signup", Component: SignUp },

  // Protected routes — redirect to /signin if not logged in
  { path: "/onboarding", Component: guard(Onboarding) },
  { path: "/workspace", Component: guard(MainWorkspace) },
  { path: "/voice", Component: guard(AIVoiceInterface) },
  { path: "/agents", Component: guard(AgentDashboard) },
  { path: "/agent-os", Component: guard(AgentOS) },
  { path: "/meeting", Component: guard(AIMeetingRoom) },
  { path: "/crm", Component: guard(CRMDashboard) },
  { path: "/seo", Component: guard(SEOWorkspace) },
  { path: "/social", Component: guard(SocialMediaWorkspace) },
  { path: "/automation", Component: guard(AutomationBuilder) },
  { path: "/subscription", Component: guard(Subscription) },
  { path: "/brain", Component: guard(CompanyBrain) },
  { path: "/marketplace", Component: guard(Marketplace) },
  { path: "/admin", Component: guard(AdminDashboard) },
  { path: "/admin/users", Component: guard(AdminUsers) },
  { path: "/admin/companies", Component: guard(AdminCompanies) },
  { path: "/admin/packs", Component: guard(AdminIndustryPacks) },
  { path: "/admin/categories", Component: guard(AdminCategories) },
  { path: "/analytics", Component: guard(AnalyticsDashboard) },
  { path: "/architecture", Component: guard(Architecture) },
  { path: "/tickets", Component: guard(Tickets) },
  { path: "/notifications", Component: guard(Notifications) },
  { path: "/website-designer", Component: guard(WebsiteDesigner) },
  { path: "/llm-management", Component: guard(LLMManagement) },
  { path: "/accounting", Component: guard(AccountingDashboard) },
  { path: "/help", Component: guard(HelpCenter) },
  { path: "/ceo", Component: guard(CEOCommandCenter) },
  { path: "/qa-audit", Component: guard(QAAudit) },
  { path: "/business-doctor", Component: guard(BusinessDoctor) },
  // Industry AI Packs — public + protected
  { path: "/industry", Component: IndustryMarketplace },
  { path: "/industry/:packId", Component: PackDetails },
  { path: "*", Component: NotFound },
]);
