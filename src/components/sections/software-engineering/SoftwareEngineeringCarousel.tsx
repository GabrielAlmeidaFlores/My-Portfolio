import { useCallback, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProcessPipeline } from "@/types/processPipeline";
import { useTranslations } from "@/hooks/useTranslations";
import { formatTemplate } from "@/lib/formatTemplate";
import { PipelineFlow } from "@/components/ui/PipelineFlow";
import { CloudStackFlow } from "@/components/ui/CloudStackFlow";
import { SecurityShieldFlow } from "@/components/ui/SecurityShieldFlow";
import { ArchitectureBlueprintFlow } from "@/components/ui/ArchitectureBlueprintFlow";
import { DevOpsCycleFlow } from "@/components/ui/DevOpsCycleFlow";
import { cn } from "@/lib/cn";

interface SoftwareEngineeringCarouselProps {
  pipelines: ProcessPipeline[];
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

function PipelineSlide({ pipeline }: { pipeline: ProcessPipeline }) {
  if (pipeline.id === "cloud" && pipeline.layers) {
    return (
      <CloudStackFlow
        title={pipeline.title}
        description={pipeline.description}
        layers={pipeline.layers}
        className="h-full min-h-[480px]"
      />
    );
  }

  if (pipeline.id === "security" && pipeline.layers) {
    return (
      <SecurityShieldFlow
        title={pipeline.title}
        description={pipeline.description}
        layers={pipeline.layers}
        className="h-full min-h-[480px]"
      />
    );
  }

  if (pipeline.id === "architecture" && pipeline.blueprint) {
    return (
      <ArchitectureBlueprintFlow
        title={pipeline.title}
        description={pipeline.description}
        blueprint={pipeline.blueprint}
        className="h-full min-h-[480px]"
      />
    );
  }

  if (pipeline.id === "devops" && pipeline.cycle) {
    return (
      <DevOpsCycleFlow
        title={pipeline.title}
        description={pipeline.description}
        stages={pipeline.cycle}
        className="h-full min-h-[480px]"
      />
    );
  }

  return (
    <PipelineFlow
      title={pipeline.title}
      description={pipeline.description}
      steps={pipeline.steps}
      className="h-full min-h-[480px]"
    />
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

export function SoftwareEngineeringCarousel({
  pipelines,
}: SoftwareEngineeringCarouselProps) {
  const { copy } = useTranslations();
  const sectionCopy = copy.engineering;
  const carousel = copy.carousel;
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setIndex((prev) => {
        const next = prev + newDirection;
        if (next < 0) return pipelines.length - 1;
        if (next >= pipelines.length) return 0;
        return next;
      });
    },
    [pipelines.length],
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

  const currentPipeline = pipelines[index]!;

  return (
    <div
      className="relative mt-12 w-full"
      role="region"
      aria-roledescription="carrossel"
      aria-label={sectionCopy.title}
    >
      <CarouselNavButton
        direction="prev"
        label={carousel.previousTopic}
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:inline-flex"
      />
      <CarouselNavButton
        direction="next"
        label={carousel.nextTopic}
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-0 z-20 hidden translate-x-1/2 -translate-y-1/2 md:inline-flex"
      />

      <div className="relative overflow-hidden px-0 md:px-6">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentPipeline.id}
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
            <PipelineSlide pipeline={currentPipeline} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <CarouselNavButton
          direction="prev"
          label={carousel.previousTopic}
          onClick={() => paginate(-1)}
          className="md:hidden"
        />

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label={carousel.topics}
        >
          {pipelines.map((pipeline, pipelineIndex) => (
            <button
              key={pipeline.id}
              type="button"
              role="tab"
              aria-selected={pipelineIndex === index}
              aria-label={formatTemplate(carousel.topicAria, {
                title: pipeline.title,
                current: pipelineIndex + 1,
                total: pipelines.length,
              })}
              onClick={() => goTo(pipelineIndex)}
              className={cn(
                "h-2 rounded-full transition-all duration-350",
                pipelineIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/40",
              )}
            />
          ))}
        </div>

        <CarouselNavButton
          direction="next"
          label={carousel.nextTopic}
          onClick={() => paginate(1)}
          className="md:hidden"
        />
      </div>

      <p className="mt-3 text-center text-sm text-muted" aria-live="polite">
        <span className="font-semibold text-foreground">{currentPipeline.title}</span>
        {" · "}
        {index + 1} / {pipelines.length}
      </p>
    </div>
  );
}
