import { useEffect, useId, useState, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import type { ArticleHeading } from "@/hooks/useArticleHeadings";

interface ArticleTableOfContentsProps {
  headings: ArticleHeading[];
  activeId: string;
  title: string;
  ariaLabel: string;
  className?: string;
}

export function ArticleTableOfContents({
  headings,
  activeId,
  title,
  ariaLabel,
  className,
}: ArticleTableOfContentsProps) {
  const panelId = useId();
  const prefersReducedMotion = useReducedMotion();
  const { scrollTo } = useSmoothScroll();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const tocHeadings = (() => {
    const h2 = headings.filter((heading) => heading.level === 2);
    return h2.length > 0 ? h2 : headings;
  })();

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 420);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (tocHeadings.length === 0) {
    return null;
  }

  const activeTocId =
    tocHeadings.find((heading) => heading.id === activeId)?.id ??
    (() => {
      const activeIndex = headings.findIndex(
        (heading) => heading.id === activeId,
      );
      if (activeIndex < 0) {
        return tocHeadings[0]?.id ?? "";
      }

      for (let index = activeIndex; index >= 0; index -= 1) {
        const heading = headings[index];
        if (heading && tocHeadings.some((item) => item.id === heading.id)) {
          return heading.id;
        }
      }

      return tocHeadings[0]?.id ?? "";
    })();

  function handleHeadingClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();

    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    scrollTo(element, {
      immediate: Boolean(prefersReducedMotion),
    });

    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <aside
      aria-hidden={!isVisible}
      className={cn(
        "pointer-events-none fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 transition-opacity duration-200 lg:block xl:left-6",
        isVisible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-auto rounded-[var(--radius-card)] border p-4 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          isExpanded
            ? "border-border bg-surface/95 shadow-[var(--shadow-card)]"
            : "border-transparent bg-transparent shadow-none",
          !isVisible && "pointer-events-none",
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onFocusCapture={() => setIsExpanded(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setIsExpanded(false);
          }
        }}
      >
        <p className="sr-only">{title}</p>

        <nav id={panelId} aria-label={ariaLabel} aria-expanded={isExpanded}>
          <ul className="flex flex-col gap-2.5">
            {tocHeadings.map((heading) => {
              const isActive = heading.id === activeTocId;

              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    aria-current={isActive ? "location" : undefined}
                    title={heading.text}
                    tabIndex={isVisible ? 0 : -1}
                    onClick={(event) => handleHeadingClick(event, heading.id)}
                    className="group/item flex items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-0.5 w-3 shrink-0 origin-left rounded-full transition-[transform,background-color,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
                        isActive
                          ? "scale-x-[1.35] bg-foreground opacity-100"
                          : "scale-x-100 bg-muted opacity-55 group-hover/item:opacity-90",
                      )}
                    />

                    <span
                      className={cn(
                        "truncate text-[12px] leading-snug transition-[max-width,opacity,color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
                        isExpanded
                          ? "max-w-[14rem] opacity-100"
                          : "max-w-0 opacity-0",
                        isActive
                          ? "font-semibold text-foreground"
                          : "font-normal text-muted group-hover/item:text-foreground",
                      )}
                    >
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
