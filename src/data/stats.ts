import type { Locale } from "@/types/locale";
import type { Stat } from "@/types/stat";

export const statsByLocale: Record<Locale, Stat[]> = {
  "pt-BR": [
    { value: 2, suffix: "+", label: "Anos de experiência" },
    { value: 3, suffix: "+", label: "Projetos em destaque" },
    { value: 5, suffix: "", label: "Certificações" },
    { value: 3, suffix: "", label: "Empresas" },
    { value: 20, suffix: "+", label: "Tecnologias" },
    { value: 99, suffix: "%", label: "Compromisso com qualidade" },
  ],
  en: [
    { value: 2, suffix: "+", label: "Years of experience" },
    { value: 3, suffix: "+", label: "Featured projects" },
    { value: 5, suffix: "", label: "Certifications" },
    { value: 3, suffix: "", label: "Companies" },
    { value: 20, suffix: "+", label: "Technologies" },
    { value: 99, suffix: "%", label: "Commitment to quality" },
  ],
  es: [
    { value: 2, suffix: "+", label: "Años de experiencia" },
    { value: 3, suffix: "+", label: "Proyectos destacados" },
    { value: 5, suffix: "", label: "Certificaciones" },
    { value: 3, suffix: "", label: "Empresas" },
    { value: 20, suffix: "+", label: "Tecnologías" },
    { value: 99, suffix: "%", label: "Compromiso con la calidad" },
  ],
};

/** @deprecated Prefer statsByLocale[locale] */
export const stats = statsByLocale["pt-BR"];
