import type { PipelineCopy } from "@/data/software-pipelines/pipelineCopy";

export const pipelineCopyEs: PipelineCopy = {
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
  };
