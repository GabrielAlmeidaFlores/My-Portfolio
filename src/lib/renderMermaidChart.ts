import type Mermaid from "mermaid";

type MermaidApi = typeof Mermaid;

type NodeRole =
  | "data"
  | "process"
  | "decision"
  | "external"
  | "success"
  | "warning"
  | "start"
  | "neutral";

let mermaidPromise: Promise<MermaidApi> | null = null;
let initializedTheme: "dark" | "light" | null = null;
let renderQueue: Promise<void> = Promise.resolve();

const rolePatterns: Array<{ role: NodeRole; pattern: RegExp }> = [
  {
    role: "warning",
    pattern:
      /\b(?:pain\w*|bad\w*|gap|scrape|error\w*|risk\w*|captcha|block\w*|timeout|fail\w*|danger|warn\w*)\b/i,
  },
  {
    role: "data",
    pattern:
      /\b(?:db|database|primary|replica|cache|store|queue|graph|sql|docs?|code|engines?|post|inv|bucket|file|ledger|index|r\d+|n\d+)\b/i,
  },
  {
    role: "decision",
    pattern: /^(q|domain|read|legacy|special|size|pick|decision|choose|choice)$/i,
  },
  {
    role: "success",
    pattern: /^(result\w*|out|safe|use|hybrid|pick|f|final|solution|success)$/i,
  },
  {
    role: "external",
    pattern: /\b(?:client|user|agent|apps|browser|ui|frontend|ag)\b/i,
  },
  {
    role: "start",
    pattern: /^(start|need|write|input|entry)$/i,
  },
];

function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((module) => module.default);
  }
  return mermaidPromise;
}

function ensureInitialized(mermaid: MermaidApi, isDark: boolean) {
  const theme = isDark ? "dark" : "light";
  if (initializedTheme === theme) {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    securityLevel: "strict",
    fontFamily: "var(--font-sans)",
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 16,
      nodeSpacing: 38,
      rankSpacing: 48,
      wrappingWidth: 180,
    },
    themeVariables: isDark
      ? {
          darkMode: true,
          background: "#0b1220",
          primaryColor: "#10243b",
          primaryTextColor: "#e2e8f0",
          primaryBorderColor: "#6fb2e7",
          secondaryColor: "#0b2a33",
          tertiaryColor: "#1e1b4b",
          mainBkg: "#111827",
          nodeBorder: "#334155",
          nodeTextColor: "#e2e8f0",
          textColor: "#e2e8f0",
          lineColor: "#7c8594",
          defaultLinkColor: "#7c8594",
          clusterBkg: "#0b1220",
          clusterBorder: "#334155",
          titleColor: "#fafafa",
          edgeLabelBackground: "#111827",
          fontSize: "13.5px",
        }
      : {
          darkMode: false,
          background: "#ffffff",
          primaryColor: "#eef6fe",
          primaryTextColor: "#163a61",
          primaryBorderColor: "#6fb2e7",
          secondaryColor: "#ecfeff",
          tertiaryColor: "#f5f3ff",
          mainBkg: "#ffffff",
          nodeBorder: "#cbd5e1",
          nodeTextColor: "#16181d",
          textColor: "#16181d",
          lineColor: "#8494a8",
          defaultLinkColor: "#8494a8",
          clusterBkg: "#f8fafc",
          clusterBorder: "#dbe3ee",
          titleColor: "#16181d",
          edgeLabelBackground: "#ffffff",
          fontSize: "13.5px",
        },
  });

  initializedTheme = theme;
}

const exactRoles: Record<string, NodeRole> = {
  S4: "warning",
  F: "success",
  Port: "data",
  P: "warning",
  CA: "success",
};

function resolveNodeRole(nodeId: string): NodeRole {
  if (exactRoles[nodeId]) {
    return exactRoles[nodeId];
  }

  const match = rolePatterns.find(({ pattern }) => pattern.test(nodeId));
  return match?.role ?? "process";
}

function decorateMermaidSvg(svg: string): string {
  if (typeof DOMParser === "undefined") {
    return svg;
  }

  const document = new DOMParser().parseFromString(svg, "text/html");
  const root = document.querySelector("svg");

  if (!root) {
    return svg;
  }

  const nodes = root.querySelectorAll("g.node");

  nodes.forEach((node) => {
    const id = node.getAttribute("id") ?? "";
    const match = id.match(/flowchart-(.+?)-\d+$/);
    const nodeId = match?.[1];

    if (nodeId) {
      node.setAttribute("data-role", resolveNodeRole(nodeId));
    }
  });

  return root.outerHTML;
}

export async function renderMermaidChart(
  renderId: string,
  chart: string,
  isDark: boolean,
): Promise<string> {
  const run = async () => {
    const mermaid = await loadMermaid();
    ensureInitialized(mermaid, isDark);
    const { svg } = await mermaid.render(renderId, chart.trim());
    return decorateMermaidSvg(svg);
  };

  const pending = renderQueue.then(run, run);
  renderQueue = pending.then(
    () => undefined,
    () => undefined,
  );
  return pending;
}
