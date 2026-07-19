import type { Locale } from "@/types/locale";

export const heroCode = `const engineer = {
  name: "João Gabriel Almeida Flores",
  role: "Tech Lead",
  specialties: [
    "AWS",
    "Software Architecture",
    "DevOps"
  ]
};`;

export const aboutValuesByLocale: Record<Locale, readonly string[]> = {
  "pt-BR": [
    "Escalabilidade",
    "Segurança",
    "Observabilidade",
    "Alta disponibilidade",
    "Entrega contínua",
    "Liderança técnica",
  ],
  en: [
    "Scalability",
    "Security",
    "Observability",
    "High availability",
    "Continuous delivery",
    "Technical leadership",
  ],
  es: [
    "Escalabilidad",
    "Seguridad",
    "Observabilidad",
    "Alta disponibilidad",
    "Entrega continua",
    "Liderazgo técnico",
  ],
};

/** @deprecated Prefer aboutValuesByLocale[locale] */
export const aboutValues = aboutValuesByLocale["pt-BR"];
