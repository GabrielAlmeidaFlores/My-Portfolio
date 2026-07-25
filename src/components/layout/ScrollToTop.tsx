import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const { scrollTo } = useSmoothScroll();
  const scrollToRef = useRef(scrollTo);
  scrollToRef.current = scrollTo;

  useEffect(() => {
    scrollToRef.current(0, { immediate: true });
  }, [pathname]);

  return null;
}
