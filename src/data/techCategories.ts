import type { TechCategory } from "@/types/techCategory";

export const techCategories: TechCategory[] = [
  {
    id: "cloud",
    name: "Cloud",
    technologies: [
      "AWS",
      "Azure",
      "Serverless",
      "EC2",
      "Lambda",
      "S3",
      "RDS",
      "Container Apps",
      "Web Apps",
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    technologies: [
      "Docker",
      "Linux",
      "GitHub Actions",
      "CI/CD",
      "Nginx",
      "OpenVPN",
      "Observabilidade",
    ],
  },
  {
    id: "backend",
    name: "Backend",
    technologies: [
      "Node.js",
      "NestJS",
      "TypeScript",
      "C#",
      ".NET",
      "Python",
      "Java",
      "PHP",
    ],
  },
  {
    id: "frontend",
    name: "Frontend",
    technologies: [
      "React",
      "Next.js",
      "AngularJS",
      "Flutter",
      "HTML",
      "CSS",
      "JavaScript",
    ],
  },
  {
    id: "database",
    name: "Banco de Dados",
    technologies: ["PostgreSQL", "SQL Server", "MongoDB", "MySQL"],
  },
];
