import { useTranslations } from "@/hooks/useTranslations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BodyText } from "@/components/ui/BodyText";
import { FadeIn } from "@/components/ui/FadeIn";

export function ContactSection() {
  const { copy, contactOpportunities, socialLinks } = useTranslations();
  const sectionCopy = copy.contact;

  return (
    <SectionWrapper id="contato" ariaLabel={sectionCopy.ariaLabel}>
      <FadeIn>
        <div className="content-block mx-auto max-w-4xl py-[10vh] text-center">
          <p className="font-mono text-sm text-primary-500">{sectionCopy.eyebrow}</p>

          <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <h2 className="text-safe text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {sectionCopy.titleBefore}{" "}
              <span className="gradient-hero-text">{sectionCopy.titleHighlight}</span>
            </h2>
            <img
              src="/images/memoji-contact.png"
              alt=""
              aria-hidden="true"
              className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16"
              loading="lazy"
              decoding="async"
            />
          </div>

          <BodyText className="mt-6">{sectionCopy.subtitle}</BodyText>

          <ul className="mt-8 flex w-full flex-wrap justify-center gap-2">
            {contactOpportunities.map((opportunity) => (
              <li key={opportunity}>
                <Badge mono={false}>{opportunity}</Badge>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex w-full flex-wrap justify-center gap-4">
            {socialLinks.map((link) => (
              <Button key={link.id} href={link.href} variant="hero">
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
