import type { Locale } from "@/types/locale";
import type { Profile } from "@/types/profile";

const base = {
  fullName: "João Gabriel Almeida Flores",
  photo: "/images/profile-hero.jpeg",
  cvUrl: "/cv/Gabriel_Flores_ptBR.pdf",
} as const;

export const profiles: Record<Locale, Profile> = {
  "pt-BR": {
    ...base,
    role: "Desenvolvedor de Software • Arquiteto Cloud • SysAdmin • DevOps",
    tagline:
      "Construindo plataformas escaláveis, seguras e resilientes com foco em arquitetura cloud-native, infraestrutura e entrega contínua de valor.",
    highlights: [
      "💻 Desenvolvedor de Software",
      "☁️ Arquiteto Cloud (AWS & Azure)",
      "🖥️ SysAdmin",
      "⚙️ DevOps & CI/CD",
      "🤖 Integrações com IA",
      "🔒 Cybersecurity",
    ],
  },
  en: {
    ...base,
    role: "Software Developer • Cloud Architect • SysAdmin • DevOps Engineer",
    tagline:
      "Building scalable, secure, and resilient platforms with a focus on cloud-native architecture, infrastructure, and continuous delivery of value.",
    highlights: [
      "💻 Software Developer",
      "☁️ Cloud Architect (AWS & Azure)",
      "🖥️ SysAdmin",
      "⚙️ DevOps & CI/CD",
      "🤖 AI Integrations",
      "🔒 Cybersecurity",
    ],
  },
  es: {
    ...base,
    role: "Desarrollador de Software • Arquitecto Cloud • SysAdmin • DevOps",
    tagline:
      "Construyendo plataformas escalables, seguras y resilientes con foco en arquitectura cloud-native, infraestructura y entrega continua de valor.",
    highlights: [
      "💻 Desarrollador de Software",
      "☁️ Arquitecto Cloud (AWS & Azure)",
      "🖥️ SysAdmin",
      "⚙️ DevOps & CI/CD",
      "🤖 Integraciones con IA",
      "🔒 Cybersecurity",
    ],
  },
};
