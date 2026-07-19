import type { Locale } from "@/types/locale";
import type { Technology } from "@/types/technology";

type TechFilterId =
  | "all"
  | "cloud"
  | "backend"
  | "frontend"
  | "devops"
  | "database"
  | "tools";

export interface TechFilter {
  id: TechFilterId;
  label: string;
}

const techFilterLabels: Record<Locale, Record<TechFilterId, string>> = {
  "pt-BR": {
    all: "Todos",
    cloud: "Cloud",
    backend: "Backend",
    frontend: "Frontend",
    devops: "DevOps",
    database: "Banco de dados",
    tools: "Ferramentas",
  },
  en: {
    all: "All",
    cloud: "Cloud",
    backend: "Backend",
    frontend: "Frontend",
    devops: "DevOps",
    database: "Databases",
    tools: "Tools",
  },
  es: {
    all: "Todos",
    cloud: "Cloud",
    backend: "Backend",
    frontend: "Frontend",
    devops: "DevOps",
    database: "Bases de datos",
    tools: "Herramientas",
  },
};

const filterIds: TechFilterId[] = [
  "all",
  "cloud",
  "backend",
  "frontend",
  "devops",
  "database",
  "tools",
];

export function getTechFilters(locale: Locale): TechFilter[] {
  const labels = techFilterLabels[locale];
  return filterIds.map((id) => ({ id, label: labels[id] }));
}

type TechBase = Omit<Technology, "description">;

