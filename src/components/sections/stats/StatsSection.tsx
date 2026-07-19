import { useTranslations } from "@/hooks/useTranslations";
import type { Stat } from "@/types/stat";
import { useCounter } from "@/hooks/useCounter";
import { useInView } from "@/hooks/useInView";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

interface StatItemProps {
  stat: Stat;
  isActive: boolean;
}

function StatItem({ stat, isActive }: StatItemProps) {
  const count = useCounter(stat.value, isActive);

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <p className="text-3xl font-bold">
        {count}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-muted">{stat.label}</p>
    </div>
  );
}

interface StatsSectionProps {
  data?: Stat[];
}

export function StatsSection({ data }: StatsSectionProps) {
  const { ref, isInView } = useInView();
  const { stats, copy } = useTranslations();
  const items = data ?? stats;

  return (
    <SectionWrapper id="estatisticas" ariaLabel={copy.about.stats.title}>
      <div ref={ref}>
        <h2 className="text-center text-3xl font-bold">{copy.about.stats.title}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((stat) => (
            <StatItem key={stat.label} stat={stat} isActive={isInView} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
