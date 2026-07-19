import type { Locale } from "@/types/locale";
import type { TechFilter } from "@/types/technology";

export type TechCategory = Exclude<TechFilter, "all">;

export interface TechCategoryMeta {
  label: string;
  emoji: string;
  color: string;
}

const categoryColors: Record<TechCategory, string> = {
  cloud: "#3D8FDB",
  backend: "#22D3EE",
  frontend: "#14B8A6",
  devops: "#8B5CF6",
  database: "#F59E0B",
  tools: "#3D8FDB",
};

const categoryEmojis: Record<TechCategory, string> = {
  cloud: "☁️",
  backend: "⚙️",
  frontend: "🎨",
  devops: "🚀",
  database: "🗄️",
  tools: "🔧",
};

const categoryLabels: Record<Locale, Record<TechCategory, string>> = {
  "pt-BR": {
    cloud: "Cloud",
    backend: "Backend",
    frontend: "Frontend",
    devops: "DevOps",
    database: "Banco de Dados",
    tools: "Ferramentas",
  },
  en: {
    cloud: "Cloud",
    backend: "Backend",
    frontend: "Frontend",
    devops: "DevOps",
    database: "Databases",
    tools: "Tools",
  },
  es: {
    cloud: "Cloud",
    backend: "Backend",
    frontend: "Frontend",
    devops: "DevOps",
    database: "Bases de Datos",
    tools: "Herramientas",
  },
};

/** Default (pt-BR) meta for non-localized consumers */
export const techCategoryMeta: Record<TechCategory, TechCategoryMeta> = {
  cloud: { label: "Cloud", emoji: "☁️", color: categoryColors.cloud },
  backend: { label: "Backend", emoji: "⚙️", color: categoryColors.backend },
  frontend: { label: "Frontend", emoji: "🎨", color: categoryColors.frontend },
  devops: { label: "DevOps", emoji: "🚀", color: categoryColors.devops },
  database: {
    label: "Banco de Dados",
    emoji: "🗄️",
    color: categoryColors.database,
  },
  tools: { label: "Ferramentas", emoji: "🔧", color: categoryColors.tools },
};

export const techCategoryColors = {
  security: "#EF4444",
  ai: "#EC4899",
} as const;

export function getTechCategoryColor(category: TechCategory): string {
  return categoryColors[category];
}

export function getTechCategoryLabel(
  category: TechCategory,
  locale: Locale = "pt-BR",
): string {
  return categoryLabels[locale][category];
}

export function getTechCategoryMeta(
  category: TechCategory,
  locale: Locale = "pt-BR",
): TechCategoryMeta {
  return {
    label: categoryLabels[locale][category],
    emoji: categoryEmojis[category],
    color: categoryColors[category],
  };
}
