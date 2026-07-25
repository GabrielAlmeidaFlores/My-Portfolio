import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";
import { renderMermaidChart } from "@/lib/renderMermaidChart";

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
  const hostRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [svg, setSvg] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let cancelled = false;
    const renderId = `mermaid-${reactId}-${isDark ? "dark" : "light"}`;

    async function renderDiagram() {
      try {
        const rendered = await renderMermaidChart(renderId, chart, isDark);

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
  }, [chart, isDark, isInView, reactId]);

  if (hasError) {
    return (
      <div ref={hostRef} className={cn("my-8 w-full min-w-0", className)}>
        <pre className="w-full min-w-0 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface p-4 font-mono text-sm text-muted">
          {chart.trim()}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        ref={hostRef}
        className={cn(
          "my-8 h-56 w-full min-w-0 rounded-[var(--radius-card)] border border-border bg-surface",
          isInView && "animate-pulse",
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={hostRef}
      className={cn(
        "my-8 w-full min-w-0 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:p-6",
        "[&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full",
        className,
      )}
      role="img"
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
