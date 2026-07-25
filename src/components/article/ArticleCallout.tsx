import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CalloutVariant = "note" | "tip" | "warning";

interface ArticleCalloutProps {
  children: ReactNode;
  title: string;
  variant?: CalloutVariant;
  className?: string;
}

const variantClasses: Record<CalloutVariant, string> = {
  note: "border-primary-300 bg-primary-100/60 dark:border-primary-700 dark:bg-primary-900/30",
  tip: "border-secondary-500/40 bg-secondary-500/10 dark:border-secondary-600/50 dark:bg-secondary-700/20",
  warning:
    "border-warning/40 bg-warning/10 dark:border-warning/50 dark:bg-warning/15",
};

export function ArticleCallout({
  children,
  title,
  variant = "note",
  className,
}: ArticleCalloutProps) {
  return (
    <aside
      className={cn(
        "my-6 rounded-[var(--radius-card)] border px-5 py-4",
        variantClasses[variant],
        className,
      )}
    >
      <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
      <div className="text-sm leading-relaxed text-muted [&_p]:mb-0">
        {children}
      </div>
    </aside>
  );
}
