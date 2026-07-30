import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPublicationBySlug } from "@/data/publications";
import { useArticleHeadings } from "@/hooks/useArticleHeadings";
import { useTranslations } from "@/hooks/useTranslations";
import { Article, ArticleTableOfContents } from "@/components/article";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { GridBackground } from "@/components/ui/GridBackground";
import { MonoText } from "@/components/ui/MonoText";

function formatPublishedDate(isoDate: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}

const publicationShellClassName =
  "publication-shell content-block relative z-10 isolate mx-auto w-full min-w-0 py-28 md:py-36";

export function PublicationPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { copy, locale } = useTranslations();
  const sectionCopy = copy.publications;
  const publication = getPublicationBySlug(slug, locale);
  const articleRef = useRef<HTMLElement>(null);
  const { headings, activeId } = useArticleHeadings(
    articleRef,
    `${slug}:${locale}`,
  );

  if (!publication) {
    return (
      <main className="relative isolate w-full overflow-x-hidden">
        <GridBackground />
        <div className={publicationShellClassName}>
          <FadeIn>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {sectionCopy.notFoundTitle}
            </h1>
            <p className="mt-4 w-full text-base text-muted">
              {sectionCopy.notFoundDescription}
            </p>
            <div className="mt-8">
              <Link
                to="/#posts"
                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-primary-500 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary-700 transition-all duration-350 ease-out hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-primary-300 dark:hover:bg-primary/10"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                {sectionCopy.backToList}
              </Link>
            </div>
          </FadeIn>
        </div>
      </main>
    );
  }

  const Content = publication.Content;

  return (
    <main className="relative isolate w-full overflow-x-hidden">
      <GridBackground />
      <div className={publicationShellClassName}>
        <div className="flex w-full min-w-0 flex-col">
          <FadeIn>
            <Link
              to="/#posts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-300 dark:hover:text-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {sectionCopy.backToList}
            </Link>
          </FadeIn>

          <FadeIn delay={0.06}>
            <header className="mt-8 w-full min-w-0">
              <MonoText className="text-primary-500">
                {sectionCopy.publishedOn}{" "}
                {formatPublishedDate(publication.publishedAt, locale)}
              </MonoText>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {publication.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-article-body sm:text-lg">
                {publication.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {publication.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </header>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-10 w-full min-w-0 overflow-hidden rounded-[var(--radius-image)] border border-border">
              <img
                src={publication.coverImage}
                alt=""
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
          </FadeIn>

          <div className="mt-12 w-full min-w-0">
            <Article ref={articleRef}>
              <Content />
            </Article>
          </div>
        </div>
      </div>

      <ArticleTableOfContents
        headings={headings}
        activeId={activeId}
        title={sectionCopy.tableOfContents}
        ariaLabel={sectionCopy.tableOfContentsAria}
      />
    </main>
  );
}
