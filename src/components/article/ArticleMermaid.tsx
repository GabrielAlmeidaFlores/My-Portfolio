import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";
import { renderMermaidChart } from "@/lib/renderMermaidChart";
import { ArticleMermaidViewer } from "@/components/article/ArticleMermaidViewer";

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
  const { copy } = useTranslations();
  const labels = copy.article;
  const isDark = theme === "dark";
  const hostRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [svg, setSvg] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
  }, []);

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

  return (
    <div ref={hostRef} className={cn("my-8 w-full min-w-0", className)}>
      {hasError ? (
        <pre className="w-full min-w-0 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface p-4 font-mono text-sm text-muted">
          {chart.trim()}
        </pre>
      ) : !svg ? (
        <div
          className={cn(
            "h-56 w-full rounded-[var(--radius-card)] border border-border bg-surface",
            isInView && "animate-pulse",
          )}
          aria-hidden="true"
        />
      ) : (
        <>
          <button
            type="button"
            aria-label={`${labels.expandDiagram}: ${ariaLabel}`}
            aria-haspopup="dialog"
            onClick={() => setIsOpen(true)}
            className="group block w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface text-left transition-colors hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="flex items-center justify-between gap-3 border-b border-border bg-hover/50 px-4 py-2">
              <span className="font-mono text-[11px] font-medium tracking-wider text-muted uppercase">
                {labels.diagramLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/90 px-2.5 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur transition-colors group-hover:border-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300">
                <Maximize2 size={14} aria-hidden="true" />
                {labels.expandDiagram}
              </span>
            </span>

            <span
              aria-hidden="true"
              className="mermaid-stage block p-4 [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full sm:p-6"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </button>

          <ArticleMermaidViewer
            svg={svg}
            title={ariaLabel}
            open={isOpen}
            onClose={closeViewer}
          />
        </>
      )}
    </div>
  );
}