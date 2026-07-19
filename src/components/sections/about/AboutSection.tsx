import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { specializations } from "@/data/specializations";
import { useTranslations } from "@/hooks/useTranslations";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BodyText } from "@/components/ui/BodyText";
import { GridBackground } from "@/components/ui/GridBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BentoGrid, BentoItem } from "@/components/ui/BentoGrid";
import { useCounter } from "@/hooks/useCounter";
import { useInView } from "@/hooks/useInView";
import { MonoText } from "@/components/ui/MonoText";

gsap.registerPlugin(ScrollTrigger);

function StatBento({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, isInView } = useInView();
  const count = useCounter(value, isInView);

  return (
    <div ref={ref} className="w-full">
      <SpotlightCard className="flex h-full flex-col justify-center p-7 text-center">
        <p className="font-mono text-5xl font-bold text-primary-500 sm:text-6xl">
          {count}
          {suffix}
        </p>
        <p className="text-safe mt-2 text-sm text-muted">{label}</p>
      </SpotlightCard>
    </div>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const { copy, profile, aboutValues, stats } = useTranslations();
  const sectionCopy = copy.about;

  useEffect(() => {
    const section = sectionRef.current;
    const panels = panelsRef.current;
    if (!section || !panels) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || window.innerWidth < 1024) return;

    const panelItems = panels.querySelectorAll("[data-panel]");

    const ctx = gsap.context(() => {
      gsap.to(panelItems, {
        yPercent: -100 * (panelItems.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${panelItems.length * window.innerHeight * 0.7}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const panels = [
    {
      id: "photo",
      content: (
        <div className="w-full">
          <SpotlightCard className="mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center">
            <span className="text-muted">{sectionCopy.photoAlt}</span>
          </SpotlightCard>
        </div>
      ),
    },
    {
      id: "summary",
      content: (
        <div className="w-full">
          <SectionTitle title={sectionCopy.title} subtitle={profile.aboutTitle} />
          <div className="mt-8 space-y-4">
            {profile.aboutParagraphs.map((paragraph) => (
              <BodyText key={paragraph}>{paragraph}</BodyText>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "values",
      content: (
        <div className="w-full">
          <SectionTitle title={sectionCopy.values.title} subtitle={sectionCopy.values.subtitle} />
          <div className="mt-8 flex flex-wrap gap-3">
            {aboutValues.map((value) => (
              <span key={value} className="badge-tech">
                {value}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "specialties",
      content: (
        <div className="w-full">
          <SectionTitle
            title={sectionCopy.specialties.title}
            subtitle={sectionCopy.specialties.subtitle}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {specializations.slice(0, 4).map((item) => (
              <SpotlightCard key={item.id} className="w-full p-5">
                <h3 className="text-safe w-full font-bold">{item.title}</h3>
                {item.description && (
                  <BodyText className="mt-2 text-sm">{item.description}</BodyText>
                )}
              </SpotlightCard>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "stats",
      content: (
        <div className="w-full">
          <SectionTitle title={sectionCopy.stats.title} subtitle={sectionCopy.stats.subtitle} />
          <BentoGrid className="mt-8">
            {stats.slice(0, 4).map((stat) => (
              <BentoItem key={stat.label}>
                <StatBento
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </BentoItem>
            ))}
          </BentoGrid>
        </div>
      ),
    },
  ];

  return (
    <section
      id="sobre-mim"
      ref={sectionRef}
      aria-label={sectionCopy.title}
      className="relative w-full overflow-x-hidden section-spacing"
    >
      <GridBackground />

      {/* Mobile e tablet: scroll normal, largura total */}
      <div className="container-app w-full lg:hidden">
        <SectionTitle title={sectionCopy.title} subtitle={profile.aboutTitle} />
        <div className="mt-8 space-y-4">
          {profile.aboutParagraphs.map((paragraph) => (
            <BodyText key={paragraph}>{paragraph}</BodyText>
          ))}
        </div>

        <div className="mt-12 space-y-12">
          {panels.slice(1).map((panel) => (
            <div key={panel.id} className="w-full">
              {panel.content}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: storytelling sticky */}
      <div className="relative hidden w-full lg:block">
        <div className="relative h-screen w-full overflow-hidden">
          <div ref={panelsRef} className="h-full w-full">
            {panels.map((panel) => (
              <div
                key={panel.id}
                data-panel
                className="flex h-screen w-full min-w-full items-center"
              >
                <div className="container-app w-full min-w-0">{panel.content}</div>
              </div>
            ))}
          </div>
        </div>
        <MonoText className="absolute right-8 bottom-8 text-muted">
          {sectionCopy.scrollHint}
        </MonoText>
      </div>
    </section>
  );
}
