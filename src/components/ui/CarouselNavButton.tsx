import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface CarouselNavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  className?: string;
}

export function CarouselNavButton({
  direction,
  onClick,
  label,
  className,
}: CarouselNavButtonProps) {
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
