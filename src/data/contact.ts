import type { Locale } from "@/types/locale";

export const contactOpportunitiesByLocale: Record<Locale, readonly string[]> = {
  "pt-BR": [
    "Líder Técnico",
    "Arquiteto de Software",
    "Engenheiro Backend",
    "Engenheiro Cloud",
    "Engenheiro DevOps",
    "Consultoria em Arquitetura",
  ],
  en: [
    "Tech Lead",
    "Software Architect",
    "Backend Engineer",
    "Cloud Engineer",
    "DevOps Engineer",
    "Architecture Consulting",
  ],
  es: [
    "Líder Técnico",
    "Arquitecto de Software",
    "Ingeniero Backend",
    "Ingeniero Cloud",
    "Ingeniero DevOps",
    "Consultoría en Arquitectura",
  ],
};

/** @deprecated Prefer contactOpportunitiesByLocale[locale] */
export const contactOpportunities = contactOpportunitiesByLocale["pt-BR"];
