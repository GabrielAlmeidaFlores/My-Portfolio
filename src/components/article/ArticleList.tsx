import type { HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

interface OrderedListProps extends OlHTMLAttributes<HTMLOListElement> {
  children: ReactNode;
}

interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  children: ReactNode;
}

export function ArticleUl({ children, className, ...props }: ListProps) {
  return (
    <ul
      className={cn(
        "mb-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export function ArticleOl({ children, className, ...props }: OrderedListProps) {
  return (
    <ol
      className={cn(
        "mb-4 list-decimal space-y-2 pl-6 text-base leading-relaxed text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </ol>
  );
}

export function ArticleLi({ children, className, ...props }: ListItemProps) {
  return (
    <li className={cn("pl-1", className)} {...props}>
      {children}
    </li>
  );
}
