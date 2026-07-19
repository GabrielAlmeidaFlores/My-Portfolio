import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { copy } = useTranslations();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? copy.theme.light : copy.theme.dark}
      className={cn(
        "relative flex items-center justify-center overflow-hidden transition-colors",
        compact
          ? "h-9 w-9 rounded-full text-muted hover:bg-hover hover:text-foreground"
          : "h-10 w-10 rounded-[var(--radius-button)] border border-border bg-surface hover:bg-hover",
      )}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {theme === "dark" ? (
          <Sun size={compact ? 16 : 18} className="text-current" />
        ) : (
          <Moon size={compact ? 16 : 18} className="text-current" />
        )}
      </motion.div>
    </button>
  );
}
