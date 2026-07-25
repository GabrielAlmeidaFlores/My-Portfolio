import type { Locale } from "@/types/locale";
import type {
  LocalizedPublication,
  Publication,
} from "@/types/publication";
import {
  BuscaWebLocalMcpSearxngContentEn,
  BuscaWebLocalMcpSearxngContentEs,
  BuscaWebLocalMcpSearxngContentPt,
} from "@/content/publications/busca-web-local-mcp-searxng";

export const publications: Publication[] = [
  {
    id: "busca-web-local-mcp-searxng",
    slug: "busca-web-local-mcp-searxng",
    publishedAt: "2026-07-25",
    tags: {
      "pt-BR": ["MCP", "SearXNG", "Docker", "Copilot"],
      en: ["MCP", "SearXNG", "Docker", "Copilot"],
      es: ["MCP", "SearXNG", "Docker", "Copilot"],
    },
    coverImage: "/images/publications/busca-web-local-mcp-searxng/cover.svg",
    title: {
      "pt-BR": "Busca web local para IA com MCP e SearXNG",
      en: "Local web search for AI with MCP and SearXNG",
      es: "Búsqueda web local para IA con MCP y SearXNG",
    },
    summary: {
      "pt-BR":
        "Como montar busca web estável no agente de IA com MCP e SearXNG em Docker, sem API paga e com controle na borda.",
      en: "How to run stable web search in an AI agent with MCP and SearXNG on Docker, with no paid API and edge control.",
      es: "Cómo montar búsqueda web estable en el agente de IA con MCP y SearXNG en Docker, sin API de pago y con control en el borde.",
    },
    Content: {
      "pt-BR": BuscaWebLocalMcpSearxngContentPt,
      en: BuscaWebLocalMcpSearxngContentEn,
      es: BuscaWebLocalMcpSearxngContentEs,
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
