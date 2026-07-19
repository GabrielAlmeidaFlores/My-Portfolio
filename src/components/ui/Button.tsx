import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { getExternalLinkProps } from "@/lib/externalLink";

type ButtonVariant = "primary" | "secondary" | "ghost" | "cta" | "hero";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  download?: boolean | string;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-700 text-primary-foreground shadow-[var(--shadow-primary)] hover:bg-primary-600 active:bg-primary-800",
  secondary:
    "border border-primary-500 bg-transparent text-primary-700 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary/10",
  ghost: "text-foreground hover:bg-hover",
  hero: "gradient-hero-bg text-primary-foreground shadow-[var(--shadow-primary)] hover:brightness-110",
  cta: "gradient-cta-bg text-primary-foreground shadow-[var(--shadow-primary)] hover:brightness-110",
};

export function Button({
  children,
  className,
  variant = "primary",
  href,
  download,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold transition-all duration-350 ease-out",
    focusRing,
    variantClasses[variant],
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        download={download}
        {...getExternalLinkProps(href)}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
