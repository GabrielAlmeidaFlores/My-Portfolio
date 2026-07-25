import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ArticleCodeProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  block?: boolean;
}

export function ArticleCode({
  children,
  block = false,
  className,
  ...props
}: ArticleCodeProps) {
  if (block) {
    return (
      <pre
        className={cn(
          "mb-6 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface p-4 font-mono text-sm leading-relaxed text-foreground",
          className,
        )}
      >
        <code {...props}>{children}</code>
      </pre>
    );
  }

  return (
    <code
      className={cn(
        "rounded-md border border-border bg-hover px-1.5 py-0.5 font-mono text-[0.9em] text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
