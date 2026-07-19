import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full min-w-0 auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  span?: "1" | "2" | "3" | "row-2";
}

const spanClasses: Record<NonNullable<BentoItemProps["span"]>, string> = {
  "1": "",
  "2": "md:col-span-2",
  "3": "lg:col-span-3",
  "row-2": "md:row-span-2",
};

export function BentoItem({ children, className, span = "1" }: BentoItemProps) {
  return (
    <div className={cn("min-w-0 w-full", spanClasses[span], className)}>{children}</div>
  );
}
