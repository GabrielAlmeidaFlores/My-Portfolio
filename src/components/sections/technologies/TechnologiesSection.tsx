import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { TechFilter } from "@/types/technology";
import {
  getTechCategoryColor,
} from "@/lib/techCategories";
import { MOTION_DURATION, MOTION_EASE } from "@/lib/motion";
import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { KeyboardKey } from "@/components/ui/KeyboardKey";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

function getFilterColor(filter: TechFilter): string | undefined {
  if (filter === "all") return undefined;
  return getTechCategoryColor(filter);
}

export function TechnologiesSection() {
  const [filter, setFilter] = useState<TechFilter>("all");
  const prefersReducedMotion = useReducedMotion();
  const { copy, technologies, techFilters } = useTranslations();
  const sectionCopy = copy.technologies;

  const filtered =
    filter === "all"
      ? technologies.filter((tech) => tech.isFeatured)
      : technologies.filter((tech) => tech.category === filter);

  function handleFilterChange(nextFilter: TechFilter) {
    if (nextFilter === filter) return;
    setFilter(nextFilter);
  }

  return (
    <SectionWrapper id="tecnologias" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle title={sectionCopy.title} subtitle={sectionCopy.subtitle} />
      </FadeIn>

      <div className="mt-8 flex flex-wrap gap-2">
        {techFilters.map((item) => {
          const categoryColor = getFilterColor(item.id);
          const isActive = filter === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFilterChange(item.id)}
              aria-pressed={isActive}
              className={cn(
                "rounded-[var(--radius-badge)] border px-4 py-2 font-mono text-xs transition-all duration-350 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive &&
                  item.id === "all" &&
                  "border-primary-500 bg-primary-100 text-primary-700 dark:bg-primary/15 dark:text-primary-300",
                isActive && item.id !== "all" && "border-transparent text-white",
                !isActive &&
                  "border-border bg-card text-muted hover:border-primary-400/50",
              )}
              style={
                isActive && categoryColor
                  ? {
                      backgroundColor: categoryColor,
                      borderColor: categoryColor,
                      boxShadow: `0 4px 14px ${categoryColor}40`,
                    }
                  : undefined
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((tech, index) => (
            <motion.div
              key={`${filter}-${tech.id}`}
              layout={!prefersReducedMotion}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 14, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, y: -10, scale: 0.96 }
              }
              transition={{
                duration: MOTION_DURATION,
                ease: MOTION_EASE,
                delay: prefersReducedMotion ? 0 : Math.min(index * 0.03, 0.24),
              }}
              className="h-full min-w-0"
            >
              <KeyboardKey
                label={tech.name}
                description={tech.description}
                accentColor={getTechCategoryColor(tech.category)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
