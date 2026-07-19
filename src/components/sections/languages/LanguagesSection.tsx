import { languages } from "@/data/languages";
import type { Language } from "@/types/language";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { MonoText } from "@/components/ui/MonoText";

interface LanguagesSectionProps {
  data?: Language[];
}

export function LanguagesSection({ data = languages }: LanguagesSectionProps) {
  return (
    <SectionWrapper id="idiomas" ariaLabel="Idiomas">
      <FadeIn>
        <SectionTitle title="Idiomas" />
      </FadeIn>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {data.map((language, index) => (
          <FadeIn key={language.id} delay={index * 0.08}>
            <Card className="flex items-center gap-5">
              <span className="text-4xl" aria-hidden="true">
                {language.flag}
              </span>
              <div>
                <p className="text-lg font-bold">{language.name}</p>
                <MonoText className="text-muted">{language.level}</MonoText>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
