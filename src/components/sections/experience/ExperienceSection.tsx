import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GridBackground } from "@/components/ui/GridBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Badge } from "@/components/ui/Badge";
import { MonoText } from "@/components/ui/MonoText";
import { FadeIn } from "@/components/ui/FadeIn";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { copy, experiences } = useTranslations();
  const sectionCopy = copy.experience;

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: line.parentElement,
          start: "top 70%",
          end: "bottom 40%",
          scrub: 1,
        },
      },
    );
  }, []);

  return (
    <SectionWrapper id="experiencia" ariaLabel={sectionCopy.ariaLabel}>
      <GridBackground />
      <FadeIn>
        <SectionTitle title={sectionCopy.title} subtitle={sectionCopy.subtitle} />
      </FadeIn>

      <div className="relative mt-14 pl-10">
        <div
          ref={lineRef}
          className="absolute top-0 left-3 h-full w-0.5 origin-top gradient-hero-bg"
          aria-hidden="true"
        />

        <div className="space-y-10">
          {experiences.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.08}>
              <div className="relative">
                <div className="timeline-dot absolute -left-10 top-6" />
                <SpotlightCard className="w-full p-7">
                  <MonoText className="text-primary-500">{item.period}</MonoText>
                  <h3 className="text-safe mt-2 w-full text-2xl font-bold">{item.role}</h3>
                  <p className="text-safe text-lg text-muted">{item.company}</p>
                  <p className="text-safe mt-5 text-sm font-semibold">
                    {item.responsibilitiesLabel}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.responsibilities.map((r) => (
                      <Badge key={r}>{r}</Badge>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
