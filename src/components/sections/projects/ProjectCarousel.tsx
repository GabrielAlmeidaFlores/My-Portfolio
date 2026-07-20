import { useCallback, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff, Search } from "lucide-react";
import type { Project } from "@/types/project";
import { useTranslations } from "@/hooks/useTranslations";
import { formatTemplate } from "@/lib/formatTemplate";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Badge } from "@/components/ui/Badge";
import { BodyText } from "@/components/ui/BodyText";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface ProjectCarouselProps {
  projects: Project[];
}

const SWIPE_THRESHOLD = 80;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 280 : -280,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 280 : -280,
    opacity: 0,
  }),
};

function ProjectMedia({
  image,
  videoUrl,
  embedUrl,
  demoUrl,
  title,
}: {
  image: string;
  videoUrl?: string;
  embedUrl?: string;
  demoUrl?: string;
  title: string;
}) {
  const { copy } = useTranslations();
  const [hasError, setHasError] = useState(false);
  const openUrl = demoUrl ?? embedUrl;

  if (embedUrl) {
    return (
      <>
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="pointer-events-none absolute inset-0 h-full w-full border-0 bg-hover"
          aria-hidden="true"
          tabIndex={-1}
        />
        {openUrl && (
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 flex items-end justify-center bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
            aria-label={`${copy.projects.openSite}: ${title}`}
          >
            <span className="mb-4 rounded-[var(--radius-badge)] border border-border bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-[var(--shadow-card)] backdrop-blur-md opacity-80 transition-opacity duration-350 group-hover:opacity-100 focus-visible:opacity-100">
              {copy.projects.openSite}
            </span>
          </a>
        )}
      </>
    );
  }

  if (videoUrl && !hasError) {
    return (
      <video
        src={videoUrl}
        className="absolute inset-0 h-full w-full object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={copy.projects.imagePlaceholder}
        onError={() => setHasError(true)}
      />
    );
  }

  if (!image || hasError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <ImageOff
          size={36}
          strokeWidth={1.5}
          className="text-muted"
          aria-hidden="true"
        />
        <p className="max-w-[16rem] text-sm text-muted">{copy.projects.noMedia}</p>
      </div>
    );
  }

  return (
    <>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background/95 via-background/35 to-transparent"
        aria-hidden="true"
      />
      {openUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 opacity-0 transition-opacity duration-350 group-hover:opacity-100 focus-within:opacity-100">
          <Button href={openUrl} variant="secondary" className="gap-2 leading-none">
            <Search className="size-4 shrink-0 translate-y-px" aria-hidden="true" />
            <span className="leading-none">{copy.projects.access}</span>
          </Button>
        </div>
      )}
    </>
  );
}

function ProjectSlide({ project }: { project: Project }) {
  const { copy } = useTranslations();
  const hasLinks = Boolean(project.githubUrl || project.demoUrl);

  return (
    <SpotlightCard className="group flex min-h-[420px] w-full min-w-0 flex-col overflow-hidden p-0 lg:grid lg:grid-cols-2">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-hover lg:aspect-auto lg:h-full lg:min-h-[420px]">
        <ProjectMedia
          image={project.image}
          videoUrl={project.videoUrl}
          embedUrl={project.embedUrl}
          demoUrl={project.demoUrl}
          title={project.title}
        />
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col justify-center p-7 lg:p-10">
        {project.isClientProject && (
          <Badge className="mb-3 w-fit">{copy.projects.clientProject}</Badge>
        )}
        <h3 className="text-safe w-full text-2xl font-bold lg:text-3xl">
          {project.title}
        </h3>
        <BodyText className="mt-3 flex-1 text-base">
          {project.shortDescription}
        </BodyText>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        {hasLinks && (
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            {project.githubUrl && (
              <Button href={project.githubUrl} variant="secondary">
                {copy.projects.github}
              </Button>
            )}
            {project.demoUrl && (
              <Button href={project.demoUrl} variant="ghost">
                {copy.projects.demo}
              </Button>
            )}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

function CarouselNavButton({
  direction,
  onClick,
  label,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-[var(--shadow-card)] backdrop-blur-md transition-all duration-350 hover:border-primary-500/40 hover:bg-hover hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const { copy } = useTranslations();
  const sectionCopy = copy.projects;
  const carousel = copy.carousel;
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setIndex((prev) => {
        const next = prev + newDirection;
        if (next < 0) return projects.length - 1;
        if (next >= projects.length) return 0;
        return next;
      });
    },
    [projects.length],
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

  const currentProject = projects[index]!;

  return (
    <div
      className="relative mt-12 w-full"
      role="region"
      aria-roledescription="carrossel"
      aria-label={sectionCopy.title}
    >
      <CarouselNavButton
        direction="prev"
        label={carousel.previousProject}
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:inline-flex"
      />
      <CarouselNavButton
        direction="next"
        label={carousel.nextProject}
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-0 z-20 hidden translate-x-1/2 -translate-y-1/2 md:inline-flex"
      />

      <div className="relative overflow-hidden px-0 md:px-6">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentProject.id}
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
            <ProjectSlide project={currentProject} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <CarouselNavButton
          direction="prev"
          label={carousel.previousProject}
          onClick={() => paginate(-1)}
          className="md:hidden"
        />

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label={carousel.projects}
        >
          {projects.map((project, projectIndex) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={projectIndex === index}
              aria-label={formatTemplate(carousel.projectAria, {
                title: project.title,
                current: projectIndex + 1,
                total: projects.length,
              })}
              onClick={() => goTo(projectIndex)}
              className={cn(
                "h-2 rounded-full transition-all duration-350",
                projectIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/40",
              )}
            />
          ))}
        </div>

        <CarouselNavButton
          direction="next"
          label={carousel.nextProject}
          onClick={() => paginate(1)}
          className="md:hidden"
        />
      </div>

      <p className="mt-3 text-center text-sm text-muted" aria-live="polite">
        {index + 1} / {projects.length}
      </p>
    </div>
  );
}
