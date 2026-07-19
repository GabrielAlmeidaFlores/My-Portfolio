import type { Locale } from "@/types/locale";
import type { Profile } from "@/types/profile";

const base = {
  fullName: "João Gabriel Almeida Flores",
  photo: "/images/profile-hero.png",
  aboutPhoto: "/images/profile-about.png",
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
    aboutTitle: "Transformando desafios complexos em soluções escaláveis",
    aboutParagraphs: [
      "Sou Líder Técnico e Arquiteto de Software com experiência na construção de aplicações distribuídas, infraestrutura em nuvem e liderança de equipes de desenvolvimento.",
      "Minha atuação envolve desde a definição da arquitetura até a entrega em produção, garantindo escalabilidade, segurança, observabilidade e alta disponibilidade. Ao longo da carreira, participei de projetos para empresas de tecnologia e fintechs, conduzindo squads ágeis e implementando soluções modernas utilizando AWS, Azure, Docker, Linux, Node.js, .NET e React.",
      "Meu objetivo é desenvolver plataformas robustas que gerem impacto real para o negócio, sempre utilizando boas práticas de engenharia de software e arquitetura.",
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
    aboutTitle: "Turning complex challenges into scalable solutions",
    aboutParagraphs: [
      "I am a Tech Lead and Software Architect with experience building distributed applications, cloud infrastructure, and leading development teams.",
      "My work spans from architecture definition to production delivery, ensuring scalability, security, observability, and high availability. Throughout my career, I have worked on projects for technology companies and fintechs, leading agile squads and implementing modern solutions with AWS, Azure, Docker, Linux, Node.js, .NET, and React.",
      "My goal is to build robust platforms that create real business impact, always applying software engineering and architecture best practices.",
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
    aboutTitle: "Transformando desafíos complejos en soluciones escalables",
    aboutParagraphs: [
      "Soy Líder Técnico y Arquitecto de Software con experiencia en la construcción de aplicaciones distribuidas, infraestructura en la nube y liderazgo de equipos de desarrollo.",
      "Mi trabajo abarca desde la definición de la arquitectura hasta la entrega en producción, garantizando escalabilidad, seguridad, observabilidad y alta disponibilidad. A lo largo de mi carrera, he participado en proyectos para empresas de tecnología y fintechs, liderando squads ágiles e implementando soluciones modernas con AWS, Azure, Docker, Linux, Node.js, .NET y React.",
      "Mi objetivo es desarrollar plataformas robustas que generen impacto real para el negocio, siempre aplicando buenas prácticas de ingeniería de software y arquitectura.",
    ],
  },
};

/** @deprecated Prefer profiles[locale] */
export const profile = profiles["pt-BR"];
