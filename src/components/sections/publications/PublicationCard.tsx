import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LocalizedPublication } from "@/types/publication";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MonoText } from "@/components/ui/MonoText";

interface PublicationCardProps {
  publication: LocalizedPublication;
  index: number;
  readMoreLabel: string;
  publishedOnLabel: string;
  locale: string;
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
  index,
  readMoreLabel,
  publishedOnLabel,
  locale,
}: PublicationCardProps) {
  return (
    <FadeIn delay={index * 0.06}>
      <Link
        to={`/publicacoes/${publication.slug}`}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-[var(--radius-card)]"
      >
        <SpotlightCard className="flex h-full flex-col overflow-hidden p-0">
          <div className="aspect-[16/9] w-full overflow-hidden border-b border-border">
            <img
              src={publication.coverImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
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

            <p className="text-safe flex-1 text-sm leading-relaxed text-muted">
              {publication.summary}
            </p>

            <div className="flex flex-wrap gap-2">
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
    </FadeIn>
  );
}
