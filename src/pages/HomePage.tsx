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

export function HomePage() {
  const location = useLocation();

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

    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [location.hash]);

  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <TechnologiesSection />
      <SoftwareEngineeringSection />
      <CertificationsSection />
      <EducationSection />
      <PublicationsSection />
      <ContactSection />
    </main>
  );
}
