import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMouseSpotlight } from "@/hooks/useMouseSpotlight";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className,
  onClick,
}: SpotlightCardProps) {
  const ref = useMouseSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "spotlight-card w-full min-w-0",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
