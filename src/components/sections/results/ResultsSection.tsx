import { results } from "@/data/results";
import type { Result } from "@/types/result";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

interface ResultsSectionProps {
  data?: Result[];
}

export function ResultsSection({ data = results }: ResultsSectionProps) {
  return (
    <SectionWrapper id="resultados" ariaLabel="Resultados alcançados">
      <h2 className="text-3xl font-bold">Resultados Alcançados</h2>
      <p className="mt-2 text-muted">Impacto gerado em projetos reais.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {data.length === 0 ? (
          <Card className="md:col-span-2">
            <p className="text-muted">
              Adicione resultados em <code>src/data/results.ts</code>.
            </p>
          </Card>
        ) : (
          data.map((result) => (
            <Card key={result.id}>
              <p className="text-2xl font-bold text-primary">{result.metric}</p>
              <h3 className="mt-2 text-lg font-semibold">{result.title}</h3>
              <p className="mt-2 text-sm text-muted">{result.description}</p>
            </Card>
          ))
        )}
      </div>
    </SectionWrapper>
  );
}