const techBase: TechBase[] = [
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    relatedProjects: ["syntonia", "pulse"],
    relatedCertifications: [
      "aws-developer",
      "aws-solutions-architect",
      "aws-cloud-practitioner",
    ],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "azure",
    name: "Azure",
    category: "cloud",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    relatedProjects: ["syntonia", "db-term"],
    relatedCertifications: [],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    category: "devops",
    relatedProjects: ["syntonia"],
    relatedCertifications: [],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "jenkins",
    name: "Jenkins",
    category: "devops",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "prometheus",
    name: "Prometheus",
    category: "devops",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "grafana",
    name: "Grafana",
    category: "devops",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "react",
    name: "React",
    category: "frontend",
    relatedProjects: ["syntonia", "pulse"],
    relatedCertifications: [],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "backend",
    relatedProjects: ["syntonia", "pulse"],
    relatedCertifications: [],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "nestjs",
    name: "NestJS",
    category: "backend",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "java",
    name: "Java",
    category: "backend",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "springboot",
    name: "Spring Boot",
    category: "backend",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "go",
    name: "Go",
    category: "backend",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "gin",
    name: "Gin",
    category: "backend",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "dotnet",
    name: ".NET",
    category: "backend",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: ["epiousion-pleno", "epiousion-junior"],
  },
  {
    id: "angularjs",
    name: "AngularJS",
    category: "frontend",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: ["epiousion-pleno", "epiousion-junior"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "database",
    relatedProjects: ["pulse", "db-term"],
    relatedCertifications: [],
    relatedExperiences: ["epiousion-pleno", "epiousion-junior"],
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "database",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    category: "database",
    relatedProjects: ["db-term"],
    relatedCertifications: [],
    relatedExperiences: ["epiousion-pleno", "epiousion-junior"],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "database",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "dynamodb",
    name: "DynamoDB",
    category: "database",
    relatedProjects: ["syntonia", "pulse"],
    relatedCertifications: [],
    relatedExperiences: ["ousion-tech-lead"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "database",
    relatedProjects: [],
    relatedCertifications: [],
    relatedExperiences: [],
  },
  {
    id: "linux",
    name: "Linux",
    category: "tools",
    relatedProjects: ["db-term"],
    relatedCertifications: ["lpi-linux"],
    relatedExperiences: ["ousion-tech-lead"],
  },
];

const descriptions: Record<Locale, Record<string, string>> = {
  "pt-BR": {
    aws: "Arquitetura cloud-native, Lambda, EC2, S3 e RDS.",
    azure: "Container Apps, Web Apps e infraestrutura híbrida.",
    docker: "Containerização e padronização de ambientes.",
    "github-actions": "Pipelines CI/CD automatizados.",
    jenkins: "Automação de builds e pipelines CI/CD.",
    prometheus: "Monitoramento e coleta de métricas.",
    grafana: "Dashboards e visualização de métricas.",
    react: "Interfaces modernas e performáticas.",
    nestjs: "APIs escaláveis com TypeScript.",
    dotnet: "Sistemas corporativos e APIs REST.",
    angularjs: "Aplicações web corporativas legadas e refatoração.",
    postgresql: "Banco relacional para aplicações multi-tenant.",
    mysql: "Banco relacional open source para aplicações web.",
    sqlserver: "Persistência em ambientes corporativos .NET.",
    mongodb: "Banco documental NoSQL flexível e escalável.",
    dynamodb: "Banco NoSQL serverless na AWS.",
    redis: "Cache em memória e filas de alta performance.",
    linux: "Infraestrutura, hardening e observabilidade.",
    typescript: "Tipagem forte em APIs e frontends modernos.",
    java: "APIs e sistemas corporativos robustos.",
    go: "Serviços de alta performance e concorrência.",
    springboot: "Microsserviços e APIs REST com Java.",
    gin: "APIs HTTP leves e performáticas em Go.",
  },
  en: {
    aws: "Cloud-native architecture, Lambda, EC2, S3, and RDS.",
    azure: "Container Apps, Web Apps, and hybrid infrastructure.",
    docker: "Containerization and environment standardization.",
    "github-actions": "Automated CI/CD pipelines.",
    jenkins: "Build automation and CI/CD pipelines.",
    prometheus: "Monitoring and metrics collection.",
    grafana: "Dashboards and metrics visualization.",
    react: "Modern, high-performance interfaces.",
    nestjs: "Scalable APIs with TypeScript.",
    dotnet: "Enterprise systems and REST APIs.",
    angularjs: "Legacy corporate web apps and refactoring.",
    postgresql: "Relational database for multi-tenant applications.",
    mysql: "Open-source relational database for web apps.",
    sqlserver: "Persistence in .NET enterprise environments.",
    mongodb: "Flexible, scalable document NoSQL database.",
    dynamodb: "Serverless NoSQL database on AWS.",
    redis: "In-memory cache and high-performance queues.",
    linux: "Infrastructure, hardening, and observability.",
    typescript: "Strong typing for modern APIs and frontends.",
    java: "Robust APIs and enterprise systems.",
    go: "High-performance and concurrent services.",
    springboot: "Microservices and REST APIs with Java.",
    gin: "Lightweight, high-performance HTTP APIs in Go.",
  },
  es: {
    aws: "Arquitectura cloud-native, Lambda, EC2, S3 y RDS.",
    azure: "Container Apps, Web Apps e infraestructura híbrida.",
    docker: "Contenerización y estandarización de entornos.",
    "github-actions": "Pipelines CI/CD automatizados.",
    jenkins: "Automatización de builds y pipelines CI/CD.",
    prometheus: "Monitoreo y recolección de métricas.",
    grafana: "Dashboards y visualización de métricas.",
    react: "Interfaces modernas y de alto rendimiento.",
    nestjs: "APIs escalables con TypeScript.",
    dotnet: "Sistemas corporativos y APIs REST.",
    angularjs: "Aplicaciones web corporativas legacy y refactorización.",
    postgresql: "Base relacional para aplicaciones multi-tenant.",
    mysql: "Base relacional open source para aplicaciones web.",
    sqlserver: "Persistencia en entornos corporativos .NET.",
    mongodb: "Base documental NoSQL flexible y escalable.",
    dynamodb: "Base NoSQL serverless en AWS.",
    redis: "Caché en memoria y colas de alto rendimiento.",
    linux: "Infraestructura, hardening y observabilidad.",
    typescript: "Tipado fuerte en APIs y frontends modernos.",
    java: "APIs y sistemas corporativos robustos.",
    go: "Servicios de alto rendimiento y concurrencia.",
    springboot: "Microservicios y APIs REST con Java.",
    gin: "APIs HTTP ligeras y performantes en Go.",
  },
};

export function getTechnologies(locale: Locale): Technology[] {
  const localeDescriptions = descriptions[locale];

  return techBase.map((tech) => ({
    ...tech,
    description: localeDescriptions[tech.id],
  }));
}

/** @deprecated Prefer getTechFilters(locale) */
export const techFilters = getTechFilters("pt-BR");

/** @deprecated Prefer getTechnologies(locale) */
export const technologies = getTechnologies("pt-BR");
