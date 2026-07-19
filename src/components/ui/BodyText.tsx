import { cn } from "@/lib/cn";

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "div" | "span";
}

export function BodyText({ children, className, as: Tag = "p" }: BodyTextProps) {
  return (
    <Tag
      className={cn(
        "text-safe block w-full min-w-0 text-base leading-7 text-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
