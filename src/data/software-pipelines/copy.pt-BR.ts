import type { PipelineCopy } from "@/data/software-pipelines/pipelineCopy";

export const pipelineCopyPtBR: PipelineCopy = {
    cloud: {
      title: "Cloud",
      description:
        "Infraestrutura em camadas - da rede à aplicação, com segurança e escala em cada nível.",
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
        "Blueprint de sistema - transformando requisitos em componentes conectados e escaláveis.",
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
        "Ciclo contínuo da ideia à produção - commit, build, teste, deploy e feedback em loop.",
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
        "Proteção em camadas - cada barreira valida, filtra e protege antes de chegar ao núcleo.",
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
  };
