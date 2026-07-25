export type PipelineCopy = {
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
