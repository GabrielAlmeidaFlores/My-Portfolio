import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPOTLIGHT_RADIUS = 200;

interface UseKeyboardBackgroundOptions {
  keyCount: number;
}

export function useKeyboardBackground({ keyCount }: UseKeyboardBackgroundOptions) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const keyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    const spotlight = spotlightRef.current;
    if (!root || !grid) return;

    const rootEl = root;
    const section = rootEl.closest("section");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const eventTarget = section ?? root;

    let parallaxTween: gsap.core.Tween | null = null;
    let scrollTrigger: ScrollTrigger | null = null;

    if (!prefersReducedMotion && section) {
      parallaxTween = gsap.to(grid, {
        y: 48,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          for (let i = 0; i < keyCount; i++) {
            const key = keyRefs.current[i];
            if (!key) continue;
            const wave =
              Math.sin(progress * Math.PI * 1.6 + i * 0.22) * 0.5 + 0.5;
            key.style.setProperty("--scroll-glow", (wave * 0.28).toFixed(3));
          }
        },
      });
    }

    function updateSpotlightOpacity(active: boolean) {
      if (spotlight) {
        spotlight.style.setProperty("--spotlight-opacity", active ? "1" : "0");
      }
    }

    function applyProximity() {
      const { x, y, active } = mouseRef.current;

      if (spotlight && active) {
        const rect = rootEl.getBoundingClientRect();
        spotlight.style.setProperty("--mouse-x", `${x - rect.left}px`);
        spotlight.style.setProperty("--mouse-y", `${y - rect.top}px`);
      }

      for (let i = 0; i < keyCount; i++) {
        const key = keyRefs.current[i];
        if (!key) continue;

        if (!active) {
          key.style.setProperty("--proximity", "0");
          continue;
        }

        const rect = key.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(x - cx, y - cy);
        const proximity = Math.max(0, 1 - distance / SPOTLIGHT_RADIUS);
        key.style.setProperty("--proximity", proximity.toFixed(3));
      }

      rafRef.current = null;
    }

    function scheduleUpdate() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(applyProximity);
    }

    function handleMouseMove(event: MouseEvent) {
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true };
      updateSpotlightOpacity(true);
      scheduleUpdate();
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999, active: false };
      updateSpotlightOpacity(false);
      scheduleUpdate();
    }

    eventTarget.addEventListener("mousemove", handleMouseMove);
    eventTarget.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      eventTarget.removeEventListener("mousemove", handleMouseMove);
      eventTarget.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      parallaxTween?.scrollTrigger?.kill();
      parallaxTween?.kill();
      scrollTrigger?.kill();
    };
  }, [keyCount]);

  function setKeyRef(index: number) {
    return (node: HTMLDivElement | null) => {
      keyRefs.current[index] = node;
    };
  }

  return { rootRef, gridRef, spotlightRef, setKeyRef };
}
