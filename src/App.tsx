import { useCursorGlow } from "@/hooks/useCursorGlow";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { CertificationsSection } from "@/components/sections/certifications/CertificationsSection";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { EducationSection } from "@/components/sections/education/EducationSection";
import { ExperienceSection } from "@/components/sections/experience/ExperienceSection";
import { HeroSection } from "@/components/sections/hero/HeroSection";
import { ProjectsSection } from "@/components/sections/projects/ProjectsSection";
import { SoftwareEngineeringSection } from "@/components/sections/software-engineering/SoftwareEngineeringSection";
import { TechnologiesSection } from "@/components/sections/technologies/TechnologiesSection";
// import { TestimonialsSection } from "@/components/sections/testimonials/TestimonialsSection";

export function App() {
  useCursorGlow();

  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <Header />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <TechnologiesSection />
        <SoftwareEngineeringSection />
        <CertificationsSection />
        <EducationSection />
        {/* <TestimonialsSection /> */}
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </SmoothScrollProvider>
  );
}
