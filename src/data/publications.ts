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
  FullTextSearchMysqlPostgresqlContentEn,
  FullTextSearchMysqlPostgresqlContentEs,
  FullTextSearchMysqlPostgresqlContentPt,
} from "@/content/publications/full-text-search-mysql-postgresql";
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
import {
  SolidNaPraticaContentEn,
  SolidNaPraticaContentEs,
  SolidNaPraticaContentPt,
} from "@/content/publications/solid-na-pratica";
import {
  DapperEntityFrameworkOrmsDotnetContentEn,
  DapperEntityFrameworkOrmsDotnetContentEs,
  DapperEntityFrameworkOrmsDotnetContentPt,
} from "@/content/publications/dapper-entity-framework-orms-dotnet";
import {
  GraphifyMapaCodebaseContentEn,
  GraphifyMapaCodebaseContentEs,
  GraphifyMapaCodebaseContentPt,
} from "@/content/publications/graphify-mapa-codebase";

export const publications: Publication[] = [
  {
    id: "graphify-mapa-codebase",
    slug: "graphify-mapa-codebase",
    publishedAt: "2026-11-10",
    tags: {
      "pt-BR": [
        "Graphify",
        "Knowledge Graph",
        "Code Search",
        "Agentes de IA",
        "MCP",
        "Tree-sitter",
      ],
      en: [
        "Graphify",
        "Knowledge Graph",
        "Code Search",
        "AI Agents",
        "MCP",
        "Tree-sitter",
      ],
      es: [
        "Graphify",
        "Grafo de Conocimiento",
        "Búsqueda de Código",
        "Agentes de IA",
        "MCP",
        "Tree-sitter",
      ],
    },
    coverImage: "/images/publications/graphify-mapa-codebase/cover.svg",
    title: {
      "pt-BR": "Graphify: mapa do codebase para humanos e agentes",
      en: "Graphify: a codebase map for humans and agents",
      es: "Graphify: un mapa del codebase para humanos y agentes",
    },
    summary: {
      "pt-BR":
        "O que é o Graphify, como instalar e consultar o grafo, quando ele ajuda de verdade e o que os benchmarks do projeto mostram sobre busca em código.",
      en: "What Graphify is, how to install and query the graph, when it actually helps, and what the project benchmarks show about code search.",
      es: "Qué es Graphify, cómo instalar y consultar el grafo, cuándo ayuda de verdad y qué muestran los benchmarks del proyecto sobre búsqueda en código.",
    },
    Content: {
      "pt-BR": GraphifyMapaCodebaseContentPt,
      en: GraphifyMapaCodebaseContentEn,
      es: GraphifyMapaCodebaseContentEs,
    },
  },
  {
    id: "dapper-entity-framework-orms-dotnet",
    slug: "dapper-entity-framework-orms-dotnet",
    publishedAt: "2026-11-10",
    tags: {
      "pt-BR": ["C#", ".NET", "Dapper", "Entity Framework", "ORM", "Banco de Dados"],
      en: ["C#", ".NET", "Dapper", "Entity Framework", "ORM", "Databases"],
      es: ["C#", ".NET", "Dapper", "Entity Framework", "ORM", "Bases de Datos"],
    },
    coverImage:
      "/images/publications/dapper-entity-framework-orms-dotnet/cover.svg",
    title: {
      "pt-BR": "Dapper, Entity Framework e outros ORMs: quando usar cada um no .NET",
      en: "Dapper, Entity Framework, and other ORMs: when to use each in .NET",
      es: "Dapper, Entity Framework y otros ORMs: cuándo usar cada uno en .NET",
    },
    summary: {
      "pt-BR":
        "Micro-ORM vs ORM completo com código C#, tradeoffs de produtividade e controle, e um mapa dos principais ORMs do ecossistema .NET.",
      en: "Micro-ORM vs full ORM with C# code, productivity and control tradeoffs, and a map of the main ORMs in the .NET ecosystem.",
      es: "Micro-ORM vs ORM completo con código C#, tradeoffs de productividad y control, y un mapa de los principales ORMs del ecosistema .NET.",
    },
    Content: {
      "pt-BR": DapperEntityFrameworkOrmsDotnetContentPt,
      en: DapperEntityFrameworkOrmsDotnetContentEn,
      es: DapperEntityFrameworkOrmsDotnetContentEs,
    },
  },
  {
    id: "solid-na-pratica",
    slug: "solid-na-pratica",
    publishedAt: "2026-11-10",
    tags: {
      "pt-BR": [
        "SOLID",
        "Arquitetura",
        "TypeScript",
        "Clean Code",
        "Orientação a Objetos",
      ],
      en: [
        "SOLID",
        "Architecture",
        "TypeScript",
        "Clean Code",
        "Object Orientation",
      ],
      es: [
        "SOLID",
        "Arquitectura",
        "TypeScript",
        "Clean Code",
        "Orientación a Objetos",
      ],
    },
    coverImage: "/images/publications/solid-na-pratica/cover.svg",
    title: {
      "pt-BR": "SOLID na prática: cinco princípios com exemplos reais",
      en: "SOLID in practice: five principles with real examples",
      es: "SOLID en la práctica: cinco principios con ejemplos reales",
    },
    summary: {
      "pt-BR":
        "Os cinco princípios com código antes e depois, tradeoffs e o momento em que aplicar SOLID passa a atrapalhar.",
      en: "The five principles with before and after code, tradeoffs, and the moment when applying SOLID starts to get in the way.",
      es: "Los cinco principios con código antes y después, tradeoffs y el momento en que aplicar SOLID empieza a estorbar.",
    },
    Content: {
      "pt-BR": SolidNaPraticaContentPt,
      en: SolidNaPraticaContentEn,
      es: SolidNaPraticaContentEs,
    },
  },
  {
    id: "full-text-search-mysql-postgresql",
    slug: "full-text-search-mysql-postgresql",
    publishedAt: "2026-07-30",
    tags: {
      "pt-BR": [
        "Banco de Dados",
        "Full Text Search",
        "MySQL",
        "PostgreSQL",
        "System Design",
      ],
      en: ["Databases", "Full Text Search", "MySQL", "PostgreSQL", "System Design"],
      es: [
        "Bases de Datos",
        "Full Text Search",
        "MySQL",
        "PostgreSQL",
        "System Design",
      ],
    },
    coverImage:
      "/images/publications/full-text-search-mysql-postgresql/cover.svg",
    title: {
      "pt-BR":
        "Buscas inteligentes no banco: Full Text Search, ranking e arquitetura em MySQL e PostgreSQL",
      en: "Intelligent database search: Full Text Search, ranking, and architecture in MySQL and PostgreSQL",
      es: "Búsquedas inteligentes en base de datos: Full Text Search, ranking y arquitectura en MySQL y PostgreSQL",
    },
    summary: {
      "pt-BR":
        "Guia prático para sair do LIKE e evoluir busca textual com ranking, benchmark, tradeoffs operacionais e decisão arquitetural entre FTS nativo e engine dedicada.",
      en: "Practical guide to moving beyond LIKE and building production search with ranking, benchmarking, operational tradeoffs, and architectural decisions between native FTS and dedicated engines.",
      es: "Guía práctica para salir de LIKE y evolucionar la búsqueda textual con ranking, benchmark, tradeoffs operativos y decisión arquitectónica entre FTS nativo y motores dedicados.",
    },
    Content: {
      "pt-BR": FullTextSearchMysqlPostgresqlContentPt,
      en: FullTextSearchMysqlPostgresqlContentEn,
      es: FullTextSearchMysqlPostgresqlContentEs,
    },
  },
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
      "pt-BR": "Hardening Linux em VPS: controles, riscos e comandos",
      en: "Linux VPS hardening: controls, risks, and commands",
      es: "Hardening Linux en VPS: controles, riesgos y comandos",
    },
    summary: {
      "pt-BR":
        "Baseline objetivo do dia 1-2: o que é cada controle, para que serve, como é explorado se faltar, e como configurar (SSH, firewall, sysctl, MAC, updates, fail2ban, Lynis).",
      en: "Objective day 1-2 baseline: what each control is, what it is for, how it is exploited if missing, and how to configure it (SSH, firewall, sysctl, MAC, updates, fail2ban, Lynis).",
      es: "Baseline objetivo del día 1-2: qué es cada control, para qué sirve, cómo se explota si falta, y cómo configurarlo (SSH, firewall, sysctl, MAC, updates, fail2ban, Lynis).",
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
