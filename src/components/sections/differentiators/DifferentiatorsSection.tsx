import { differentiators } from "@/data/differentiators";
import type { Differentiator } from "@/types/differentiator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";

interface DifferentiatorsSectionProps {
  data?: Differentiator[];
}

export function DifferentiatorsSection({
  data = differentiators,
}: DifferentiatorsSectionProps) {
  return (
    <SectionWrapper id="diferenciais" ariaLabel="Diferenciais">
      <FadeIn>
        <SectionTitle
          title="Diferenciais"
          subtitle="Competências que destacam minha atuação técnica e de liderança."
        />
      </FadeIn>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.04}>
            <Card className="text-center">
              <p className="font-semibold">{item.title}</p>
            </Card>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
