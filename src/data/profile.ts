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
    role: "Líder Técnico • Arquiteto de Software • Cloud & DevOps Engineer",
    tagline:
      "Construindo plataformas escaláveis, seguras e resilientes com foco em arquitetura cloud-native, liderança técnica e entrega contínua de valor.",
    highlights: [
      "🚀 Líder Técnico",
      "☁️ Especialista AWS & Azure",
      "🏗️ Arquitetura Cloud-Native",
      "⚙️ DevOps & CI/CD",
      "🤖 Integrações com IA",
      "🔒 Cybersecurity",
    ],
  },
  en: {
    ...base,
    role: "Tech Lead • Software Architect • Cloud & DevOps Engineer",
    tagline:
      "Building scalable, secure, and resilient platforms with a focus on cloud-native architecture, technical leadership, and continuous delivery of value.",
    highlights: [
      "🚀 Tech Lead",
      "☁️ AWS & Azure Specialist",
      "🏗️ Cloud-Native Architecture",
      "⚙️ DevOps & CI/CD",
      "🤖 AI Integrations",
      "🔒 Cybersecurity",
    ],
  },
  es: {
    ...base,
    role: "Líder Técnico • Arquitecto de Software • Cloud & DevOps Engineer",
    tagline:
      "Construyendo plataformas escalables, seguras y resilientes con foco en arquitectura cloud-native, liderazgo técnico y entrega continua de valor.",
    highlights: [
      "🚀 Líder Técnico",
      "☁️ Especialista AWS & Azure",
      "🏗️ Arquitectura Cloud-Native",
      "⚙️ DevOps & CI/CD",
      "🤖 Integraciones con IA",
      "🔒 Cybersecurity",
    ],
  },
};
