import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MonoTextProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div";
}

export function MonoText({
  children,
  className,
  as: Component = "span",
}: MonoTextProps) {
  return (
    <Component className={cn("font-mono text-sm", className)}>
      {children}
    </Component>
  );
}
