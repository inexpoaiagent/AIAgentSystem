export interface AgentSpec {
  slug: string;
  name: string;
  role: string;
  description: string;
  icon: string;
}

export interface IndustryPack {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  tagline: string;
  valueProposition: string;
  targetCustomers: string[];
  painPoints: string[];
  agents: AgentSpec[];
  outcomes: { metric: string; description: string }[];
  kpis: string[];
  tier: "professional" | "gold";
  price: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export const INDUSTRY_PACKS: IndustryPack[] = [
  {
    id: "construction",
    name: "Construction",
    icon: "🏗️",
    emoji: "🏗️",
    tagline: "Your AI Construction Management Team",
    valueProposition: "Deliver projects on time, control costs, and win more contracts — all managed by AI agents working 24/7.",
    targetCustomers: ["Construction Companies", "General Contractors", "Real Estate Developers", "Builders & Subcontractors"],
    painPoints: [
      "Project delays costing thousands per day",
      "Uncontrolled procurement & material costs",
      "Weak lead pipeline and sales follow-up",
      "No real-time project progress visibility",
      "Manual reporting takes hours every week",
    ],
    agents: [
      { slug: "project-manager", name: "AI Project Manager", role: "MANAGER", description: "Tracks milestones, flags delays, updates stakeholders automatically", icon: "📋" },
      { slug: "procurement-manager", name: "AI Procurement Manager", role: "SPECIALIST", description: "Compares supplier prices, manages POs, tracks material delivery", icon: "🛒" },
      { slug: "cost-controller", name: "AI Cost Controller", role: "SPECIALIST", description: "Monitors budget vs actuals, flags overruns, forecasts final cost", icon: "💰" },
      { slug: "sales-agent", name: "AI Sales Agent", role: "SPECIALIST", description: "Qualifies construction leads, sends proposals, follows up automatically", icon: "🤝" },
      { slug: "crm-agent", name: "AI CRM Agent", role: "WORKER", description: "Manages client relationships, tracks communication history", icon: "📞" },
      { slug: "marketing-agent", name: "AI Marketing Agent", role: "WORKER", description: "Creates project showcases, LinkedIn posts, before/after content", icon: "📣" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Synthesises project portfolio health and strategic decisions", icon: "👑" },
    ],
    outcomes: [
      { metric: "30% fewer delays", description: "AI monitors every milestone and escalates early" },
      { metric: "15% cost savings", description: "Better procurement and early overrun detection" },
      { metric: "3× more leads", description: "Automated outreach and follow-up pipeline" },
      { metric: "10h/week saved", description: "Automated reporting and stakeholder updates" },
    ],
    kpis: ["Active Projects", "On-Time Rate", "Budget Variance", "New Leads", "Proposals Sent", "Win Rate"],
    tier: "professional",
    price: 299,
    color: "#F59E0B",
    gradientFrom: "#78350F",
    gradientTo: "#B45309",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "🏠",
    emoji: "🏠",
    tagline: "Your AI Real Estate Sales Force",
    valueProposition: "Generate more qualified leads, close deals faster, and dominate your local market with 8 AI agents working non-stop.",
    targetCustomers: ["Real Estate Agencies", "Property Developers", "Brokers & Agents", "Property Management Companies"],
    painPoints: [
      "Inconsistent lead generation month to month",
      "Slow follow-up causes leads to go cold",
      "No time to create property marketing content",
      "CRM data is outdated and incomplete",
      "Poor Google / social media visibility",
    ],
    agents: [
      { slug: "lead-hunter", name: "AI Lead Hunter", role: "SPECIALIST", description: "Finds buyer and seller leads from social, web, and portals 24/7", icon: "🎯" },
      { slug: "sales-agent", name: "AI Sales Agent", role: "SPECIALIST", description: "Qualifies leads, schedules viewings, sends personalised proposals", icon: "🤝" },
      { slug: "crm-agent", name: "AI CRM Agent", role: "WORKER", description: "Keeps every contact updated, follow-up reminders automated", icon: "📇" },
      { slug: "property-marketing", name: "AI Property Marketing", role: "SPECIALIST", description: "Creates listing descriptions, social posts, email campaigns per property", icon: "📸" },
      { slug: "call-center", name: "AI Call Center", role: "SPECIALIST", description: "Answers inbound inquiries, qualifies callers, books appointments", icon: "📞" },
      { slug: "seo-agent", name: "AI SEO Agent", role: "SPECIALIST", description: "Optimises agency website and property listings for Google search", icon: "🔍" },
      { slug: "social-agent", name: "AI Social Media Agent", role: "WORKER", description: "Publishes daily property content on Instagram, Facebook, LinkedIn", icon: "📱" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Weekly business performance review and 90-day growth strategy", icon: "👑" },
    ],
    outcomes: [
      { metric: "5× more leads", description: "Multi-channel AI prospecting never stops" },
      { metric: "60% faster follow-up", description: "AI responds to inquiries in under 60 seconds" },
      { metric: "40% more listings", description: "Content creation at scale attracts sellers" },
      { metric: "Top 3 Google rank", description: "AI SEO for local property searches" },
    ],
    kpis: ["New Leads", "Viewings Booked", "Active Listings", "Deals Closed", "Avg Days on Market", "Revenue"],
    tier: "professional",
    price: 299,
    color: "#3B82F6",
    gradientFrom: "#1E3A5F",
    gradientTo: "#1D4ED8",
  },
  {
    id: "clinic",
    name: "Medical Clinic",
    icon: "🏥",
    emoji: "🏥",
    tagline: "Your AI Medical Practice Manager",
    valueProposition: "Fill your appointment calendar, reduce no-shows, and grow patient reviews — while your staff focuses on care.",
    targetCustomers: ["Medical Clinics", "Dental Clinics", "Specialist Doctors", "Physiotherapy Centers"],
    painPoints: [
      "Empty appointment slots wasting clinic capacity",
      "High no-show rate without reminders",
      "Negative reviews going unmanaged",
      "Marketing budget wasted on wrong channels",
      "Reception staff overwhelmed with calls",
    ],
    agents: [
      { slug: "receptionist", name: "AI Receptionist", role: "SPECIALIST", description: "Answers calls, books appointments, handles inquiries 24/7", icon: "🗓️" },
      { slug: "appointment-agent", name: "AI Appointment Agent", role: "WORKER", description: "Sends reminders, reduces no-shows, manages cancellations", icon: "⏰" },
      { slug: "call-center", name: "AI Call Center", role: "SPECIALIST", description: "Handles patient follow-up calls and post-visit check-ins", icon: "📞" },
      { slug: "marketing-agent", name: "AI Marketing Agent", role: "SPECIALIST", description: "Creates health content, seasonal campaigns, patient education posts", icon: "📣" },
      { slug: "crm-agent", name: "AI CRM Agent", role: "WORKER", description: "Tracks patient history, visit frequency, and re-engagement", icon: "📋" },
      { slug: "reputation-manager", name: "AI Reputation Manager", role: "SPECIALIST", description: "Monitors and responds to Google and health platform reviews", icon: "⭐" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Monthly clinic performance report and growth recommendations", icon: "👑" },
    ],
    outcomes: [
      { metric: "40% fewer no-shows", description: "Automated multi-channel appointment reminders" },
      { metric: "2× new patients", description: "AI marketing and reputation management" },
      { metric: "4.8★ average rating", description: "Proactive review collection and response" },
      { metric: "Save 2 FTE", description: "AI receptionist handles 80% of inbound calls" },
    ],
    kpis: ["Appointments Today", "No-Show Rate", "New Patients", "Google Rating", "Monthly Revenue", "Patient Retention"],
    tier: "professional",
    price: 299,
    color: "#10B981",
    gradientFrom: "#064E3B",
    gradientTo: "#047857",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: "🍽️",
    emoji: "🍽️",
    tagline: "Your AI Restaurant Operations Team",
    valueProposition: "Fill more tables, own your online reputation, and grow loyal customers with an AI team that never sleeps.",
    targetCustomers: ["Restaurants", "Cafes & Coffee Shops", "Cloud Kitchens", "Catering Companies"],
    painPoints: [
      "Inconsistent table reservations and empty off-peak hours",
      "Negative reviews damaging reputation online",
      "No budget for a full marketing team",
      "Low repeat customer rate",
      "Manual social media posting eating time",
    ],
    agents: [
      { slug: "reservation-agent", name: "AI Reservation Agent", role: "SPECIALIST", description: "Handles online and phone reservations, manages table availability", icon: "🪑" },
      { slug: "marketing-agent", name: "AI Marketing Agent", role: "SPECIALIST", description: "Creates promotional campaigns, special offers, event announcements", icon: "📣" },
      { slug: "social-agent", name: "AI Social Media Agent", role: "WORKER", description: "Daily food photos descriptions, stories, hashtags, engagement", icon: "📱" },
      { slug: "review-manager", name: "AI Review Manager", role: "SPECIALIST", description: "Monitors Google, TripAdvisor, Zomato and responds to every review", icon: "⭐" },
      { slug: "crm-agent", name: "AI CRM Agent", role: "WORKER", description: "Tracks regulars, birthday campaigns, loyalty programme management", icon: "❤️" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Weekly revenue analysis and menu performance insights", icon: "👑" },
    ],
    outcomes: [
      { metric: "30% more covers", description: "AI fills off-peak slots with targeted promotions" },
      { metric: "4.7★ rating", description: "Every review responded to within 2 hours" },
      { metric: "25% repeat rate", description: "Loyalty campaigns bring customers back" },
      { metric: "Daily social presence", description: "Content posted every day without effort" },
    ],
    kpis: ["Reservations Today", "Table Occupancy %", "Google Rating", "Repeat Customers", "Social Reach", "Weekly Revenue"],
    tier: "professional",
    price: 299,
    color: "#EF4444",
    gradientFrom: "#7F1D1D",
    gradientTo: "#B91C1C",
  },
  {
    id: "university",
    name: "University / School",
    icon: "🎓",
    emoji: "🎓",
    tagline: "Your AI Education Operations Team",
    valueProposition: "Increase enrolments, support students 24/7, and automate administrative workload with purpose-built education AI.",
    targetCustomers: ["Private Universities", "Training Institutes", "Schools", "Online Course Platforms"],
    painPoints: [
      "Low enrolment and slow student recruitment pipeline",
      "Students can't get answers outside office hours",
      "Marketing budget producing poor ROI",
      "Admin staff buried in repetitive queries",
      "No data on student dropout risk",
    ],
    agents: [
      { slug: "admissions-agent", name: "AI Admissions Agent", role: "SPECIALIST", description: "Qualifies prospective students, books info sessions, follows up", icon: "🎯" },
      { slug: "student-advisor", name: "AI Student Advisor", role: "SPECIALIST", description: "Answers student queries about courses, fees, schedules 24/7", icon: "💬" },
      { slug: "call-center", name: "AI Call Center", role: "SPECIALIST", description: "Handles inbound calls for admissions and student support", icon: "📞" },
      { slug: "marketing-agent", name: "AI Marketing Agent", role: "SPECIALIST", description: "Creates enrolment campaigns, open day promotions, testimonial content", icon: "📣" },
      { slug: "crm-agent", name: "AI CRM Agent", role: "WORKER", description: "Tracks prospective and current students through their lifecycle", icon: "📋" },
      { slug: "research-assistant", name: "AI Research Assistant", role: "WORKER", description: "Summarises papers, assists faculty with literature reviews", icon: "📚" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Enrolment trend analysis and institutional performance dashboard", icon: "👑" },
    ],
    outcomes: [
      { metric: "3× enrolment leads", description: "AI admissions pipeline running 24/7" },
      { metric: "80% query automation", description: "AI student advisor handles repetitive questions" },
      { metric: "50% admin cost saved", description: "Automated scheduling, reminders, and follow-ups" },
      { metric: "Higher retention", description: "Early dropout risk detection and intervention" },
    ],
    kpis: ["Prospective Students", "Applications Received", "Enrolment Rate", "Student Satisfaction", "Query Response Time", "Retention Rate"],
    tier: "gold",
    price: 999,
    color: "#8B5CF6",
    gradientFrom: "#2E1065",
    gradientTo: "#6D28D9",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: "🛒",
    emoji: "🛒",
    tagline: "Your AI E-Commerce Growth Engine",
    valueProposition: "Scale revenue, reduce cart abandonment, and dominate Google Shopping — with an AI team that optimises your store 24/7.",
    targetCustomers: ["Online Stores", "D2C Brands", "Dropshipping Businesses", "Amazon / Noon Sellers"],
    painPoints: [
      "High cart abandonment with no follow-up",
      "Poor Google and marketplace SEO rankings",
      "Rising ad costs with declining ROAS",
      "No time to manage customer support volume",
      "No data-driven product or pricing decisions",
    ],
    agents: [
      { slug: "product-manager", name: "AI Product Manager", role: "MANAGER", description: "Analyses best-sellers, flags slow movers, suggests pricing changes", icon: "📦" },
      { slug: "ads-agent", name: "AI Ads Agent", role: "SPECIALIST", description: "Manages Google and Meta ad campaigns, optimises ROAS daily", icon: "📊" },
      { slug: "seo-agent", name: "AI SEO Agent", role: "SPECIALIST", description: "Optimises product titles, descriptions, and category pages for search", icon: "🔍" },
      { slug: "customer-support", name: "AI Customer Support", role: "SPECIALIST", description: "Handles returns, queries, order status, and complaints instantly", icon: "💬" },
      { slug: "crm-agent", name: "AI CRM Agent", role: "WORKER", description: "Cart abandonment recovery, repeat purchase campaigns, VIP segmentation", icon: "❤️" },
      { slug: "sales-agent", name: "AI Sales Agent", role: "SPECIALIST", description: "Upsell and cross-sell recommendations via email and chat", icon: "🤝" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Weekly revenue intelligence report and growth strategy", icon: "👑" },
    ],
    outcomes: [
      { metric: "25% more revenue", description: "AI cart recovery and upsell automation" },
      { metric: "3× organic traffic", description: "AI SEO for every product page" },
      { metric: "60% faster support", description: "AI handles 80% of customer queries instantly" },
      { metric: "Higher ROAS", description: "Daily ad optimisation by AI" },
    ],
    kpis: ["Daily Orders", "Revenue", "Cart Abandonment Rate", "ROAS", "Organic Traffic", "Customer Support CSAT"],
    tier: "professional",
    price: 299,
    color: "#F97316",
    gradientFrom: "#7C2D12",
    gradientTo: "#C2410C",
  },
  {
    id: "law-firm",
    name: "Law Firm",
    icon: "⚖️",
    emoji: "⚖️",
    tagline: "Your AI Legal Practice Growth Team",
    valueProposition: "Convert more consultation requests, handle client intake automatically, and grow your firm's authority online.",
    targetCustomers: ["Law Firms", "Solo Practitioners", "Legal Consultants", "Notary Offices"],
    painPoints: [
      "Slow or missed responses to consultation requests",
      "Time wasted on non-billable admin and intake",
      "Low online visibility in competitive legal market",
      "Inconsistent client communication and follow-up",
      "No system to track leads and conversion rates",
    ],
    agents: [
      { slug: "intake-agent", name: "AI Intake Agent", role: "SPECIALIST", description: "Qualifies new client enquiries, collects case details, books consultations", icon: "📝" },
      { slug: "crm-agent", name: "AI CRM Agent", role: "WORKER", description: "Tracks all client interactions, deadlines, follow-ups", icon: "📋" },
      { slug: "document-assistant", name: "AI Document Assistant", role: "SPECIALIST", description: "Drafts standard letters, NDAs, contracts, and legal summaries", icon: "📄" },
      { slug: "marketing-agent", name: "AI Marketing Agent", role: "SPECIALIST", description: "Creates legal articles, LinkedIn thought leadership, case study posts", icon: "📣" },
      { slug: "call-center", name: "AI Call Center", role: "SPECIALIST", description: "Answers inbound calls, pre-qualifies callers, routes to the right attorney", icon: "📞" },
      { slug: "seo-agent", name: "AI SEO Agent", role: "WORKER", description: "Optimises firm website for practice area keywords and local search", icon: "🔍" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Monthly firm performance review, pipeline health, revenue forecast", icon: "👑" },
    ],
    outcomes: [
      { metric: "3× consultation bookings", description: "AI intake never misses a new client enquiry" },
      { metric: "5h/week saved per attorney", description: "AI drafts routine documents and client updates" },
      { metric: "Top 5 local Google rank", description: "AI SEO for practice area + city searches" },
      { metric: "90% lead response rate", description: "Every enquiry responded to in under 5 minutes" },
    ],
    kpis: ["New Enquiries", "Consultations Booked", "Cases Won", "Billable Hours", "Google Ranking", "Monthly Revenue"],
    tier: "gold",
    price: 999,
    color: "#6366F1",
    gradientFrom: "#1E1B4B",
    gradientTo: "#4338CA",
  },
  {
    id: "hotel",
    name: "Hotel / Hospitality",
    icon: "🏨",
    emoji: "🏨",
    tagline: "Your AI Hotel Revenue & Guest Experience Team",
    valueProposition: "Maximise occupancy, automate guest communication, and build a 5-star online reputation with AI hospitality agents.",
    targetCustomers: ["Hotels", "Boutique Stays", "Serviced Apartments", "Resort Properties"],
    painPoints: [
      "Low direct bookings — too dependent on OTAs",
      "Slow response to guest inquiries and reviews",
      "No personalised upselling or loyalty programme",
      "High cost of front desk and concierge staff",
      "Poor online reputation management",
    ],
    agents: [
      { slug: "booking-agent", name: "AI Booking Agent", role: "SPECIALIST", description: "Handles direct booking inquiries, availability checks, and confirmation", icon: "🗓️" },
      { slug: "guest-experience", name: "AI Guest Experience Agent", role: "SPECIALIST", description: "Pre-arrival messages, in-stay requests, check-out follow-up", icon: "🛎️" },
      { slug: "call-center", name: "AI Call Center", role: "SPECIALIST", description: "Answers phone inquiries, handles requests, routes to departments", icon: "📞" },
      { slug: "reputation-manager", name: "AI Reputation Manager", role: "SPECIALIST", description: "Monitors Booking.com, TripAdvisor, Google and responds to reviews", icon: "⭐" },
      { slug: "marketing-agent", name: "AI Marketing Agent", role: "SPECIALIST", description: "Creates seasonal packages, flash sales, loyalty campaigns", icon: "📣" },
      { slug: "revenue-manager", name: "AI Revenue Manager", role: "WORKER", description: "Monitors competitor pricing, suggests dynamic rate adjustments", icon: "💰" },
      { slug: "ceo-assistant", name: "AI CEO Assistant", role: "CEO", description: "Weekly RevPAR analysis, occupancy forecast, and strategy review", icon: "👑" },
    ],
    outcomes: [
      { metric: "20% more direct bookings", description: "AI converts website visitors to direct guests" },
      { metric: "4.9★ on all platforms", description: "Every review replied to within 1 hour" },
      { metric: "15% higher ADR", description: "AI upsells upgrades and packages to every guest" },
      { metric: "Save 1 FTE", description: "AI handles 70% of front desk inquiries" },
    ],
    kpis: ["Occupancy Rate", "RevPAR", "Direct Bookings %", "Guest Rating", "Review Response Rate", "ADR"],
    tier: "gold",
    price: 999,
    color: "#14B8A6",
    gradientFrom: "#042F2E",
    gradientTo: "#0F766E",
  },
];

export function getPackById(id: string): IndustryPack | undefined {
  return INDUSTRY_PACKS.find((p) => p.id === id);
}
