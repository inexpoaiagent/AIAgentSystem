import { createBrowserRouter } from "react-router";
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
import HelpCenter from "./pages/HelpCenter";
import AgentOS from "./pages/AgentOS";
import QAAudit from "./pages/QAAudit";
import NotFound from "./pages/NotFound";
import BusinessDoctor from "./pages/BusinessDoctor";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/workspace",
    Component: MainWorkspace,
  },
  {
    path: "/voice",
    Component: AIVoiceInterface,
  },
  {
    path: "/agents",
    Component: AgentDashboard,
  },
  {
    path: "/meeting",
    Component: AIMeetingRoom,
  },
  {
    path: "/crm",
    Component: CRMDashboard,
  },
  {
    path: "/seo",
    Component: SEOWorkspace,
  },
  {
    path: "/social",
    Component: SocialMediaWorkspace,
  },
  {
    path: "/automation",
    Component: AutomationBuilder,
  },
  {
    path: "/subscription",
    Component: Subscription,
  },
  {
    path: "/brain",
    Component: CompanyBrain,
  },
  {
    path: "/marketplace",
    Component: Marketplace,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/analytics",
    Component: AnalyticsDashboard,
  },
  {
    path: "/architecture",
    Component: Architecture,
  },
  {
    path: "/tickets",
    Component: Tickets,
  },
  {
    path: "/notifications",
    Component: Notifications,
  },
  {
    path: "/website-designer",
    Component: WebsiteDesigner,
  },
  {
    path: "/llm-management",
    Component: LLMManagement,
  },
  {
    path: "/help",
    Component: HelpCenter,
  },
  {
    path: "/agent-os",
    Component: AgentOS,
  },
  {
    path: "/qa-audit",
    Component: QAAudit,
  },
  {
    path: "/business-doctor",
    Component: BusinessDoctor,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
