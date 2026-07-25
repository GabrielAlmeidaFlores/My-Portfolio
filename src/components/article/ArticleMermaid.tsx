import { useEffect, useId, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";

interface ArticleMermaidProps {
  chart: string;
  className?: string;
  ariaLabel: string;
}

export function ArticleMermaid({
  chart,
  className,
  ariaLabel,
}: ArticleMermaidProps) {
  const reactId = useId().replace(/:/g, "");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [svg, setSvg] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const renderId = `mermaid-${reactId}-${isDark ? "dark" : "light"}`;

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import("mermaid");

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "strict",
          fontFamily: "var(--font-sans)",
        });

        const { svg: rendered } = await mermaid.render(
          renderId,
          chart.trim(),
        );

        if (!cancelled) {
          setSvg(rendered);
          setHasError(false);
        }
      } catch {
        if (!cancelled) {
          setSvg("");
          setHasError(true);
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, isDark, reactId]);

  if (hasError) {
    return (
      <pre
        className={cn(
          "my-6 w-full min-w-0 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface p-4 font-mono text-sm text-muted",
          className,
        )}
      >
        {chart.trim()}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        className={cn(
          "my-6 h-40 w-full min-w-0 animate-pulse rounded-[var(--radius-card)] border border-border bg-surface",
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        "my-6 w-full min-w-0 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface p-3 sm:p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full",
        className,
      )}
      role="img"
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
