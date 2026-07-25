import type { ImgHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ArticleImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  caption?: ReactNode;
}

export function ArticleImg({
  src,
  alt,
  caption,
  className,
  loading = "lazy",
  decoding = "async",
  ...props
}: ArticleImgProps) {
  return (
    <figure className="my-8 w-full">
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={cn(
          "h-auto w-full rounded-[var(--radius-image)] border border-border object-cover",
          className,
        )}
        {...props}
      />
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
