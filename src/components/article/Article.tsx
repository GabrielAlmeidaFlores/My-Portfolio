import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ArticleProps {
  children: ReactNode;
  className?: string;
}

export function Article({ children, className }: ArticleProps) {
  return (
    <article className={cn("article-prose w-full min-w-0", className)}>
      {children}
    </article>
  );
}
