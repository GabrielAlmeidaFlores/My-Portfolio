import type { Locale } from "@/types/locale";
import type { ProcessPipeline } from "@/types/processPipeline";
import { blueprintLayout } from "@/data/software-pipelines/blueprintLayout";
import { copy } from "@/data/software-pipelines/copy";

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

