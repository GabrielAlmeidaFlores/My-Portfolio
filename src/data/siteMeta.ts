import type { Locale } from "@/types/locale";

export interface SiteMeta {
  title: string;
  description: string;
  footerDescription: [string, string];
  twitterDescription: string;
  ogLocale: string;
  whatsappMessage: string;
}

export const siteMeta: Record<Locale, SiteMeta> = {
  "pt-BR": {
    title: "João Gabriel Almeida Flores — Portfólio",
    description:
      "Líder Técnico, Arquiteto de Software e Engenheiro Cloud & DevOps. Especialista em plataformas escaláveis, seguras e cloud-native.",
    footerDescription: [
      "Líder Técnico, Arquiteto de Software e Engenheiro Cloud & DevOps.",
      "Especialista em plataformas escaláveis, seguras e cloud-native.",
    ],
    twitterDescription:
      "Líder Técnico, Arquiteto de Software e Engenheiro Cloud & DevOps.",
    ogLocale: "pt_BR",
    whatsappMessage:
      "Olá, gostaria de saber mais sobre seu trabalho!",
  },
  en: {
    title: "João Gabriel Almeida Flores — Portfolio",
    description:
      "Tech Lead, Software Architect, and Cloud & DevOps Engineer. Specialist in scalable, secure, cloud-native platforms.",
    footerDescription: [
      "Tech Lead, Software Architect, and Cloud & DevOps Engineer.",
      "Specialist in scalable, secure, cloud-native platforms.",
    ],
    twitterDescription:
      "Tech Lead, Software Architect, and Cloud & DevOps Engineer.",
    ogLocale: "en_US",
    whatsappMessage: "Hi, I'd like to learn more about your work!",
  },
  es: {
    title: "João Gabriel Almeida Flores — Portafolio",
    description:
      "Líder Técnico, Arquitecto de Software e Ingeniero Cloud & DevOps. Especialista en plataformas escalables, seguras y cloud-native.",
    footerDescription: [
      "Líder Técnico, Arquitecto de Software e Ingeniero Cloud & DevOps.",
      "Especialista en plataformas escalables, seguras y cloud-native.",
    ],
    twitterDescription:
      "Líder Técnico, Arquitecto de Software e Ingeniero Cloud & DevOps.",
    ogLocale: "es_ES",
    whatsappMessage: "¡Hola! Me gustaría saber más sobre tu trabajo.",
  },
};
