import type { ReactNode, TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ArticleTableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  caption?: string;
  className?: string;
}

export function ArticleTable({
  children,
  caption,
  className,
  ...props
}: ArticleTableProps) {
  return (
    <div className="my-6 w-full min-w-0 overflow-x-auto rounded-[var(--radius-card)] border border-border">
      <table
        className={cn(
          "w-full min-w-[36rem] border-collapse text-left text-sm text-article-body",
          className,
        )}
        {...props}
      >
        {caption ? (
          <caption className="border-b border-border bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">
            {caption}
          </caption>
        ) : null}
        {children}
      </table>
    </div>
  );
}

export function ArticleThead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <thead className={cn("bg-surface text-foreground", className)}>
      {children}
    </thead>
  );
}

export function ArticleTbody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <tbody className={className}>{children}</tbody>;
}

export function ArticleTr({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("border-t border-border align-top", className)}>
      {children}
    </tr>
  );
}

export function ArticleTh({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 font-semibold whitespace-nowrap text-foreground",
        className,
      )}
      scope="col"
    >
      {children}
    </th>
  );
}

export function ArticleTd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3", className)}>{children}</td>;
}
