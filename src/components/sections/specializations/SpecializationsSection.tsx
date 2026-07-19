import { specializations } from "@/data/specializations";
import type { Specialization } from "@/types/specialization";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";

interface SpecializationsSectionProps {
  data?: Specialization[];
}

export function SpecializationsSection({
  data = specializations,
}: SpecializationsSectionProps) {
  return (
    <SectionWrapper id="especialidades" ariaLabel="Minha especialidade">
      <FadeIn>
        <SectionTitle
          title="Minha Especialidade"
          subtitle="Áreas de atuação e stack principal de desenvolvimento."
        />
      </FadeIn>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.05}>
            <Card className="h-full">
              <h3 className="text-lg font-bold">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
              {item.skills && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              )}
            </Card>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
