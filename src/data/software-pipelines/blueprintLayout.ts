export const blueprintLayout = {
  label: "System Design",
  connections: [
    { id: "c-g", path: "M 120 72 H 268" },
    { id: "g-j", path: "M 316 96 V 118 H 200" },
    { id: "j-a", path: "M 200 118 H 96 V 148" },
    { id: "j-b", path: "M 200 118 H 292 V 148" },
    { id: "j-d", path: "M 200 118 V 236" },
  ],
  junctions: [
    { cx: 200, cy: 118 },
    { cx: 316, cy: 96 },
    { cx: 200, cy: 200 },
  ],
  nodes: [
    { id: "client", x: 24, y: 48, width: 96, height: 48 },
    { id: "gateway", x: 268, y: 48, width: 96, height: 48 },
    { id: "service-a", x: 48, y: 148, width: 96, height: 48 },
    { id: "service-b", x: 244, y: 148, width: 96, height: 48 },
    { id: "database", x: 146, y: 236, width: 108, height: 48 },
  ],
} as const;
