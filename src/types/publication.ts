import type { ComponentType } from "react";
import type { Locale } from "@/types/locale";

export interface PublicationLocalizedText {
  "pt-BR": string;
  en: string;
  es: string;
}

export interface Publication {
  id: string;
  slug: string;
  publishedAt: string;
  tags: Record<Locale, string[]>;
  coverImage: string;
  title: PublicationLocalizedText;
  summary: PublicationLocalizedText;
  Content: Record<Locale, ComponentType>;
}

export interface LocalizedPublication {
  id: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  coverImage: string;
  title: string;
  summary: string;
  Content: ComponentType;
}
