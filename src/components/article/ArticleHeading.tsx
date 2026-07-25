import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { getTextContent } from "@/lib/getTextContent";
import { slugify } from "@/lib/slugify";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

const headingScrollClassName = "scroll-mt-[var(--navbar-total-offset)]";

function resolveHeadingId(
  children: ReactNode,
  explicitId?: string,
): string | undefined {
  if (explicitId) {
    return explicitId;
  }

  const text = getTextContent(children).trim();
  if (!text) {
    return undefined;
  }

  const slug = slugify(text);
  return slug || undefined;
}

export function ArticleH2({
  children,
  className,
  id,
  ...props
}: HeadingProps) {
  return (
    <h2
      {...props}
      id={resolveHeadingId(children, id)}
      className={cn(
        "mt-10 mb-4 text-2xl font-bold tracking-tight text-foreground first:mt-0",
        headingScrollClassName,
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function ArticleH3({
  children,
  className,
  id,
  ...props
}: HeadingProps) {
  return (
    <h3
      {...props}
      id={resolveHeadingId(children, id)}
      className={cn(
        "mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground",
        headingScrollClassName,
        className,
      )}
    >
      {children}
    </h3>
  );
}
