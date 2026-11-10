import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { FadeIn } from "@/components/ui/FadeIn";
import { PublicationCard } from "@/components/sections/publications/PublicationCard";
import { PublicationCarousel } from "@/components/sections/publications/PublicationCarousel";
import { formatTemplate } from "@/lib/formatTemplate";
import { cn } from "@/lib/cn";

const POSTS_PER_PAGE = 4;

export function PublicationsSection() {
  const { copy, publications, locale } = useTranslations();
  const sectionCopy = copy.publications;
  const prefersReducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(publications.length / POSTS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () =>
      publications.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE,
      ),
    [publications, currentPage],
  );
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }

    setPage(nextPage);
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  return (
    <SectionWrapper id="posts" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle
          title={sectionCopy.title}
          subtitle={sectionCopy.subtitle}
        />
      </FadeIn>

      <PublicationCarousel
        publications={publications}
        readMoreLabel={sectionCopy.readMore}
        publishedOnLabel={sectionCopy.publishedOn}
        locale={locale}
      />

      <div
        ref={gridRef}
        className="mt-12 hidden w-full scroll-mt-28 grid-cols-1 gap-6 md:grid md:grid-cols-2"
      >
        {pageItems.map((publication, index) => (
          <FadeIn
            key={`${currentPage}-${publication.id}`}
            delay={index * 0.06}
          >
            <PublicationCard
              publication={publication}
              readMoreLabel={sectionCopy.readMore}
              publishedOnLabel={sectionCopy.publishedOn}
              locale={locale}
            />
          </FadeIn>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-10 hidden md:block">
          <nav
            aria-label={sectionCopy.paginationAria}
            className="flex items-center justify-center gap-2"
          >
            <button
              type="button"
              aria-label={sectionCopy.previousPage}
              title={sectionCopy.previousPage}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={cn(
                "flex size-10 items-center justify-center rounded-[var(--radius-button)] border border-border bg-surface text-foreground transition-colors",
                "hover:border-primary-400 hover:text-primary-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:pointer-events-none disabled:opacity-40 dark:hover:text-primary-300",
              )}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>

            {pages.map((pageNumber) => {
              const isCurrent = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  aria-label={formatTemplate(sectionCopy.goToPage, {
                    page: pageNumber,
                  })}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => handlePageChange(pageNumber)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-[var(--radius-button)] border text-sm font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-foreground hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-300",
                  )}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              aria-label={sectionCopy.nextPage}
              title={sectionCopy.nextPage}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={cn(
                "flex size-10 items-center justify-center rounded-[var(--radius-button)] border border-border bg-surface text-foreground transition-colors",
                "hover:border-primary-400 hover:text-primary-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:pointer-events-none disabled:opacity-40 dark:hover:text-primary-300",
              )}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </nav>

          <p className="sr-only" aria-live="polite">
            {formatTemplate(sectionCopy.pageStatus, {
              current: currentPage,
              total: totalPages,
            })}
          </p>
        </div>
      ) : null}
    </SectionWrapper>
  );
}
