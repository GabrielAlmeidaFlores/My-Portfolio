import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div className={cn(hover ? "card-elevated" : "rounded-[var(--radius-card)] border border-border bg-card p-7 shadow-[var(--shadow-card)]", className)}>
      {children}
    </div>
  );
}
