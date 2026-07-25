import type { PipelineCopy } from "@/data/software-pipelines/pipelineCopy";

export const pipelineCopyEn: PipelineCopy = {
    cloud: {
      title: "Cloud",
      description:
        "Layered infrastructure - from network to application, with security and scale at every level.",
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
        "System blueprint - turning requirements into connected, scalable components.",
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
        "Continuous cycle from idea to production - commit, build, test, deploy, and feedback in a loop.",
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
        "Layered protection - each barrier validates, filters, and protects before reaching the core.",
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
  };
