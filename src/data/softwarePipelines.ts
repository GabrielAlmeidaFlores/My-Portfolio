import type { Locale } from "@/types/locale";
import type { ProcessPipeline } from "@/types/processPipeline";

const blueprintLayout = {
  label: "System Design",
  connections: [
    { id: "c-g", path: "M 120 72 H 268" },
    { id: "g-j", path: "M 316 96 V 118 H 200" },
    { id: "j-a", path: "M 200 118 H 96 V 148" },
    { id: "j-b", path: "M 200 118 H 292 V 148" },
    { id: "j-d", path: "M 200 118 V 236" },
  ],
  junctions: [
    { cx: 200, cy: 118 },
    { cx: 316, cy: 96 },
    { cx: 200, cy: 200 },
  ],
  nodes: [
    { id: "client", x: 24, y: 48, width: 96, height: 48 },
    { id: "gateway", x: 268, y: 48, width: 96, height: 48 },
    { id: "service-a", x: 48, y: 148, width: 96, height: 48 },
    { id: "service-b", x: 244, y: 148, width: 96, height: 48 },
    { id: "database", x: 146, y: 236, width: 108, height: 48 },
  ],
} as const;

type PipelineCopy = {
  cloud: {
    title: string;
    description: string;
    layers: Record<
      string,
      { title: string; subtitle: string; details: string[] }
    >;
  };
  architecture: {
    title: string;
    description: string;
    nodes: Record<
      string,
      { label: string; sublabel: string; details: string[] }
    >;
  };
  devops: {
    title: string;
    description: string;
    cycle: Record<
      string,
      { label: string; subtitle: string; details: string[] }
    >;
  };
  security: {
    title: string;
    description: string;
    layers: Record<
      string,
      { title: string; subtitle: string; details: string[] }
    >;
  };
};

