import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionWrapperProps {
  id: string;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  background?: ReactNode;
}

export function SectionWrapper({
  id,
  ariaLabel,
  children,
  className,
  fullWidth = false,
  background,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("relative isolate section-spacing w-full min-w-0 overflow-hidden", className)}
    >
      {background}
      {fullWidth ? (
        children
      ) : (
        <div className="container-app content-block relative z-10 isolate">{children}</div>
      )}
    </section>
  );
}
