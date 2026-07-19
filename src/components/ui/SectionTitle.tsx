import { BodyText } from "@/components/ui/BodyText";
import { cn } from "@/lib/cn";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0",
        align === "center" && "text-center",
        className,
      )}
    >
      <h2 className="text-safe w-full text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <BodyText as="p" className={cn("mt-3", align === "center" && "mx-auto")}>
          {subtitle}
        </BodyText>
      )}
    </div>
  );
}
