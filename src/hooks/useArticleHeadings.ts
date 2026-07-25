import { useEffect, useState, type RefObject } from "react";

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

function collectHeadings(container: HTMLElement): ArticleHeading[] {
  const nodes = container.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]");
  const next: ArticleHeading[] = [];

  nodes.forEach((node) => {
    const id = node.id.trim();
    const text = node.textContent?.trim() ?? "";
    if (!id || !text) {
      return;
    }

    next.push({
      id,
      text,
      level: node.tagName === "H3" ? 3 : 2,
    });
  });

  return next;
}

function headingsEqual(a: ArticleHeading[], b: ArticleHeading[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every(
    (heading, index) =>
      heading.id === b[index]?.id &&
      heading.text === b[index]?.text &&
      heading.level === b[index]?.level,
  );
}

function getScrollOffset() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--navbar-total-offset")
    .trim();
  const parsed = Number.parseFloat(raw);
  return (Number.isFinite(parsed) ? parsed : 80) + 16;
}

export function useArticleHeadings(
  containerRef: RefObject<HTMLElement | null>,
  contentKey: string,
) {
  const [headings, setHeadings] = useState<ArticleHeading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      setHeadings([]);
      setActiveId("");
      return;
    }

    function syncHeadings() {
      if (!container) {
        return;
      }

      const next = collectHeadings(container);
      setHeadings((current) =>
        headingsEqual(current, next) ? current : next,
      );
      setActiveId((current) => {
        if (current && next.some((heading) => heading.id === current)) {
          return current;
        }
        return next[0]?.id ?? "";
      });
    }

    const frame = window.requestAnimationFrame(syncHeadings);

    return () => window.cancelAnimationFrame(frame);
  }, [containerRef, contentKey]);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    let frame = 0;

    function updateActive() {
      frame = 0;
      const offset = getScrollOffset();
      let current = headings[0]?.id ?? "";

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= offset) {
          current = heading.id;
        } else {
          break;
        }
      }

      setActiveId((prev) => (prev === current ? prev : current));
    }

    function handleScroll() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [headings]);

  return { headings, activeId };
}
