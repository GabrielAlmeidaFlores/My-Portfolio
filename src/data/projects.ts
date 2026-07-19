import type { Locale } from "@/types/locale";
import type { Project } from "@/types/project";

export const projectsByLocale: Record<Locale, Project[]> = {
  "pt-BR": [
    {
      id: "syntonia",
      title: "Syntonia",
      shortDescription:
        "Motor de aprendizado pessoal com IA: artigos aprofundados gerados sob demanda a partir do seu perfil, sem anúncios nem clickbait.",
      image: "/images/projects/syntonia.jpg",
      videoUrl: "/images/projects/syntonia.mp4",
      demoUrl: "https://main.d2po6kvmcq6ut4.amplifyapp.com/",
      technologies: [
        "AWS",
        "TypeScript",
        "React",
        "Node.js",
        "Gemini",
        "DynamoDB",
      ],
      results: [
        "Feed vertical focado, um artigo por vez",
        "Conteúdo personalizado sob demanda com Gemini",
        "Arquitetura serverless na AWS (sa-east-1)",
      ],
      challenge:
        "A internet tem conteúdo de sobra, mas encontrar material no nível certo, sobre exatamente o que se quer aprender, consome tempo demais — e costuma vir com anúncios, clickbait e conteúdo genérico.",
      solution:
        "O usuário descreve quem é e o que o interessa; o Syntonia gera artigos aprofundados sob demanda com Google Gemini, entregues em um feed fluido de scroll vertical, sem distrações.",
      architecture:
        "Backend serverless (Node.js 20, TypeScript, Serverless Framework v3) com AWS Lambda, API Gateway, DynamoDB, SQS e Cognito. IA com Gemini 2.5 Flash (primary) e Gemini 2.5 Pro (fallback). Frontend em React 18, Vite 6, Tailwind CSS, Zustand e AWS Amplify. Região sa-east-1 (São Paulo).",
    },
    {
      id: "db-term",
      title: "DB-Term",
      shortDescription:
        "Cliente de banco de dados multiplataforma em terminal: PostgreSQL, MySQL, SQL Server e MongoDB em um único binário leve.",
      image: "",
      technologies: [
        "C++20",
        "CMake",
        "FTXUI",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Docker",
      ],
      results: [
        "Um binário autocontido para quatro bancos",
        "TUI reativa com realce de sintaxe e exportação CSV/JSON",
        "Perfis de conexão criptografados localmente com libsodium",
      ],
      challenge:
        "Desenvolvedores precisam de clientes diferentes para cada banco, muitas vezes pesados e com dependências de runtime — o que atrasa o fluxo de trabalho no terminal.",
      solution:
        "DB-Term unifica PostgreSQL, MySQL, SQL Server e MongoDB em um cliente TUI em C++20 com FTXUI: navegação de esquemas, queries com realce de sintaxe, exportação CSV/JSON e perfis criptografados via libsodium.",
      architecture:
        "C++20 com CMake e vcpkg. TUI com FTXUI; conectores via libpq, libmysqlclient, nanodbc e mongo-cxx-driver; criptografia com libsodium e JSON com nlohmann-json. Distribuído como executável autocontido, compilável via Docker com um único comando.",
    },
    {
      id: "pulse",
      title: "Pulse",
      shortDescription:
        "SaaS de monitoramento de saúde ocupacional: pesquisas anônimas, alertas por setor e conformidade com a LGPD para o PGR.",
      image: "/images/projects/pulse.jpg",
      videoUrl: "/images/projects/pulse.mp4",
      demoUrl: "https://pulseips.com.br/",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "Stripe",
        "Redis",
      ],
      results: [
        "Pesquisas rápidas e anônimas por mensagem",
        "Alertas automáticos por queda de indicadores",
        "Relatórios de evidência em PDF para o PGR",
      ],
      challenge:
        "Empresas precisam acompanhar o bem-estar dos colaboradores e cumprir obrigações legais trabalhistas, sem expor identidades e com evidências auditáveis para o PGR.",
      solution:
        "O Pulse envia pesquisas anônimas, agrupa resultados por setor, emite alertas automáticos, oferece canal permanente de relato anônimo e gera relatórios PDF de evidência — com consentimento imutável e anonimato duplo alinhados à LGPD.",
      architecture:
        "Next.js 16 (App Router), React 19 e TypeScript strict. PostgreSQL 15+ com Prisma v7, Tailwind CSS v4 e shadcn/ui. Filas com BullMQ + Redis; pagamentos com Stripe; e-mail com Resend; arquivos em AWS S3.",
    },
  ],
  en: [
    {
      id: "syntonia",
      title: "Syntonia",
      shortDescription:
        "Personal learning engine powered by AI: in-depth articles generated on demand from your profile — no ads, no clickbait.",
      image: "/images/projects/syntonia.jpg",
      videoUrl: "/images/projects/syntonia.mp4",
      demoUrl: "https://main.d2po6kvmcq6ut4.amplifyapp.com/",
      technologies: [
        "AWS",
        "TypeScript",
        "React",
        "Node.js",
        "Gemini",
        "DynamoDB",
      ],
      results: [
        "Focused vertical feed, one article at a time",
        "On-demand personalized content with Gemini",
        "Serverless architecture on AWS (sa-east-1)",
      ],
      challenge:
        "The internet has plenty of content, but finding material at the right level about exactly what you want to learn takes too much time — and often comes with ads, clickbait, and generic content.",
      solution:
        "Users describe who they are and what interests them; Syntonia generates in-depth articles on demand with Google Gemini, delivered in a fluid vertical-scroll feed with no distractions.",
      architecture:
        "Serverless backend (Node.js 20, TypeScript, Serverless Framework v3) with AWS Lambda, API Gateway, DynamoDB, SQS, and Cognito. AI with Gemini 2.5 Flash (primary) and Gemini 2.5 Pro (fallback). Frontend with React 18, Vite 6, Tailwind CSS, Zustand, and AWS Amplify. Region sa-east-1 (São Paulo).",
    },
    {
      id: "db-term",
      title: "DB-Term",
      shortDescription:
        "Cross-platform terminal database client: PostgreSQL, MySQL, SQL Server, and MongoDB in a single lightweight binary.",
      image: "",
      technologies: [
        "C++20",
        "CMake",
        "FTXUI",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Docker",
      ],
      results: [
        "One self-contained binary for four databases",
        "Reactive TUI with syntax highlighting and CSV/JSON export",
        "Connection profiles encrypted locally with libsodium",
      ],
      challenge:
        "Developers often need a different client for each database — many of them heavy and with runtime dependencies — which slows down terminal workflows.",
      solution:
        "DB-Term unifies PostgreSQL, MySQL, SQL Server, and MongoDB in a C++20 TUI client powered by FTXUI: schema browsing, syntax-highlighted queries, CSV/JSON export, and encrypted connection profiles via libsodium.",
      architecture:
        "C++20 with CMake and vcpkg. TUI with FTXUI; connectors via libpq, libmysqlclient, nanodbc, and mongo-cxx-driver; encryption with libsodium and JSON with nlohmann-json. Shipped as a fully self-contained executable, buildable via Docker with a single command.",
    },
    {
      id: "pulse",
      title: "Pulse",
      shortDescription:
        "Occupational health monitoring SaaS: anonymous surveys, sector alerts, and LGPD-aligned compliance for risk management programs.",
      image: "/images/projects/pulse.jpg",
      videoUrl: "/images/projects/pulse.mp4",
      demoUrl: "https://pulseips.com.br/",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "Stripe",
        "Redis",
      ],
      results: [
        "Fast anonymous surveys via messaging",
        "Automatic alerts on indicator drops",
        "PDF evidence reports for risk programs",
      ],
      challenge:
        "Companies need to track employee well-being and meet labor compliance obligations without exposing identities — and with auditable evidence for risk management programs.",
      solution:
        "Pulse sends anonymous surveys, groups results by sector, triggers automatic alerts, offers a permanent anonymous reporting channel, and generates PDF evidence reports — with immutable consent records and double anonymity aligned to LGPD.",
      architecture:
        "Next.js 16 (App Router), React 19, and TypeScript strict. PostgreSQL 15+ with Prisma v7, Tailwind CSS v4, and shadcn/ui. Queues with BullMQ + Redis; payments with Stripe; email with Resend; files on AWS S3.",
    },
  ],
  es: [
    {
      id: "syntonia",
      title: "Syntonia",
      shortDescription:
        "Motor de aprendizaje personal con IA: artículos profundos generados bajo demanda a partir de tu perfil, sin anuncios ni clickbait.",
      image: "/images/projects/syntonia.jpg",
      videoUrl: "/images/projects/syntonia.mp4",
      demoUrl: "https://main.d2po6kvmcq6ut4.amplifyapp.com/",
      technologies: [
        "AWS",
        "TypeScript",
        "React",
        "Node.js",
        "Gemini",
        "DynamoDB",
      ],
      results: [
        "Feed vertical enfocado, un artículo a la vez",
        "Contenido personalizado bajo demanda con Gemini",
        "Arquitectura serverless en AWS (sa-east-1)",
      ],
      challenge:
        "Internet tiene contenido de sobra, pero encontrar material en el nivel adecuado sobre exactamente lo que quieres aprender consume demasiado tiempo — y suele venir con anuncios, clickbait y contenido genérico.",
      solution:
        "El usuario describe quién es y qué le interesa; Syntonia genera artículos profundos bajo demanda con Google Gemini, entregados en un feed fluido de scroll vertical, sin distracciones.",
      architecture:
        "Backend serverless (Node.js 20, TypeScript, Serverless Framework v3) con AWS Lambda, API Gateway, DynamoDB, SQS y Cognito. IA con Gemini 2.5 Flash (primary) y Gemini 2.5 Pro (fallback). Frontend con React 18, Vite 6, Tailwind CSS, Zustand y AWS Amplify. Región sa-east-1 (São Paulo).",
    },
    {
      id: "db-term",
      title: "DB-Term",
      shortDescription:
        "Cliente de base de datos multiplataforma en terminal: PostgreSQL, MySQL, SQL Server y MongoDB en un único binario ligero.",
      image: "",
      technologies: [
        "C++20",
        "CMake",
        "FTXUI",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Docker",
      ],
      results: [
        "Un binario autocontenido para cuatro bases de datos",
        "TUI reactiva con resaltado de sintaxis y exportación CSV/JSON",
        "Perfiles de conexión cifrados localmente con libsodium",
      ],
      challenge:
        "Los desarrolladores suelen necesitar un cliente distinto para cada base de datos — a menudo pesados y con dependencias de runtime — lo que ralentiza el flujo de trabajo en terminal.",
      solution:
        "DB-Term unifica PostgreSQL, MySQL, SQL Server y MongoDB en un cliente TUI en C++20 con FTXUI: navegación de esquemas, queries con resaltado de sintaxis, exportación CSV/JSON y perfiles cifrados vía libsodium.",
      architecture:
        "C++20 con CMake y vcpkg. TUI con FTXUI; conectores vía libpq, libmysqlclient, nanodbc y mongo-cxx-driver; cifrado con libsodium y JSON con nlohmann-json. Distribuido como ejecutable autocontenido, compilable vía Docker con un único comando.",
    },
    {
      id: "pulse",
      title: "Pulse",
      shortDescription:
        "SaaS de monitoreo de salud ocupacional: encuestas anónimas, alertas por sector y conformidad con la LGPD para el PGR.",
      image: "/images/projects/pulse.jpg",
      videoUrl: "/images/projects/pulse.mp4",
      demoUrl: "https://pulseips.com.br/",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "Stripe",
        "Redis",
      ],
      results: [
        "Encuestas rápidas y anónimas por mensaje",
        "Alertas automáticos por caída de indicadores",
        "Informes de evidencia en PDF para el PGR",
      ],
      challenge:
        "Las empresas necesitan seguir el bienestar de los colaboradores y cumplir obligaciones laborales sin exponer identidades, con evidencias auditables para el PGR.",
      solution:
        "Pulse envía encuestas anónimas, agrupa resultados por sector, emite alertas automáticos, ofrece un canal permanente de relato anónimo y genera informes PDF de evidencia — con consentimiento inmutable y anonimato doble alineados a la LGPD.",
      architecture:
        "Next.js 16 (App Router), React 19 y TypeScript strict. PostgreSQL 15+ con Prisma v7, Tailwind CSS v4 y shadcn/ui. Colas con BullMQ + Redis; pagos con Stripe; email con Resend; archivos en AWS S3.",
    },
  ],
};

/** @deprecated Prefer projectsByLocale[locale] */
export const projects = projectsByLocale["pt-BR"];
