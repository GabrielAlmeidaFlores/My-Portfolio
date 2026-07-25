import type { Locale } from "@/types/locale";
import type {
  LocalizedPublication,
  Publication,
} from "@/types/publication";
import {
  ArquiteturaCloudContentEn,
  ArquiteturaCloudContentEs,
  ArquiteturaCloudContentPt,
} from "@/content/publications/arquitetura-cloud";

export const publications: Publication[] = [
  {
    id: "arquitetura-cloud",
    slug: "arquitetura-cloud",
    publishedAt: "2026-07-20",
    tags: {
      "pt-BR": ["Cloud", "Arquitetura", "AWS"],
      en: ["Cloud", "Architecture", "AWS"],
      es: ["Cloud", "Arquitectura", "AWS"],
    },
    coverImage: "/images/publications/arquitetura-cloud/cover.svg",
    title: {
      "pt-BR": "Arquitetura cloud na prática",
      en: "Cloud architecture in practice",
      es: "Arquitectura cloud en la práctica",
    },
    summary: {
      "pt-BR":
        "Um guia objetivo para desenhar sistemas cloud-native com foco em domínio, custos e observabilidade.",
      en: "A practical guide to designing cloud-native systems with focus on domain, cost, and observability.",
      es: "Una guía práctica para diseñar sistemas cloud-native con foco en dominio, costos y observabilidad.",
    },
    Content: {
      "pt-BR": ArquiteturaCloudContentPt,
      en: ArquiteturaCloudContentEn,
      es: ArquiteturaCloudContentEs,
    },
  },
];

export function getPublications(locale: Locale): LocalizedPublication[] {
  return publications.map((publication) => localizePublication(publication, locale));
}

export function getPublicationBySlug(
  slug: string,
  locale: Locale,
): LocalizedPublication | undefined {
  const publication = publications.find((item) => item.slug === slug);

  if (!publication) {
    return undefined;
  }

  return localizePublication(publication, locale);
}

function localizePublication(
  publication: Publication,
  locale: Locale,
): LocalizedPublication {
  return {
    id: publication.id,
    slug: publication.slug,
    publishedAt: publication.publishedAt,
    tags: publication.tags[locale],
    coverImage: publication.coverImage,
    title: publication.title[locale],
    summary: publication.summary[locale],
    Content: publication.Content[locale],
  };
}
