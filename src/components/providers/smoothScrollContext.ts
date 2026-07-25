import { createContext } from "react";
import type Lenis from "lenis";

export interface SmoothScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean },
  ) => void;
}

export const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: (target, options) => {
    if (typeof target === "number") {
      window.scrollTo({
        top: target,
        behavior: options?.immediate === false ? "smooth" : "auto",
      });
      return;
    }

    const element =
      typeof target === "string"
        ? target.startsWith("#")
          ? document.getElementById(target.slice(1))
          : document.querySelector(target)
        : target;

    if (!(element instanceof HTMLElement)) {
      return;
    }

    const offset = options?.offset ?? 0;
    const style = getComputedStyle(element);
    const scrollMargin = Number.parseFloat(style.scrollMarginTop);
    const margin = Number.isFinite(scrollMargin) ? scrollMargin : 0;
    const top =
      element.getBoundingClientRect().top + window.scrollY - margin + offset;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: options?.immediate === false ? "smooth" : "auto",
    });
  },
});
