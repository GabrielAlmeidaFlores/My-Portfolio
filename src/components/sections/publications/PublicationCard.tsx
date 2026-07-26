import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LocalizedPublication } from "@/types/publication";
import { Badge } from "@/components/ui/Badge";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MonoText } from "@/components/ui/MonoText";
import { cn } from "@/lib/cn";

interface PublicationCardProps {
  publication: LocalizedPublication;
  readMoreLabel: string;
  publishedOnLabel: string;
  locale: string;
  className?: string;
}

function formatPublishedDate(isoDate: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}

export function PublicationCard({
  publication,
  readMoreLabel,
  publishedOnLabel,
  locale,
  className,
}: PublicationCardProps) {
  return (
    <Link
      to={`/publicacoes/${publication.slug}`}
      className={cn(
        "block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-[var(--radius-card)]",
        className,
      )}
    >
      <SpotlightCard className="group flex h-full flex-col overflow-hidden p-0">
        <div className="aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-border">
          <img
            src={publication.coverImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <MonoText className="text-primary-500">
            {publishedOnLabel}{" "}
            {formatPublishedDate(publication.publishedAt, locale)}
          </MonoText>

          <h3 className="text-safe text-xl font-bold text-foreground">
            {publication.title}
          </h3>

          <p className="text-safe text-sm leading-relaxed text-muted">
            {publication.summary}
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            {publication.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-300">
            {readMoreLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </SpotlightCard>
    </Link>
  );
}