const copy: Record<Locale, PipelineCopy> = {
  "pt-BR": {
    cloud: {
      title: "Cloud",
      description:
        "Infraestrutura em camadas — da rede à aplicação, com segurança e escala em cada nível.",
      layers: {
        application: {
          title: "Application",
          subtitle: "APIs • Services • Microservices",
          details: [
            "APIs REST e GraphQL com versionamento",
            "Microsserviços desacoplados e observáveis",
            "Deploy contínuo com zero-downtime",
          ],
        },
        compute: {
          title: "Compute Layer",
          subtitle: "ECS • Lambda • EC2",
          details: [
            "Containers orquestrados com ECS/EKS",
            "Funções serverless para cargas event-driven",
            "Auto Scaling baseado em métricas reais",
          ],
        },
        storage: {
          title: "Storage & Database",
          subtitle: "S3 • RDS • MongoDB",
          details: [
            "Object storage para assets e backups",
            "Bancos relacionais gerenciados com RDS",
            "NoSQL para alta throughput e flexibilidade",
          ],
        },
        network: {
          title: "Network & Security",
          subtitle: "VPC • IAM • CDN",
          details: [
            "Redes isoladas com subnets públicas e privadas",
            "IAM com least privilege e roles por serviço",
            "CDN para baixa latência global",
          ],
        },
      },
    },
    architecture: {
      title: "Arquitetura",
      description:
        "Blueprint de sistema — transformando requisitos em componentes conectados e escaláveis.",
      nodes: {
        client: {
          label: "Client",
          sublabel: "Web / Mobile",
          details: [
            "Interfaces responsivas e acessíveis",
            "Comunicação via APIs REST/GraphQL",
            "Cache e otimização de payloads",
          ],
        },
        gateway: {
          label: "Gateway",
          sublabel: "API Gateway",
          details: [
            "Roteamento e rate limiting",
            "Autenticação na borda",
            "Versionamento de APIs",
          ],
        },
        "service-a": {
          label: "Service",
          sublabel: "A",
          details: [
            "Domínio de negócio isolado",
            "Contratos bem definidos",
            "Escalabilidade horizontal",
          ],
        },
        "service-b": {
          label: "Service",
          sublabel: "B",
          details: [
            "Processamento assíncrono",
            "Filas e eventos desacoplados",
            "Resiliência com circuit breaker",
          ],
        },
        database: {
          label: "Database",
          sublabel: "PostgreSQL",
          details: [
            "Persistência relacional gerenciada",
            "Backups e replicação",
            "Migrations versionadas",
          ],
        },
      },
    },
    devops: {
      title: "DevOps",
      description:
        "Ciclo contínuo da ideia à produção — commit, build, teste, deploy e feedback em loop.",
      cycle: {
        code: {
          label: "Code",
          subtitle: "Git • PR",
          details: [
            "Versionamento com branches e pull requests",
            "Code review antes de integrar",
            "Convenções e hooks de qualidade",
          ],
        },
        build: {
          label: "Build",
          subtitle: "CI • Docker",
          details: [
            "Pipeline automatizado a cada push",
            "Imagens Docker reproduzíveis",
            "Artefatos versionados e cacheados",
          ],
        },
        test: {
          label: "Test",
          subtitle: "Unit • E2E",
          details: [
            "Testes unitários e de integração",
            "Validação E2E em ambiente efêmero",
            "Bloqueio de merge em falhas",
          ],
        },
        deploy: {
          label: "Deploy",
          subtitle: "CD • Rollout",
          details: [
            "Deploy contínuo com estratégias blue/green",
            "Rollout progressivo e rollback rápido",
            "Infraestrutura como código",
          ],
        },
        monitor: {
          label: "Monitor",
          subtitle: "Metrics • Logs",
          details: [
            "Métricas, logs e traces centralizados",
            "Dashboards e alertas em tempo real",
            "SLOs e error budgets monitorados",
          ],
        },
        feedback: {
          label: "Feedback",
          subtitle: "Iterate",
          details: [
            "Insights de produção voltam ao time",
            "Priorização baseada em dados reais",
            "Melhoria contínua do ciclo",
          ],
        },
      },
    },
    security: {
      title: "Segurança",
      description:
        "Proteção em camadas — cada barreira valida, filtra e protege antes de chegar ao núcleo.",
      layers: {
        firewall: {
          title: "Firewall",
          subtitle: "WAF • Rate Limit • DDoS",
          details: [
            "Filtragem de tráfego malicioso na borda",
            "Rate limiting e proteção contra DDoS",
            "Regras de firewall por ambiente",
          ],
        },
        authentication: {
          title: "Authentication",
          subtitle: "JWT • OAuth • MFA",
          details: [
            "Tokens JWT com rotação e expiração",
            "OAuth 2.0 / OIDC para identidade federada",
            "MFA obrigatório em ambientes críticos",
          ],
        },
        authorization: {
          title: "Authorization",
          subtitle: "RBAC • IAM • Policies",
          details: [
            "Controle de acesso baseado em papéis (RBAC)",
            "Políticas IAM com least privilege",
            "Validação de escopo em cada requisição",
          ],
        },
        data: {
          title: "Data Protection",
          subtitle: "Encryption • TLS • Secrets",
          details: [
            "Criptografia em trânsito (TLS 1.3) e repouso",
            "Secrets gerenciados via vault seguro",
            "Auditoria e logs de acesso a dados sensíveis",
          ],
        },
      },
    },
  },
  en: {
    cloud: {
      title: "Cloud",
      description:
        "Layered infrastructure — from network to application, with security and scale at every level.",
      layers: {
        application: {
          title: "Application",
          subtitle: "APIs • Services • Microservices",
          details: [
            "Versioned REST and GraphQL APIs",
            "Decoupled, observable microservices",
            "Continuous deploy with zero downtime",
          ],
        },
        compute: {
          title: "Compute Layer",
          subtitle: "ECS • Lambda • EC2",
          details: [
            "Containers orchestrated with ECS/EKS",
            "Serverless functions for event-driven workloads",
            "Auto Scaling based on real metrics",
          ],
        },
        storage: {
          title: "Storage & Database",
          subtitle: "S3 • RDS • MongoDB",
          details: [
            "Object storage for assets and backups",
            "Managed relational databases with RDS",
            "NoSQL for high throughput and flexibility",
          ],
        },
        network: {
          title: "Network & Security",
          subtitle: "VPC • IAM • CDN",
          details: [
            "Isolated networks with public and private subnets",
            "IAM with least privilege and per-service roles",
            "CDN for low global latency",
          ],
        },
      },
    },
    architecture: {
      title: "Architecture",
      description:
        "System blueprint — turning requirements into connected, scalable components.",
      nodes: {
        client: {
          label: "Client",
          sublabel: "Web / Mobile",
          details: [
            "Responsive and accessible interfaces",
            "Communication via REST/GraphQL APIs",
            "Caching and payload optimization",
          ],
        },
        gateway: {
          label: "Gateway",
          sublabel: "API Gateway",
          details: [
            "Routing and rate limiting",
            "Edge authentication",
            "API versioning",
          ],
        },
        "service-a": {
          label: "Service",
          sublabel: "A",
          details: [
            "Isolated business domain",
            "Well-defined contracts",
            "Horizontal scalability",
          ],
        },
        "service-b": {
          label: "Service",
          sublabel: "B",
          details: [
            "Async processing",
            "Decoupled queues and events",
            "Resilience with circuit breakers",
          ],
        },
        database: {
          label: "Database",
          sublabel: "PostgreSQL",
          details: [
            "Managed relational persistence",
            "Backups and replication",
            "Versioned migrations",
          ],
        },
      },
    },
    devops: {
      title: "DevOps",
      description:
        "Continuous cycle from idea to production — commit, build, test, deploy, and feedback in a loop.",
      cycle: {
        code: {
          label: "Code",
          subtitle: "Git • PR",
          details: [
            "Versioning with branches and pull requests",
            "Code review before merge",
            "Conventions and quality hooks",
          ],
        },
        build: {
          label: "Build",
          subtitle: "CI • Docker",
          details: [
            "Automated pipeline on every push",
            "Reproducible Docker images",
            "Versioned and cached artifacts",
          ],
        },
        test: {
          label: "Test",
          subtitle: "Unit • E2E",
          details: [
            "Unit and integration tests",
            "E2E validation in ephemeral environments",
            "Merge blocked on failures",
          ],
        },
        deploy: {
          label: "Deploy",
          subtitle: "CD • Rollout",
          details: [
            "Continuous deploy with blue/green strategies",
            "Progressive rollout and fast rollback",
            "Infrastructure as code",
          ],
        },
        monitor: {
          label: "Monitor",
          subtitle: "Metrics • Logs",
          details: [
            "Centralized metrics, logs, and traces",
            "Real-time dashboards and alerts",
            "Monitored SLOs and error budgets",
          ],
        },
        feedback: {
          label: "Feedback",
          subtitle: "Iterate",
          details: [
            "Production insights return to the team",
            "Prioritization based on real data",
            "Continuous cycle improvement",
          ],
        },
      },
    },
    security: {
      title: "Security",
      description:
        "Layered protection — each barrier validates, filters, and protects before reaching the core.",
      layers: {
        firewall: {
          title: "Firewall",
          subtitle: "WAF • Rate Limit • DDoS",
          details: [
            "Malicious traffic filtering at the edge",
            "Rate limiting and DDoS protection",
            "Firewall rules per environment",
          ],
        },
        authentication: {
          title: "Authentication",
          subtitle: "JWT • OAuth • MFA",
          details: [
            "JWT tokens with rotation and expiration",
            "OAuth 2.0 / OIDC for federated identity",
            "Mandatory MFA in critical environments",
          ],
        },
        authorization: {
          title: "Authorization",
          subtitle: "RBAC • IAM • Policies",
          details: [
            "Role-based access control (RBAC)",
            "IAM policies with least privilege",
            "Scope validation on every request",
          ],
        },
        data: {
          title: "Data Protection",
          subtitle: "Encryption • TLS • Secrets",
          details: [
            "Encryption in transit (TLS 1.3) and at rest",
            "Secrets managed via a secure vault",
            "Audit and access logs for sensitive data",
          ],
        },
      },
    },
  },
  es: {
    cloud: {
      title: "Cloud",
      description:
        "Infraestructura en capas — de la red a la aplicación, con seguridad y escala en cada nivel.",
      layers: {
        application: {
          title: "Application",
          subtitle: "APIs • Services • Microservices",
          details: [
            "APIs REST y GraphQL con versionado",
            "Microservicios desacoplados y observables",
            "Deploy continuo con zero-downtime",
          ],
        },
        compute: {
          title: "Compute Layer",
          subtitle: "ECS • Lambda • EC2",
          details: [
            "Contenedores orquestados con ECS/EKS",
            "Funciones serverless para cargas event-driven",
            "Auto Scaling basado en métricas reales",
          ],
        },
        storage: {
          title: "Storage & Database",
          subtitle: "S3 • RDS • MongoDB",
          details: [
            "Object storage para assets y backups",
            "Bases relacionales gestionadas con RDS",
            "NoSQL para alto throughput y flexibilidad",
          ],
        },
        network: {
          title: "Network & Security",
          subtitle: "VPC • IAM • CDN",
          details: [
            "Redes aisladas con subnets públicas y privadas",
            "IAM con least privilege y roles por servicio",
            "CDN para baja latencia global",
          ],
        },
      },
    },
    architecture: {
      title: "Arquitectura",
      description:
        "Blueprint de sistema — transformando requisitos en componentes conectados y escalables.",
      nodes: {
        client: {
          label: "Client",
          sublabel: "Web / Mobile",
          details: [
            "Interfaces responsivas y accesibles",
            "Comunicación vía APIs REST/GraphQL",
            "Caché y optimización de payloads",
          ],
        },
        gateway: {
          label: "Gateway",
          sublabel: "API Gateway",
          details: [
            "Enrutamiento y rate limiting",
            "Autenticación en el borde",
            "Versionado de APIs",
          ],
        },
        "service-a": {
          label: "Service",
          sublabel: "A",
          details: [
            "Dominio de negocio aislado",
            "Contratos bien definidos",
            "Escalabilidad horizontal",
          ],
        },
        "service-b": {
          label: "Service",
          sublabel: "B",
          details: [
            "Procesamiento asíncrono",
            "Colas y eventos desacoplados",
            "Resiliencia con circuit breaker",
          ],
        },
        database: {
          label: "Database",
          sublabel: "PostgreSQL",
          details: [
            "Persistencia relacional gestionada",
            "Backups y replicación",
            "Migrations versionadas",
          ],
        },
      },
    },
    devops: {
      title: "DevOps",
      description:
        "Ciclo continuo de la idea a producción — commit, build, test, deploy y feedback en loop.",
      cycle: {
        code: {
          label: "Code",
          subtitle: "Git • PR",
          details: [
            "Versionado con branches y pull requests",
            "Code review antes de integrar",
            "Convenciones y hooks de calidad",
          ],
        },
        build: {
          label: "Build",
          subtitle: "CI • Docker",
          details: [
            "Pipeline automatizado en cada push",
            "Imágenes Docker reproducibles",
            "Artefactos versionados y cacheados",
          ],
        },
        test: {
          label: "Test",
          subtitle: "Unit • E2E",
          details: [
            "Tests unitarios y de integración",
            "Validación E2E en entorno efímero",
            "Bloqueo de merge ante fallos",
          ],
        },
        deploy: {
          label: "Deploy",
          subtitle: "CD • Rollout",
          details: [
            "Deploy continuo con estrategias blue/green",
            "Rollout progresivo y rollback rápido",
            "Infraestructura como código",
          ],
        },
        monitor: {
          label: "Monitor",
          subtitle: "Metrics • Logs",
          details: [
            "Métricas, logs y traces centralizados",
            "Dashboards y alertas en tiempo real",
            "SLOs y error budgets monitoreados",
          ],
        },
        feedback: {
          label: "Feedback",
          subtitle: "Iterate",
          details: [
            "Insights de producción vuelven al equipo",
            "Priorización basada en datos reales",
            "Mejora continua del ciclo",
          ],
        },
      },
    },
    security: {
      title: "Seguridad",
      description:
        "Protección en capas — cada barrera valida, filtra y protege antes de llegar al núcleo.",
      layers: {
        firewall: {
          title: "Firewall",
          subtitle: "WAF • Rate Limit • DDoS",
          details: [
            "Filtrado de tráfico malicioso en el borde",
            "Rate limiting y protección contra DDoS",
            "Reglas de firewall por entorno",
          ],
        },
        authentication: {
          title: "Authentication",
          subtitle: "JWT • OAuth • MFA",
          details: [
            "Tokens JWT con rotación y expiración",
            "OAuth 2.0 / OIDC para identidad federada",
            "MFA obligatorio en entornos críticos",
          ],
        },
        authorization: {
          title: "Authorization",
          subtitle: "RBAC • IAM • Policies",
          details: [
            "Control de acceso basado en roles (RBAC)",
            "Políticas IAM con least privilege",
            "Validación de alcance en cada solicitud",
          ],
        },
        data: {
          title: "Data Protection",
          subtitle: "Encryption • TLS • Secrets",
          details: [
            "Cifrado en tránsito (TLS 1.3) y en reposo",
            "Secrets gestionados vía vault seguro",
            "Auditoría y logs de acceso a datos sensibles",
          ],
        },
      },
    },
  },
};

