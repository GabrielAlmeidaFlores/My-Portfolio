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
    title: "João Gabriel Almeida Flores | Portfólio",
    description:
      "Desenvolvedor de Software, Arquiteto Cloud, SysAdmin e Engenheiro DevOps. Especialista em plataformas escaláveis, seguras e cloud-native.",
    footerDescription: [
      "Desenvolvedor de Software, Arquiteto Cloud, SysAdmin e Engenheiro DevOps.",
      "Especialista em plataformas escaláveis, seguras e cloud-native.",
    ],
    twitterDescription:
      "Desenvolvedor de Software, Arquiteto Cloud, SysAdmin e Engenheiro DevOps.",
    ogLocale: "pt_BR",
    whatsappMessage:
      "Olá, gostaria de saber mais sobre seu trabalho!",
  },
  en: {
    title: "João Gabriel Almeida Flores | Portfolio",
    description:
      "Software Developer, Cloud Architect, SysAdmin, and DevOps Engineer. Specialist in scalable, secure, cloud-native platforms.",
    footerDescription: [
      "Software Developer, Cloud Architect, SysAdmin, and DevOps Engineer.",
      "Specialist in scalable, secure, cloud-native platforms.",
    ],
    twitterDescription:
      "Software Developer, Cloud Architect, SysAdmin, and DevOps Engineer.",
    ogLocale: "en_US",
    whatsappMessage: "Hi, I'd like to learn more about your work!",
  },
  es: {
    title: "João Gabriel Almeida Flores | Portafolio",
    description:
      "Desarrollador de Software, Arquitecto Cloud, SysAdmin e Ingeniero DevOps. Especialista en plataformas escalables, seguras y cloud-native.",
    footerDescription: [
      "Desarrollador de Software, Arquitecto Cloud, SysAdmin e Ingeniero DevOps.",
      "Especialista en plataformas escalables, seguras y cloud-native.",
    ],
    twitterDescription:
      "Desarrollador de Software, Arquitecto Cloud, SysAdmin e Ingeniero DevOps.",
    ogLocale: "es_ES",
    whatsappMessage: "¡Hola! Me gustaría saber más sobre tu trabajo.",
  },
};
