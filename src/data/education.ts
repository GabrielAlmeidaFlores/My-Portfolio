import type { Locale } from "@/types/locale";
import type { Education } from "@/types/education";

const educationLogos = {
  "pucpr-postgrad": "/images/organizations/pucpr.png",
  "uniso-graduation": "/images/organizations/uniso.png",
} as const;

type EducationId = keyof typeof educationLogos;

function withLogo(
  item: Omit<Education, "logo"> & { id: EducationId },
): Education {
  return {
    ...item,
    logo: educationLogos[item.id],
  };
}

export const educationByLocale: Record<Locale, Education[]> = {
  "pt-BR": [
    withLogo({
      id: "pucpr-postgrad",
      title: "Arquitetura de Software, Cybersecurity e Ciência de Dados",
      institution: "PUCPR",
      period: "2025 a 2026",
      description: "Pós-graduação",
      focusAreas: [
        "Arquitetura de Software",
        "Cybersecurity",
        "Ciência de Dados",
      ],
    }),
    withLogo({
      id: "uniso-graduation",
      title: "Análise e Desenvolvimento de Sistemas",
      institution: "Universidade de Sorocaba",
      period: "2022 a 2025",
      description: "Graduação",
      focusAreas: [
        "Desenvolvimento de Software",
        "Engenharia de Sistemas",
        "Banco de Dados",
        "APIs e Integrações",
      ],
    }),
  ],
  en: [
    withLogo({
      id: "pucpr-postgrad",
      title: "Software Architecture, Cybersecurity, and Data Science",
      institution: "PUCPR",
      period: "2025 to 2026",
      description: "Postgraduate",
      focusAreas: [
        "Software Architecture",
        "Cybersecurity",
        "Data Science",
      ],
    }),
    withLogo({
      id: "uniso-graduation",
      title: "Systems Analysis and Development",
      institution: "Universidade de Sorocaba",
      period: "2022 to 2025",
      description: "Bachelor's degree",
      focusAreas: [
        "Software Development",
        "Systems Engineering",
        "Databases",
        "APIs and Integrations",
      ],
    }),
  ],
  es: [
    withLogo({
      id: "pucpr-postgrad",
      title: "Arquitectura de Software, Cybersecurity y Ciencia de Datos",
      institution: "PUCPR",
      period: "2025 a 2026",
      description: "Posgrado",
      focusAreas: [
        "Arquitectura de Software",
        "Cybersecurity",
        "Ciencia de Datos",
      ],
    }),
    withLogo({
      id: "uniso-graduation",
      title: "Análisis y Desarrollo de Sistemas",
      institution: "Universidade de Sorocaba",
      period: "2022 a 2025",
      description: "Grado",
      focusAreas: [
        "Desarrollo de Software",
        "Ingeniería de Sistemas",
        "Bases de Datos",
        "APIs e Integraciones",
      ],
    }),
  ],
};
