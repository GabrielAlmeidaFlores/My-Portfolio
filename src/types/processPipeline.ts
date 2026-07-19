export interface CycleStage {
  id: string;
  label: string;
  subtitle?: string;
  details: string[];
  variant?: "default" | "deploy" | "monitor";
}

export interface BlueprintNode {
  id: string;
  label: string;
  sublabel?: string;
  details: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BlueprintConnection {
  id: string;
  path: string;
}

export interface BlueprintDiagram {
  label: string;
  nodes: BlueprintNode[];
  connections: BlueprintConnection[];
  junctions: Array<{ cx: number; cy: number }>;
}

export interface PipelineLayer {
  id: string;
  title: string;
  subtitle: string;
  details: string[];
}

export interface ProcessPipeline {
  id: string;
  title: string;
  description: string;
  steps: Array<{ label: string }>;
  layers?: PipelineLayer[];
  blueprint?: BlueprintDiagram;
  cycle?: CycleStage[];
}
