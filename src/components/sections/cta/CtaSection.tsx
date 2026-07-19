import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

export function CtaSection() {
  const { copy, socialLinks } = useTranslations();

  return (
    <SectionWrapper id="cta" ariaLabel={copy.contact.ariaLabel} className="bg-card">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          {copy.contact.titleBefore}{" "}
          <span className="gradient-hero-text">{copy.contact.titleHighlight}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">{copy.contact.subtitle}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="#contato">{copy.hero.cta.contact}</Button>
          {socialLinks.map((link) => (
            <Button key={link.id} href={link.href} variant="secondary">
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
