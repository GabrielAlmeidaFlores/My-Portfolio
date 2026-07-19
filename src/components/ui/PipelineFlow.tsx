import { useInView } from "react-intersection-observer";
import { BodyText } from "@/components/ui/BodyText";
import { cn } from "@/lib/cn";

interface PipelineStep {
  label: string;
}

interface PipelineFlowProps {
  title: string;
  description: string;
  steps: PipelineStep[];
  className?: string;
}

export function PipelineFlow({
  title,
  description,
  steps,
  className,
}: PipelineFlowProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className={cn("spotlight-card w-full p-7", className)}>
      <h3 className="text-safe w-full text-xl font-bold">{title}</h3>
      <BodyText className="mt-2 text-sm">{description}</BodyText>

      <div className="mt-8 flex flex-col items-center gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center">
            <div
              className={cn(
                "pipeline-node font-mono text-sm",
                inView && "pipeline-node-active",
              )}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "pipeline-connector",
                  inView && "pipeline-connector-active",
                )}
                style={{ transitionDelay: `${index * 200 + 100}ms` }}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
