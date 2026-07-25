import { useEffect, useMemo, useState, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SmoothScrollContext,
  type SmoothScrollContextValue,
} from "@/components/providers/smoothScrollContext";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);
    setLenis(instance);

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const value = useMemo<SmoothScrollContextValue>(() => {
    return {
      lenis,
      scrollTo: (target, options) => {
        if (lenis) {
          lenis.scrollTo(target, {
            offset: options?.offset,
            immediate: options?.immediate ?? false,
          });
          return;
        }

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
          element.getBoundingClientRect().top +
          window.scrollY -
          margin +
          offset;

        window.scrollTo({
          top: Math.max(top, 0),
          behavior: options?.immediate === false ? "smooth" : "auto",
        });
      },
    };
  }, [lenis]);

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
