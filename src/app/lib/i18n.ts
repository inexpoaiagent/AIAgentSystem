export type Locale = "en" | "fa" | "tr";

export const locales: Record<Locale, { label: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", dir: "ltr" },
  fa: { label: "فارسی", dir: "rtl" },
  tr: { label: "Türkçe", dir: "ltr" },
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
    nav: ["کاربردها", "ایجنت‌ها", "قیمت", "امنیت", "سوالات"],
    signIn: "ورود",
    cta: "شروع رایگان",
    badge: "پلتفرم سازمانی تیم هوش مصنوعی",
    title: "سیستم عامل هوش مصنوعی کسب‌وکار",
    subtitle:
      "برای شرکت خود یک تیم AI بسازید که SEO، CRM، محتوا، فروش، شبکه‌های اجتماعی، حسابداری، سایت، تحلیل و اتوماسیون را مدیریت کند.",
    primary: "ساخت Workspace",
    secondary: "نمایش دمو",
    previewTitle: "مرکز فرمان زنده شرکت",
    previewSubtitle: "Planner Agent در حال هماهنگی ایجنت‌های SEO، CRM، Social و Sales است.",
  },
  tr: {
    nav: ["Kullanım", "Agentler", "Fiyat", "Güvenlik", "SSS"],
    signIn: "Giriş",
    cta: "Ücretsiz başla",
    badge: "Kurumsal AI iş gücü platformu",
    title: "AI Business Operating System",
    subtitle:
      "Şirketinize SEO, CRM, içerik, satış, sosyal medya, muhasebe, web sitesi, analitik ve otomasyon için bir AI ekibi verin.",
    primary: "Workspace oluştur",
    secondary: "Canlı demo",
    previewTitle: "Canlı şirket komuta merkezi",
    previewSubtitle: "Planner Agent SEO, CRM, Social ve Sales agentlerini koordine ediyor.",
  },
};

type DoctorCopy = {
  title: string;
  subtitle: string;
  analyze: string;
  analyzing: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  industry: string;
  diagnosis: string;
};

export const doctorCopy: Record<Locale, DoctorCopy> = {
  en: {
    title: "AI Business Doctor",
    subtitle: "Connect your website and social channels. The AI team diagnoses SEO, design, content, leads, CRM, and revenue opportunities.",
    analyze: "Analyze company",
    analyzing: "Analyzing business channels...",
    website: "Website",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    industry: "Industry",
    diagnosis: "Business diagnosis",
  },
  fa: {
    title: "دکتر هوش مصنوعی کسب‌وکار",
    subtitle: "وبسایت و شبکه‌های اجتماعی را وارد کنید. تیم AI وضعیت سئو، طراحی، محتوا، لیدها، CRM و فرصت‌های فروش را تشخیص می‌دهد.",
    analyze: "آنالیز کن",
    analyzing: "در حال تحلیل کانال‌های بیزنس...",
    website: "وبسایت",
    instagram: "اینستاگرام",
    facebook: "فیسبوک",
    youtube: "یوتیوب",
    industry: "صنعت",
    diagnosis: "تشخیص وضعیت بیزنس",
  },
  tr: {
    title: "AI Business Doctor",
    subtitle: "Web sitenizi ve sosyal kanallarınızı bağlayın. AI ekibi SEO, tasarım, içerik, lead, CRM ve gelir fırsatlarını teşhis eder.",
    analyze: "Şirketi analiz et",
    analyzing: "İş kanalları analiz ediliyor...",
    website: "Web sitesi",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    industry: "Sektör",
    diagnosis: "İş teşhisi",
  },
};
