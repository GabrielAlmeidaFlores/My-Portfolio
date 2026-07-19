import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useLocale } from "@/i18n/localeContext";
import { localeOptions } from "@/i18n/config";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types/locale";

interface LocaleToggleProps {
  compact?: boolean;
}

export function LocaleToggle({ compact = false }: LocaleToggleProps) {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const current =
    localeOptions.find((option) => option.code === locale) ?? localeOptions[0];

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(next: Locale) {
    setLocale(next);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`${current.label} — Idioma / Language / Idioma`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={cn(
          "relative flex items-center justify-center gap-1.5 font-mono text-xs font-semibold transition-colors",
          compact
            ? "h-9 rounded-full px-2.5 text-muted hover:bg-hover hover:text-foreground"
            : "h-10 rounded-[var(--radius-button)] border border-border bg-surface px-3 hover:bg-hover",
          isOpen && "bg-hover text-foreground",
        )}
      >
        <Languages size={compact ? 15 : 16} aria-hidden="true" />
        <span>{current.shortLabel}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={menuId}
            role="listbox"
            aria-label="Idioma / Language / Idioma"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full right-0 z-50 mt-2 min-w-[9.5rem] overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]"
          >
            {localeOptions.map((option) => {
              const isActive = locale === option.code;

              return (
                <li key={option.code} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.code)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-hover font-semibold text-foreground"
                        : "text-muted hover:bg-hover hover:text-foreground",
                    )}
                  >
                    <span>{option.label}</span>
                    <span className="font-mono text-xs">{option.shortLabel}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
