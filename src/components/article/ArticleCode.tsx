import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Highlight } from "prism-react-renderer";
import type { HTMLAttributes, ReactNode } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { copyToClipboard } from "@/lib/copyToClipboard";
import {
  articleCodeTheme,
  getCodeLanguageLabel,
  resolveCodeLanguage,
} from "@/lib/codeHighlight";
import { cn } from "@/lib/cn";

interface ArticleCodeProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  block?: boolean;
  language?: string;
}

export function ArticleCode({
  children,
  block = false,
  language,
  className,
  ...props
}: ArticleCodeProps) {
  const { copy } = useTranslations();
  const labels = copy.article;
  const [hasCopied, setHasCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        window.clearTimeout(copyTimer.current);
      }
    };
  }, []);

  if (block && typeof children === "string") {
    const code = children.replace(/\n$/, "");
    const resolvedLanguage = resolveCodeLanguage(code, language);
    const lineCount = code.split("\n").length;

    const handleCopy = async () => {
      const copied = await copyToClipboard(code);

      if (!copied) {
        return;
      }

      setHasCopied(true);

      if (copyTimer.current) {
        window.clearTimeout(copyTimer.current);
      }

      copyTimer.current = window.setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    };

    return (
      <div
        {...props}
        className={cn(
          "mb-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-hover/50 px-4 py-2">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-error" />
            <span className="size-2.5 rounded-full bg-warning" />
            <span className="size-2.5 rounded-full bg-success" />
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-medium tracking-wider text-muted uppercase">
              {getCodeLanguageLabel(resolvedLanguage)}
            </span>
            <button
              type="button"
              aria-label={
                hasCopied ? labels.copiedCode : labels.copyCodeAria
              }
              title={hasCopied ? labels.copiedCode : labels.copyCode}
              onClick={handleCopy}
              className={cn(
                "flex size-8 items-center justify-center rounded-md border border-border/70 bg-surface/70 text-muted transition-colors",
                "hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                hasCopied && "border-success/40 text-success",
              )}
            >
              {hasCopied ? (
                <Check size={15} aria-hidden="true" />
              ) : (
                <Copy size={15} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Highlight
          theme={articleCodeTheme}
          code={code}
          language={resolvedLanguage}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
              <code className="block min-w-max">
                {tokens.map((line, index) => {
                  const lineProps = getLineProps({ line });

                  return (
                    <span
                      key={index}
                      {...lineProps}
                      className={cn("flex", lineProps.className)}
                    >
                      {lineCount > 1 ? (
                        <span
                          aria-hidden="true"
                          className="w-8 shrink-0 select-none pr-4 text-right text-muted/60"
                        >
                          {index + 1}
                        </span>
                      ) : null}
                      <span className="whitespace-pre">
                        {line.length === 0
                          ? "\u200b"
                          : line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                      </span>
                    </span>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    );
  }

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
