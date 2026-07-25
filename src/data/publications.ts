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
import {
  EscolhaBancoDadosCapPacelcContentEn,
  EscolhaBancoDadosCapPacelcContentEs,
  EscolhaBancoDadosCapPacelcContentPt,
} from "@/content/publications/escolha-banco-dados-cap-pacelc";
import {
  HardeningLinuxVpsBaselineContentEn,
  HardeningLinuxVpsBaselineContentEs,
  HardeningLinuxVpsBaselineContentPt,
} from "@/content/publications/hardening-linux-vps-baseline";

export const publications: Publication[] = [
  {
    id: "hardening-linux-vps-baseline",
    slug: "hardening-linux-vps-baseline",
    publishedAt: "2026-07-25",
    tags: {
      "pt-BR": ["Linux", "Hardening", "SSH", "Segurança"],
      en: ["Linux", "Hardening", "SSH", "Security"],
      es: ["Linux", "Hardening", "SSH", "Seguridad"],
    },
    coverImage:
      "/images/publications/hardening-linux-vps-baseline/cover.svg",
    title: {
      "pt-BR": "Hardening baseline em Linux (VPS sem drama)",
      en: "Linux hardening baseline (VPS without the drama)",
      es: "Hardening baseline en Linux (VPS sin drama)",
    },
    summary: {
      "pt-BR":
        "Hardening completo para o dia 1-2 da VPS: SSH/sudo, firewall, sysctl, tempo, MAC, auditd, updates, fail2ban e verificação com Lynis, sem se trancar fora.",
      en: "Complete day 1-2 VPS hardening: SSH/sudo, firewall, sysctl, time, MAC, auditd, updates, fail2ban, and Lynis verification, without locking yourself out.",
      es: "Hardening completo para el día 1-2 del VPS: SSH/sudo, firewall, sysctl, tiempo, MAC, auditd, updates, fail2ban y verificación con Lynis, sin quedarte fuera.",
    },
    Content: {
      "pt-BR": HardeningLinuxVpsBaselineContentPt,
      en: HardeningLinuxVpsBaselineContentEn,
      es: HardeningLinuxVpsBaselineContentEs,
    },
  },
  {
    id: "escolha-banco-dados-cap-pacelc",
    slug: "escolha-banco-dados-cap-pacelc",
    publishedAt: "2026-07-25",
    tags: {
      "pt-BR": ["System Design", "CAP", "PACELC", "Cassandra"],
      en: ["System Design", "CAP", "PACELC", "Cassandra"],
      es: ["System Design", "CAP", "PACELC", "Cassandra"],
    },
    coverImage: "/images/publications/escolha-banco-dados-cap-pacelc/cover.svg",
    title: {
      "pt-BR": "Como escolher o banco de dados certo (CAP e PACELC)",
      en: "How to choose the right database (CAP and PACELC)",
      es: "Cómo elegir la base de datos correcta (CAP y PACELC)",
    },
    summary: {
      "pt-BR":
        "Por que SQL vs NoSQL é resposta rasa, e como CAP, PACELC e tradeoffs reais guiam a escolha do banco em sistemas distribuídos.",
      en: "Why SQL vs NoSQL is a shallow answer, and how CAP, PACELC, and real tradeoffs guide database choice in distributed systems.",
      es: "Por qué SQL vs NoSQL es una respuesta superficial, y cómo CAP, PACELC y tradeoffs reales guían la elección de base de datos en sistemas distribuidos.",
    },
    Content: {
      "pt-BR": EscolhaBancoDadosCapPacelcContentPt,
      en: EscolhaBancoDadosCapPacelcContentEn,
      es: EscolhaBancoDadosCapPacelcContentEs,
    },
  },
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
