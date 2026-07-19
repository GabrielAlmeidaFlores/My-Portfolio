import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  mono?: boolean;
}

export function Badge({ children, className, mono = true }: BadgeProps) {
  return (
    <span
      className={cn(
        mono ? "badge-tech" : "inline-flex items-center rounded-[var(--radius-badge)] border border-border bg-hover px-4 py-2 text-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
