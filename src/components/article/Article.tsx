import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ArticleProps {
  children: ReactNode;
  className?: string;
}

export const Article = forwardRef<HTMLElement, ArticleProps>(
  function Article({ children, className }, ref) {
    return (
      <article
        ref={ref}
        className={cn("article-prose w-full min-w-0", className)}
      >
        {children}
      </article>
    );
  },
);
