import type { Locale } from "@/types/locale";
import type { NavLink, SocialLink } from "@/types/navigation";
import { SITE_CONFIG, getWhatsAppUrl } from "@/lib/constants";
import { siteMeta } from "@/data/siteMeta";

const navLabels: Record<Locale, Record<string, string>> = {
  "pt-BR": {
    hero: "Início",
    experiencia: "Experiência",
    projetos: "Projetos",
    posts: "Posts",
    certificacoes: "Certificações",
    formacao: "Formação",
    contato: "Contato",
  },
  en: {
    hero: "Home",
    experiencia: "Experience",
    projetos: "Projects",
    posts: "Posts",
    certificacoes: "Certifications",
    formacao: "Education",
    contato: "Contact",
  },
  es: {
    hero: "Inicio",
    experiencia: "Experiencia",
    projetos: "Proyectos",
    posts: "Posts",
    certificacoes: "Certificaciones",
    formacao: "Formación",
    contato: "Contacto",
  },
};

const navIds = [
  "hero",
  "experiencia",
  "projetos",
  "posts",
  "certificacoes",
  "formacao",
  "contato",
] as const;

export function getNavLinks(locale: Locale): NavLink[] {
  const labels = navLabels[locale];

  return navIds.map((id) => ({
    id,
    label: labels[id],
    href: `#${id === "hero" ? "hero" : id}`,
  }));
}

export function getSocialLinks(locale: Locale): SocialLink[] {
  const whatsapp = getWhatsAppUrl(siteMeta[locale].whatsappMessage);

  return [
    { id: "linkedin", label: "LinkedIn", href: SITE_CONFIG.linkedin },
    { id: "github", label: "GitHub", href: SITE_CONFIG.github },
    { id: "email", label: "E-mail", href: `mailto:${SITE_CONFIG.email}` },
    { id: "whatsapp", label: "WhatsApp", href: whatsapp },
  ];
}


