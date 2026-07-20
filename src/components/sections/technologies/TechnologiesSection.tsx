import { useCallback, useState } from "react";
import { certifications } from "@/data/certifications";
import type { TechFilter, Technology } from "@/types/technology";
import {
  getTechCategoryColor,
  getTechCategoryLabel,
} from "@/lib/techCategories";
import { useModal } from "@/hooks/useModal";
import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { KeyboardKey } from "@/components/ui/KeyboardKey";
import { BodyText } from "@/components/ui/BodyText";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

function getFilterColor(filter: TechFilter): string | undefined {
  if (filter === "all") return undefined;
  return getTechCategoryColor(filter);
}

export function TechnologiesSection() {
  const [filter, setFilter] = useState<TechFilter>("all");
  const [selected, setSelected] = useState<Technology | null>(null);
  const {
    locale,
    copy,
    technologies,
    techFilters,
    projects,
    experiences,
  } = useTranslations();
  const sectionCopy = copy.technologies;

  const closeModal = useCallback(() => setSelected(null), []);
  useModal(selected !== null, closeModal);

  const filtered =
    filter === "all"
      ? technologies.filter((tech) => tech.isFeatured)
      : technologies.filter((tech) => tech.category === filter);

  const selectedCategoryColor = selected
    ? getTechCategoryColor(selected.category)
    : undefined;

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
              onClick={() => setFilter(item.id)}
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

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((tech) => (
          <KeyboardKey
            key={tech.id}
            label={tech.name}
            description={tech.description}
            accentColor={getTechCategoryColor(tech.category)}
            active={selected?.id === tech.id}
            onClick={() => setSelected(tech)}
          />
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm dark:bg-background/70"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tech-modal-title"
        >
          <div
            className="glass-card content-block max-h-[85vh] w-full max-w-lg overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
            style={
              selectedCategoryColor
                ? {
                    boxShadow: `var(--shadow-card-active), 0 0 40px ${selectedCategoryColor}20`,
                  }
                : undefined
            }
          >
            <p
              className="font-mono text-sm font-medium"
              style={{ color: selectedCategoryColor }}
            >
              {getTechCategoryLabel(selected.category, locale)}
            </p>
            <h3
              id="tech-modal-title"
              className="text-safe mt-2 w-full text-2xl font-bold"
            >
              {selected.name}
            </h3>
            <BodyText className="mt-3">{selected.description}</BodyText>

            {selected.relatedProjects.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold">
                  {sectionCopy.modal.relatedProjects}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {selected.relatedProjects.map((id) => {
                    const project = projects.find((p) => p.id === id);
                    return <li key={id}>• {project?.title ?? id}</li>;
                  })}
                </ul>
              </div>
            )}

            {selected.relatedCertifications.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold">
                  {sectionCopy.modal.certifications}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {selected.relatedCertifications.map((id) => {
                    const cert = certifications.find((c) => c.id === id);
                    return <li key={id}>• {cert?.name ?? id}</li>;
                  })}
                </ul>
              </div>
            )}

            {selected.relatedExperiences.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold">
                  {sectionCopy.modal.experiences}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {selected.relatedExperiences.map((id) => {
                    const exp = experiences.find((e) => e.id === id);
                    return (
                      <li key={id}>
                        • {exp ? `${exp.role} — ${exp.company}` : id}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={closeModal}
              className="mt-6 font-mono text-sm text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              style={
                selectedCategoryColor
                  ? { color: selectedCategoryColor }
                  : undefined
              }
            >
              {sectionCopy.modal.close} ×
            </button>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
