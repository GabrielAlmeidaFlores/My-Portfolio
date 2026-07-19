import type { Testimonial } from "@/types/testimonial";
import { Card } from "@/components/ui/Card";
import { MonoText } from "@/components/ui/MonoText";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-hover text-xs text-muted">
          Foto
        </div>
        <div>
          <p className="font-bold">{testimonial.name}</p>
          <MonoText className="text-muted">
            {testimonial.role} — {testimonial.company}
          </MonoText>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            &ldquo;{testimonial.comment}&rdquo;
          </p>
          <p className="mt-3 text-primary" aria-label={`${testimonial.rating} estrelas`}>
            {"★".repeat(testimonial.rating)}
          </p>
        </div>
      </div>
    </Card>
  );
}