export function getSoftwarePipelines(locale: Locale): ProcessPipeline[] {
  const t = copy[locale];

  return [
    {
      id: "cloud",
      title: t.cloud.title,
      description: t.cloud.description,
      steps: [],
      layers: ["application", "compute", "storage", "network"].map((id) => ({
        id,
        ...t.cloud.layers[id],
      })),
    },
    {
      id: "architecture",
      title: t.architecture.title,
      description: t.architecture.description,
      steps: [],
      blueprint: {
        label: blueprintLayout.label,
        connections: [...blueprintLayout.connections],
        junctions: [...blueprintLayout.junctions],
        nodes: blueprintLayout.nodes.map((node) => ({
          ...node,
          ...t.architecture.nodes[node.id],
        })),
      },
    },
    {
      id: "devops",
      title: t.devops.title,
      description: t.devops.description,
      steps: [],
      cycle: (
        [
          { id: "code" },
          { id: "build" },
          { id: "test" },
          { id: "deploy", variant: "deploy" as const },
          { id: "monitor", variant: "monitor" as const },
          { id: "feedback" },
        ] as const
      ).map((stage) => ({
        id: stage.id,
        ...t.devops.cycle[stage.id],
        ...("variant" in stage ? { variant: stage.variant } : {}),
      })),
    },
    {
      id: "security",
      title: t.security.title,
      description: t.security.description,
      steps: [],
      layers: ["firewall", "authentication", "authorization", "data"].map(
        (id) => ({
          id,
          ...t.security.layers[id],
        }),
      ),
    },
  ];
}

/** @deprecated Prefer getSoftwarePipelines(locale) */
export const softwarePipelines = getSoftwarePipelines("pt-BR");
