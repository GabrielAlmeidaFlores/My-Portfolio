import { cn } from "@/lib/cn";

interface GridBackgroundProps {
  className?: string;
}

export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid-bg pointer-events-none absolute inset-0 z-0", className)}
    />
  );
}
