import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { SoftwareEngineeringCarousel } from "@/components/sections/software-engineering/SoftwareEngineeringCarousel";
import { FadeIn } from "@/components/ui/FadeIn";

export function SoftwareEngineeringSection() {
  const { copy, softwarePipelines } = useTranslations();
  const sectionCopy = copy.engineering;

  return (
    <SectionWrapper id="engenharia" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle title={sectionCopy.title} subtitle={sectionCopy.subtitle} />
      </FadeIn>

      <FadeIn delay={0.08}>
        <SoftwareEngineeringCarousel pipelines={softwarePipelines} />
      </FadeIn>
    </SectionWrapper>
  );
}
