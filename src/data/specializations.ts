import type { Specialization } from "@/types/specialization";

export const specializations: Specialization[] = [
  {
    id: "software-architecture",
    title: "Arquitetura de Software",
    description:
      "Projetos escaláveis utilizando boas práticas de arquitetura moderna.",
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    description:
      "Especialista em AWS e Azure com foco em aplicações cloud-native.",
  },
  {
    id: "devops",
    title: "DevOps",
    description:
      "Automação, CI/CD, Docker, Linux e infraestrutura como código.",
  },
  {
    id: "tech-leadership",
    title: "Liderança Técnica",
    description:
      "Mentoria, code review, definição de arquitetura e evolução técnica de equipes.",
  },
  {
    id: "backend",
    title: "Backend",
    skills: ["Node.js", "NestJS", ".NET", "C#", "Java", "Python"],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: ["React", "Next.js", "AngularJS", "Flutter"],
  },
];
