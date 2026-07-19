import { processSteps } from "@/data/processSteps";
import type { ProcessStep } from "@/types/processStep";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

interface WorkProcessSectionProps {
  data?: ProcessStep[];
}

export function WorkProcessSection({
  data = processSteps,
}: WorkProcessSectionProps) {
  return (
    <SectionWrapper id="processo" ariaLabel="Processo de trabalho">
      <h2 className="text-3xl font-bold">Processo de Trabalho</h2>
      <p className="mt-2 text-muted">Como conduzo projetos do início ao suporte.</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((step) => (
          <Card key={step.id}>
            <p className="text-sm font-medium text-primary">
              {String(step.step).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.description}</p>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
