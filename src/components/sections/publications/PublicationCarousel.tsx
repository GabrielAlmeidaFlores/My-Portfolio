import { useCallback, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import type { LocalizedPublication } from "@/types/publication";
import { useTranslations } from "@/hooks/useTranslations";
import { formatTemplate } from "@/lib/formatTemplate";
import { CarouselNavButton } from "@/components/ui/CarouselNavButton";
import { PublicationCard } from "@/components/sections/publications/PublicationCard";
import { cn } from "@/lib/cn";

interface PublicationCarouselProps {
  publications: LocalizedPublication[];
  readMoreLabel: string;
  publishedOnLabel: string;
  locale: string;
}

const SWIPE_THRESHOLD = 80;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function PublicationCarousel({
  publications,
  readMoreLabel,
  publishedOnLabel,
  locale,
}: PublicationCarouselProps) {
  const { copy } = useTranslations();
  const sectionCopy = copy.publications;
  const carousel = copy.carousel;
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setIndex((prev) => {
        const next = prev + newDirection;
        if (next < 0) return publications.length - 1;
        if (next >= publications.length) return 0;
        return next;
      });
    },
    [publications.length],
  );

  const goTo = useCallback(
    (targetIndex: number) => {
      setDirection(targetIndex > index ? 1 : -1);
      setIndex(targetIndex);
    },
    [index],
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
  };

  const currentPublication = publications[index]!;

  return (
    <div
      className="carousel-bleed mt-12 md:hidden"
      role="region"
      aria-roledescription="carrossel"
      aria-label={sectionCopy.title}
    >
      <div className="relative">
        <CarouselNavButton
          direction="prev"
          label={carousel.previousPublication}
          onClick={() => paginate(-1)}
          className="carousel-bleed-arrow-prev absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        />
        <CarouselNavButton
          direction="next"
          label={carousel.nextPublication}
          onClick={() => paginate(1)}
          className="carousel-bleed-arrow-next absolute top-1/2 z-20 translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative grid py-2">
          {publications.map((publication) => (
            <div
              key={`measure-${publication.id}`}
              className="carousel-bleed-inset pointer-events-none invisible col-start-1 row-start-1"
              aria-hidden="true"
            >
              <PublicationCard
                publication={publication}
                readMoreLabel={readMoreLabel}
                publishedOnLabel={publishedOnLabel}
                locale={locale}
              />
            </div>
          ))}

          <div className="relative z-10 col-start-1 row-start-1">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentPublication.id}
                custom={direction}
                variants={prefersReducedMotion ? undefined : slideVariants}
                initial={prefersReducedMotion ? false : "enter"}
                animate="center"
                exit={prefersReducedMotion ? undefined : "exit"}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                drag={prefersReducedMotion ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
                className="w-full touch-pan-y"
              >
                <div className="carousel-bleed-inset">
                  <PublicationCard
                    publication={currentPublication}
                    readMoreLabel={readMoreLabel}
                    publishedOnLabel={publishedOnLabel}
                    locale={locale}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <CarouselNavButton
          direction="prev"
          label={carousel.previousPublication}
          onClick={() => paginate(-1)}
        />

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label={carousel.publications}
        >
          {publications.map((publication, publicationIndex) => (
            <button
              key={publication.id}
              type="button"
              role="tab"
              aria-selected={publicationIndex === index}
              aria-label={formatTemplate(carousel.publicationAria, {
                title: publication.title,
                current: publicationIndex + 1,
                total: publications.length,
              })}
              onClick={() => goTo(publicationIndex)}
              className={cn(
                "h-2 rounded-full transition-all duration-350",
                publicationIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/40",
              )}
            />
          ))}
        </div>

        <CarouselNavButton
          direction="next"
          label={carousel.nextPublication}
          onClick={() => paginate(1)}
        />
      </div>

      <p className="mt-3 text-center text-sm text-muted" aria-live="polite">
        {index + 1} / {publications.length}
      </p>
    </div>
  );
}
