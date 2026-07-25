import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ArticlePProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function ArticleP({ children, className, ...props }: ArticlePProps) {
  return (
    <p
      className={cn(
        "mb-4 text-base leading-relaxed text-article-body",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
