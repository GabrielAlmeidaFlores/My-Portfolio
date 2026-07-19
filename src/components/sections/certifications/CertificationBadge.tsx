import type { Certification } from "@/types/certification";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MonoText } from "@/components/ui/MonoText";

interface CertificationBadgeProps {
  certification: Certification;
}

export function CertificationBadge({ certification }: CertificationBadgeProps) {
  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-border/60 bg-card shadow-[var(--shadow-card)]">
        <BrandIcon brand={certification.brand} size={28} />
      </div>

      <div className="flex-1">
        <MonoText className="text-primary">{certification.year}</MonoText>
        <h3 className="mt-1 text-lg font-bold">{certification.name}</h3>
        <p className="mt-1 text-sm text-muted">Certificação profissional</p>
      </div>

      {certification.certificateUrl && (
        <Button href={certification.certificateUrl} variant="secondary">
          Ver Credencial
        </Button>
      )}
    </Card>
  );
}
