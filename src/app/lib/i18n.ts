export type Locale = "en" | "fa" | "tr";

export const locales: Record<Locale, { label: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", dir: "ltr" },
  fa: { label: "فارسی", dir: "rtl" },
  tr: { label: "Turkce", dir: "ltr" },
};

type LandingCopy = {
  nav: string[];
  signIn: string;
  cta: string;
  badge: string;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
  previewTitle: string;
  previewSubtitle: string;
};

export const landingCopy: Record<Locale, LandingCopy> = {
  en: {
    nav: ["Use cases", "Agents", "Pricing", "Security", "FAQ"],
    signIn: "Sign in",
    cta: "Start free trial",
    badge: "Enterprise AI workforce platform",
    title: "AI Business Operating System",
    subtitle:
      "Give your company an AI team for SEO, CRM, content, sales, social media, accounting, websites, analytics, and business automation.",
    primary: "Create workspace",
    secondary: "View live demo",
    previewTitle: "Live company command center",
    previewSubtitle: "Planner Agent is coordinating SEO, CRM, Social, and Sales agents.",
  },
  fa: {
    nav: ["کاربردها", "Agent ها", "قیمت", "امنیت", "سوالات"],
    signIn: "ورود",
    cta: "شروع رایگان",
    badge: "پلتفرم Enterprise تیم هوش مصنوعی",
    title: "سیستم عامل هوش مصنوعی کسب و کار",
    subtitle:
      "برای شرکت خود یک تیم AI بسازید که SEO، CRM، محتوا، فروش، شبکه های اجتماعی، حسابداری، سایت، تحلیل و اتوماسیون را مدیریت کند.",
    primary: "ساخت Workspace",
    secondary: "نمایش دمو",
    previewTitle: "مرکز فرمان زنده شرکت",
    previewSubtitle: "Planner Agent در حال هماهنگی SEO، CRM، Social و Sales است.",
  },
  tr: {
    nav: ["Kullanim", "Agentler", "Fiyat", "Guvenlik", "SSS"],
    signIn: "Giris",
    cta: "Ucretsiz basla",
    badge: "Kurumsal AI is gucu platformu",
    title: "AI Business Operating System",
    subtitle:
      "Sirketinize SEO, CRM, icerik, satis, sosyal medya, muhasebe, web sitesi, analitik ve otomasyon icin bir AI ekibi verin.",
    primary: "Workspace olustur",
    secondary: "Canli demo",
    previewTitle: "Canli sirket komuta merkezi",
    previewSubtitle: "Planner Agent SEO, CRM, Social ve Sales agentlerini koordine ediyor.",
  },
};
