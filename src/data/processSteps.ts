import type { ProcessStep } from "@/types/processStep";

export const processSteps: ProcessStep[] = [
  {
    id: "understanding",
    step: 1,
    title: "Entendimento",
    description: "Compreensão profunda do desafio e do contexto.",
  },
  {
    id: "planning",
    step: 2,
    title: "Planejamento",
    description: "Definição de escopo, prazos e entregas.",
  },
  {
    id: "architecture",
    step: 3,
    title: "Arquitetura",
    description: "Design da solução técnica e estratégica.",
  },
  {
    id: "development",
    step: 4,
    title: "Desenvolvimento",
    description: "Implementação com qualidade e agilidade.",
  },
  {
    id: "delivery",
    step: 5,
    title: "Entrega",
    description: "Deploy, validação e transferência de conhecimento.",
  },
  {
    id: "support",
    step: 6,
    title: "Suporte",
    description: "Acompanhamento e evolução contínua.",
  },
];
