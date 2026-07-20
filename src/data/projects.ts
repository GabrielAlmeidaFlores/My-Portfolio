import type { Locale } from "@/types/locale";
import type { Project } from "@/types/project";

const pulseImage = "/images/projects/pulse.png";
const pulseUrl = "https://pulseips.com.br/";
const xcheckImage = "/images/projects/xcheck.png";
const xcheckUrl = "https://xcheck.com.br/";
const httpCliImage =
  "https://raw.githubusercontent.com/GabrielAlmeidaFlores/GabrielAlmeidaFlores/main/assets/HTTP-CLI/http-cli.gif";
const httpCliGithub = "https://github.com/GabrielAlmeidaFlores/HTTP-CLI";

export const projectsByLocale: Record<Locale, Project[]> = {
  "pt-BR": [
    {
      id: "pulse",
      title: "Pulse",
      shortDescription:
        "SaaS de monitoramento de saúde ocupacional: pesquisas anônimas, alertas por setor e conformidade com a LGPD para o PGR.",
      image: pulseImage,
      demoUrl: pulseUrl,
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
    {
      id: "xcheck",
      title: "XCheck",
      shortDescription:
        "Exame toxicológico em cabelo com privacidade por design: coleta em casa, laudo anônimo e janela de detecção de até 90 dias.",
      image: xcheckImage,
      demoUrl: xcheckUrl,
      isClientProject: true,
      technologies: [
        "PHP",
        "MySQL",
        "JavaScript",
        "HTML",
        "CSS",
        "Apache",
        "Docker",
        "Azure",
        "JWT",
      ],
      results: [
        "Fluxo completo de kit, ativação e laudo online",
        "Laudo sem dados pessoais — apenas número de lacre",
        "Privacidade por design com destruição automática de dados",
      ],
      challenge:
        "Exames toxicológicos tradicionais exigem clínica, exposição de identidade e documentos pessoais no laudo — o que gera fricção e risco à privacidade.",
      solution:
        "A XCheck entrega kit em casa, ativação online em minutos e laudo PDF identificado só pelo lacre: sem nome, CPF ou endereço no documento, com dados pessoais apagados após o prazo definido.",
      architecture:
        "Portal em PHP 8.2 puro (sem frameworks) com Apache, MySQL 5.7 e frontend HTML/CSS/JavaScript vanilla. Autenticação JWT nativa, geração de laudo com wkhtmltopdf/FPDF, webhooks (Loja Integrada e Innovatox), notificações WhatsApp/SMTP e deploy containerizado no Azure App Service.",
    },
    {
      id: "http-cli",
      title: "HTTP-CLI",
      shortDescription:
        "Teste APIs sem sair do terminal. Um cliente HTTP interativo em TUI — estilo Postman — com navegação vim, autenticação, importação de cURL/Postman e histórico persistente para um fluxo 100% teclado.",
      image: httpCliImage,
      githubUrl: httpCliGithub,
      technologies: ["Go", "Bubble Tea", "Cobra", "YAML", "TUI"],
      results: [
        "Layout em três painéis com editor de requisição em abas",
        "Import/export de cURL e collections Postman v2.1",
        "Navegação vim e keybindings totalmente configuráveis",
      ],
      challenge:
        "Clientes HTTP gráficos tiram o desenvolvedor do terminal e do fluxo keyboard-driven, tornando testes de API mais lentos no dia a dia.",
      solution:
        "O HTTP-CLI oferece criar, organizar e executar requisições HTTP em um TUI interativo em Go, com navegação estilo vim, auth (Bearer, Basic, API Key), upload de arquivos e dicas contextuais.",
      architecture:
        "Aplicação CLI em Go com TUI Bubble Tea/Lipgloss, comandos Cobra e configuração YAML. Persistência local de requisições, import/export cURL e Postman, e fluxos de edição no editor externo configurado.",
    },
  ],
  en: [
    {
      id: "pulse",
      title: "Pulse",
      shortDescription:
        "Occupational health monitoring SaaS: anonymous surveys, sector alerts, and LGPD-aligned compliance for risk management programs.",
      image: pulseImage,
      demoUrl: pulseUrl,
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
    {
      id: "xcheck",
      title: "XCheck",
      shortDescription:
        "Hair toxicology testing with privacy by design: at-home collection, anonymous report, and up to 90-day detection window.",
      image: xcheckImage,
      demoUrl: xcheckUrl,
      isClientProject: true,
      technologies: [
        "PHP",
        "MySQL",
        "JavaScript",
        "HTML",
        "CSS",
        "Apache",
        "Docker",
        "Azure",
        "JWT",
      ],
      results: [
        "End-to-end kit, activation, and online report flow",
        "Report without personal data — seal number only",
        "Privacy by design with automatic data destruction",
      ],
      challenge:
        "Traditional toxicology tests require clinics, identity exposure, and personal documents on the report — creating friction and privacy risk.",
      solution:
        "XCheck ships a kit home, enables online activation in minutes, and issues a PDF report identified only by the seal number: no name, CPF, or address on the document, with personal data deleted after a defined retention period.",
      architecture:
        "Portal built with pure PHP 8.2 (no frameworks), Apache, MySQL 5.7, and vanilla HTML/CSS/JavaScript. Native JWT auth, PDF reports via wkhtmltopdf/FPDF, webhooks (Loja Integrada and Innovatox), WhatsApp/SMTP notifications, and containerized deploy on Azure App Service.",
    },
    {
      id: "http-cli",
      title: "HTTP-CLI",
      shortDescription:
        "Test APIs without leaving the terminal. An interactive Postman-style HTTP client in a TUI — with vim navigation, auth, cURL/Postman import, and persistent history for a fully keyboard-driven workflow.",
      image: httpCliImage,
      githubUrl: httpCliGithub,
      technologies: ["Go", "Bubble Tea", "Cobra", "YAML", "TUI"],
      results: [
        "Three-panel layout with tabbed request editor",
        "Import/export for cURL and Postman v2.1 collections",
        "Vim navigation and fully configurable keybindings",
      ],
      challenge:
        "GUI HTTP clients pull developers out of the terminal and keyboard-driven workflows, slowing down everyday API testing.",
      solution:
        "HTTP-CLI lets you create, organize, and execute HTTP requests in an interactive Go TUI, with vim-style navigation, auth (Bearer, Basic, API Key), file uploads, and contextual hints.",
      architecture:
        "Go CLI app with Bubble Tea/Lipgloss TUI, Cobra commands, and YAML configuration. Local request persistence, cURL and Postman import/export, and edit flows in the configured external editor.",
    },
  ],
  es: [
    {
      id: "pulse",
      title: "Pulse",
      shortDescription:
        "SaaS de monitoreo de salud ocupacional: encuestas anónimas, alertas por sector y conformidad con la LGPD para el PGR.",
      image: pulseImage,
      demoUrl: pulseUrl,
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
    {
      id: "xcheck",
      title: "XCheck",
      shortDescription:
        "Examen toxicológico en cabello con privacidad por diseño: recolección en casa, informe anónimo y ventana de detección de hasta 90 días.",
      image: xcheckImage,
      demoUrl: xcheckUrl,
      isClientProject: true,
      technologies: [
        "PHP",
        "MySQL",
        "JavaScript",
        "HTML",
        "CSS",
        "Apache",
        "Docker",
        "Azure",
        "JWT",
      ],
      results: [
        "Flujo completo de kit, activación e informe online",
        "Informe sin datos personales — solo número de precinto",
        "Privacidad por diseño con destrucción automática de datos",
      ],
      challenge:
        "Los exámenes toxicológicos tradicionales exigen clínica, exposición de identidad y documentos personales en el informe — lo que genera fricción y riesgo a la privacidad.",
      solution:
        "XCheck envía el kit a domicilio, permite activación online en minutos y emite un PDF identificado solo por el precinto: sin nombre, CPF ni dirección en el documento, con datos personales eliminados tras el plazo definido.",
      architecture:
        "Portal en PHP 8.2 puro (sin frameworks) con Apache, MySQL 5.7 y frontend HTML/CSS/JavaScript vanilla. Autenticación JWT nativa, generación de informes con wkhtmltopdf/FPDF, webhooks (Loja Integrada e Innovatox), notificaciones WhatsApp/SMTP y deploy containerizado en Azure App Service.",
    },
    {
      id: "http-cli",
      title: "HTTP-CLI",
      shortDescription:
        "Prueba APIs sin salir del terminal. Un cliente HTTP interactivo estilo Postman en TUI — con navegación vim, autenticación, importación cURL/Postman e historial persistente para un flujo 100% teclado.",
      image: httpCliImage,
      githubUrl: httpCliGithub,
      technologies: ["Go", "Bubble Tea", "Cobra", "YAML", "TUI"],
      results: [
        "Layout de tres paneles con editor de request por pestañas",
        "Import/export de cURL y collections Postman v2.1",
        "Navegación vim y keybindings totalmente configurables",
      ],
      challenge:
        "Los clientes HTTP gráficos sacan al desarrollador del terminal y del flujo keyboard-driven, haciendo más lentas las pruebas de API del día a día.",
      solution:
        "HTTP-CLI permite crear, organizar y ejecutar requests HTTP en un TUI interactivo en Go, con navegación estilo vim, auth (Bearer, Basic, API Key), upload de archivos y tips contextuales.",
      architecture:
        "App CLI en Go con TUI Bubble Tea/Lipgloss, comandos Cobra y configuración YAML. Persistencia local de requests, import/export cURL y Postman, y edición en el editor externo configurado.",
    },
  ],
};

/** @deprecated Prefer projectsByLocale[locale] */
export const projects = projectsByLocale["pt-BR"];
