import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectCarousel } from "@/components/sections/projects/ProjectCarousel";

export function ProjectsSection() {
  const { copy, projects } = useTranslations();
  const sectionCopy = copy.projects;

  return (
    <SectionWrapper id="projetos" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle title={sectionCopy.title} subtitle={sectionCopy.subtitle} />
      </FadeIn>

      <FadeIn delay={0.08}>
        <ProjectCarousel projects={projects} />
      </FadeIn>
    </SectionWrapper>
  );
}
