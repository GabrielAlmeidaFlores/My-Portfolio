import type { Locale } from "@/types/locale";
import type { NavLink, SocialLink } from "@/types/navigation";
import { SITE_CONFIG, getWhatsAppUrl } from "@/lib/constants";
import { siteMeta } from "@/data/siteMeta";

const navLabels: Record<Locale, Record<string, string>> = {
  "pt-BR": {
    hero: "Início",
    experiencia: "Experiência",
    projetos: "Projetos",
    certificacoes: "Certificações",
    formacao: "Formação",
    publicacoes: "Publicações",
    contato: "Contato",
  },
  en: {
    hero: "Home",
    experiencia: "Experience",
    projetos: "Projects",
    certificacoes: "Certifications",
    formacao: "Education",
    publicacoes: "Publications",
    contato: "Contact",
  },
  es: {
    hero: "Inicio",
    experiencia: "Experiencia",
    projetos: "Proyectos",
    certificacoes: "Certificaciones",
    formacao: "Formación",
    publicacoes: "Publicaciones",
    contato: "Contacto",
  },
};

const navIds = [
  "hero",
  "experiencia",
  "projetos",
  "certificacoes",
  "formacao",
  "publicacoes",
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


