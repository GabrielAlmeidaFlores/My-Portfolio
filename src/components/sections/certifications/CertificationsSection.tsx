import { awsCertifications, otherCertifications } from "@/data/certifications";
import type { Certification } from "@/types/certification";
import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MonoText } from "@/components/ui/MonoText";
import { FadeIn } from "@/components/ui/FadeIn";
import { BrandIcon } from "@/components/ui/BrandIcon";

function CertificationCard({
  cert,
  index,
  badgeLabel,
}: {
  cert: Certification;
  index: number;
  badgeLabel: string;
}) {
  return (
    <FadeIn delay={index * 0.06}>
      <SpotlightCard className="flex h-full min-h-[132px] w-full items-center gap-5 p-7">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-border/60 bg-card shadow-[var(--shadow-card)]">
          <BrandIcon brand={cert.brand} size={30} />
        </div>
        <div className="min-w-0 flex-1">
          <MonoText className="text-primary-500">{cert.year}</MonoText>
          <h3 className="text-safe mt-1 w-full text-lg font-bold">{cert.name}</h3>
          <p className="text-safe mt-1 text-sm text-muted">{badgeLabel}</p>
        </div>
      </SpotlightCard>
    </FadeIn>
  );
}

export function CertificationsSection() {
  const { copy } = useTranslations();
  const sectionCopy = copy.certifications;

  return (
    <SectionWrapper id="certificacoes" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle title={sectionCopy.title} subtitle={sectionCopy.subtitle} />
      </FadeIn>

      <div className="mt-12 flex w-full flex-col gap-4">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {awsCertifications.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index}
              badgeLabel={sectionCopy.badge}
            />
          ))}
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {otherCertifications.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index + awsCertifications.length}
              badgeLabel={sectionCopy.badge}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
