import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { FadeIn } from "@/components/ui/FadeIn";
import { PublicationCard } from "@/components/sections/publications/PublicationCard";

export function PublicationsSection() {
  const { copy, publications, locale } = useTranslations();
  const sectionCopy = copy.publications;

  return (
    <SectionWrapper id="publicacoes" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle
          title={sectionCopy.title}
          subtitle={sectionCopy.subtitle}
        />
      </FadeIn>

      <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {publications.map((publication, index) => (
          <PublicationCard
            key={publication.id}
            publication={publication}
            index={index}
            readMoreLabel={sectionCopy.readMore}
            publishedOnLabel={sectionCopy.publishedOn}
            locale={locale}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
