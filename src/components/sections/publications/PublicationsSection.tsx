import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { FadeIn } from "@/components/ui/FadeIn";
import { PublicationCard } from "@/components/sections/publications/PublicationCard";
import { PublicationCarousel } from "@/components/sections/publications/PublicationCarousel";

export function PublicationsSection() {
  const { copy, publications, locale } = useTranslations();
  const sectionCopy = copy.publications;

  return (
    <SectionWrapper id="posts" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle
          title={sectionCopy.title}
          subtitle={sectionCopy.subtitle}
        />
      </FadeIn>

      <PublicationCarousel
        publications={publications}
        readMoreLabel={sectionCopy.readMore}
        publishedOnLabel={sectionCopy.publishedOn}
        locale={locale}
      />

      <div className="mt-12 hidden w-full grid-cols-1 gap-6 md:grid md:grid-cols-2">
        {publications.map((publication, index) => (
          <FadeIn key={publication.id} delay={index * 0.06}>
            <PublicationCard
              publication={publication}
              readMoreLabel={sectionCopy.readMore}
              publishedOnLabel={sectionCopy.publishedOn}
              locale={locale}
            />
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
