import { useEffect, useRef } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function useModal(isOpen: boolean, onClose: () => void) {
  const { lenis } = useSmoothScroll();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenisRef.current?.start();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (lenis) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis.stop();
      return;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, [isOpen, lenis]);
}
