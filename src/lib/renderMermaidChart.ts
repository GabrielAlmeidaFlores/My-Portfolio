import type Mermaid from "mermaid";

type MermaidApi = typeof Mermaid;

let mermaidPromise: Promise<MermaidApi> | null = null;
let initializedTheme: "dark" | "light" | null = null;
let renderQueue: Promise<void> = Promise.resolve();

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
    theme: isDark ? "dark" : "default",
    securityLevel: "strict",
    fontFamily: "var(--font-sans)",
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 16,
      nodeSpacing: 40,
      rankSpacing: 48,
      wrappingWidth: 160,
    },
    themeVariables: {
      fontSize: "14px",
      lineColor: isDark ? "#94a3b8" : "#64748b",
    },
  });

  initializedTheme = theme;
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
    return svg;
  };

  const pending = renderQueue.then(run, run);
  renderQueue = pending.then(
    () => undefined,
    () => undefined,
  );
  return pending;
}
