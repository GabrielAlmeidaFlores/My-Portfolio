import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { Download, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

interface ArticleMermaidViewerProps {
  svg: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const TRANSITION_MS = 240;

const controlButtonClassName =
  "flex size-8 items-center justify-center rounded-[var(--radius-button)] border border-border bg-surface text-foreground transition-colors hover:border-primary-400 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:hover:text-primary-300";

export function ArticleMermaidViewer({
  svg,
  title,
  open,
  onClose,
}: ArticleMermaidViewerProps) {
  const { copy } = useTranslations();
  const labels = copy.article;
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scaleRef = useRef(1);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [isRendered, setIsRendered] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const applyScale = useCallback((nextScale: number) => {
    const clamped = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, Number(nextScale.toFixed(2))),
    );

    scaleRef.current = clamped;
    setScale(clamped);

    if (clamped <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  const resetView = useCallback(() => {
    scaleRef.current = 1;
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const requestClose = useCallback(() => {
    flushSync(() => setIsClosing(true));
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      setIsClosing(false);
      resetView();
      return;
    }

    if (!isRendered) {
      return;
    }

    setIsClosing(true);
    const timeout = window.setTimeout(
      () => setIsRendered(false),
      shouldReduceMotion ? 0 : TRANSITION_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [open, isRendered, shouldReduceMotion, resetView]);

  useEffect(() => {
    if (!isRendered) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const currentPaddingRight =
      Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        applyScale(scaleRef.current + 0.25);
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        applyScale(scaleRef.current - 0.25);
        return;
      }

      if (event.key === "0") {
        event.preventDefault();
        resetView();
        return;
      }

      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        const step = 28;
        setPosition((current) => {
          if (event.key === "ArrowLeft") {
            return { ...current, x: current.x - step };
          }
          if (event.key === "ArrowRight") {
            return { ...current, x: current.x + step };
          }
          if (event.key === "ArrowUp") {
            return { ...current, y: current.y - step };
          }
          return { ...current, y: current.y + step };
        });
        return;
      }

      if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable || focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeElement = document.activeElement;

        if (
          activeElement === panelRef.current ||
          !panelRef.current?.contains(activeElement)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
          return;
        }

        if (event.shiftKey && activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isRendered, requestClose, applyScale, resetView]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!isRendered || !canvas) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const step = event.deltaY < 0 ? 0.15 : -0.15;
      applyScale(scaleRef.current + step);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [isRendered, applyScale]);

  if (!isRendered) {
    return null;
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scaleRef.current <= 1) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) {
      return;
    }

    setPosition({
      x: dragRef.current.originX + event.clientX - dragRef.current.startX,
      y: dragRef.current.originY + event.clientY - dragRef.current.startY,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current.active = false;
    setIsDragging(false);
  };

  const getDownloadSvg = () => {
    const source = panelRef.current?.querySelector<SVGSVGElement>(
      ".mermaid-stage svg",
    );

    if (!source) {
      return svg;
    }

    const clone = source.cloneNode(true) as SVGSVGElement;
    const sourceNodes = Array.from(source.querySelectorAll<SVGElement>("*"));
    const cloneNodes = Array.from(clone.querySelectorAll<SVGElement>("*"));
    const styleProperties = [
      "fill",
      "stroke",
      "stroke-width",
      "color",
      "font-family",
      "font-size",
      "font-weight",
      "letter-spacing",
      "opacity",
      "filter",
      "rx",
      "ry",
    ];

    sourceNodes.forEach((node, index) => {
      const target = cloneNodes[index];

      if (!target) {
        return;
      }

      const computed = window.getComputedStyle(node);
      styleProperties.forEach((property) => {
        const value = computed.getPropertyValue(property);

        if (value) {
          target.style.setProperty(property, value);
        }
      });
    });

    const rootStyle = window.getComputedStyle(source);
    clone.style.setProperty("font-family", rootStyle.fontFamily);
    clone.style.setProperty("font-size", rootStyle.fontSize);

    return new XMLSerializer().serializeToString(clone);
  };

  const handleDownload = () => {
    const blob = new Blob([getDownloadSvg()], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "diagram.svg";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-auto absolute inset-0 bg-background"
        onMouseDown={requestClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "pointer-events-auto relative flex h-[min(92vh,900px)] w-full max-w-[1400px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-[0_30px_120px_rgba(0,0,0,0.35)] will-change-[translate,scale,opacity] focus:outline-none",
          !shouldReduceMotion &&
            (isClosing ? "mermaid-panel-out" : "mermaid-panel-in"),
        )}
      >
        <header className="flex flex-col gap-3 border-b border-border bg-hover/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 sm:flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {title}
            </p>
            <p className="mt-0.5 text-xs text-muted">{labels.panHint}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0 sm:justify-end">
            <button
              type="button"
              aria-label={labels.zoomOut}
              title={labels.zoomOut}
              onClick={() => applyScale(scale - 0.25)}
              className={controlButtonClassName}
            >
              <ZoomOut size={16} aria-hidden="true" />
            </button>

            <span
              className="min-w-12 text-center font-mono text-xs font-medium text-muted"
              aria-live="polite"
            >
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              aria-label={labels.zoomIn}
              title={labels.zoomIn}
              onClick={() => applyScale(scale + 0.25)}
              className={controlButtonClassName}
            >
              <ZoomIn size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label={labels.resetView}
              title={labels.resetView}
              onClick={resetView}
              className={controlButtonClassName}
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label={labels.downloadDiagram}
              title={labels.downloadDiagram}
              onClick={handleDownload}
              className={controlButtonClassName}
            >
              <Download size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label={labels.closeDiagram}
              title={labels.closeDiagram}
              onClick={requestClose}
              className={controlButtonClassName}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div
          ref={canvasRef}
          role="group"
          aria-label={labels.panHint}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={() => {
            if (scaleRef.current > 1.5) {
              resetView();
            } else {
              applyScale(2);
            }
          }}
          className={cn(
            "mermaid-stage relative flex-1 touch-none overflow-hidden bg-background/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500",
            scale > 1 ? "cursor-grab" : "cursor-default",
            isDragging && "cursor-grabbing",
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
              className={cn(
                "flex h-full w-full origin-center items-center justify-center will-change-transform",
                "[&_svg]:h-auto [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:max-w-full",
                !isDragging && "transition-transform duration-150",
              )}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
