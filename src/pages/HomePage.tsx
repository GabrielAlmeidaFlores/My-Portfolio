import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CertificationsSection } from "@/components/sections/certifications/CertificationsSection";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { EducationSection } from "@/components/sections/education/EducationSection";
import { ExperienceSection } from "@/components/sections/experience/ExperienceSection";
import { HeroSection } from "@/components/sections/hero/HeroSection";
import { ProjectsSection } from "@/components/sections/projects/ProjectsSection";
import { PublicationsSection } from "@/components/sections/publications/PublicationsSection";
import { SoftwareEngineeringSection } from "@/components/sections/software-engineering/SoftwareEngineeringSection";
import { TechnologiesSection } from "@/components/sections/technologies/TechnologiesSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function HomePage() {
  const location = useLocation();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.slice(1);
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    scrollTo(element, {
      immediate: prefersReducedMotion,
    });
  }, [location.hash, scrollTo]);

  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <TechnologiesSection />
      <CertificationsSection />
      <EducationSection />
      <PublicationsSection />
      <SoftwareEngineeringSection />
      <ContactSection />
    </main>
  );
}
