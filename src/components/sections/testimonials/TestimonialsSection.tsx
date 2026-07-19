import { useTranslations } from "@/hooks/useTranslations";
import { getInitials } from "@/lib/initials";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BodyText } from "@/components/ui/BodyText";
import { FadeIn } from "@/components/ui/FadeIn";
import { MonoText } from "@/components/ui/MonoText";

export function TestimonialsSection() {
  const { copy, testimonials } = useTranslations();
  const sectionCopy = copy.testimonials;

  return (
    <SectionWrapper id="depoimentos" ariaLabel={sectionCopy.ariaLabel}>
      <FadeIn>
        <SectionTitle title={sectionCopy.title} subtitle={sectionCopy.subtitle} />
      </FadeIn>

      <div className="mt-12 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.08}>
            <article className="glass-card flex h-full w-full min-w-0 flex-col p-8">
              <BodyText className="text-lg">
                &ldquo;{item.comment}&rdquo;
              </BodyText>
              <div className="mt-6 flex w-full items-center gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-hover font-mono text-xs font-semibold text-primary-500"
                  aria-hidden="true"
                >
                  {getInitials(item.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-safe font-bold">{item.name}</p>
                  <MonoText className="text-safe text-muted">
                    {item.company ? `${item.role} — ${item.company}` : item.role}
                  </MonoText>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
