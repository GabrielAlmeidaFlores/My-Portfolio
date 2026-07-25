import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function ArticleH2({ children, className, ...props }: HeadingProps) {
  return (
    <h2
      className={cn(
        "mt-10 mb-4 text-2xl font-bold tracking-tight text-foreground first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function ArticleH3({ children, className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn(
        "mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
