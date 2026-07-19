import { useEffect, useRef } from "react";

export function useMouseSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function handleMove(event: MouseEvent) {
      const rect = element!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      element!.style.setProperty("--mouse-x", `${x}px`);
      element!.style.setProperty("--mouse-y", `${y}px`);
    }

    element.addEventListener("mousemove", handleMove);
    return () => element.removeEventListener("mousemove", handleMove);
  }, []);

  return ref;
}
