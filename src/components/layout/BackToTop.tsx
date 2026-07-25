import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useTranslations } from "@/hooks/useTranslations";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { copy } = useTranslations();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 500);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    scrollTo(0, { immediate: false });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={copy.backToTop}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={cn(
        "fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-[var(--radius-button)] bg-primary-700 text-primary-foreground shadow-[var(--shadow-primary)] transition-all duration-350 ease-out hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp size={20} />
    </button>
  );
}
