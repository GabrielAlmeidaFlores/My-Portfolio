import type { CSSProperties } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/cn";
import { useMouseSpotlight } from "@/hooks/useMouseSpotlight";

interface KeyboardKeyProps {
  label: string;
  description?: string;
  active?: boolean;
  accentColor?: string;
  onClick?: () => void;
  className?: string;
}

export function KeyboardKey({
  label,
  description,
  active = false,
  accentColor,
  onClick,
  className,
}: KeyboardKeyProps) {
  const ref = useMouseSpotlight<HTMLButtonElement>();
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const accentStyle = accentColor
    ? ({ "--key-accent": accentColor } as CSSProperties)
    : undefined;

  return (
    <button
      ref={(node) => {
        (ref as { current: HTMLButtonElement | null }).current = node;
        inViewRef(node);
      }}
      type="button"
      onClick={onClick}
      style={accentStyle}
      className={cn(
        "keyboard-key group w-full min-w-0 text-left",
        inView && "keyboard-key-visible",
        active && "keyboard-key-active",
        className,
      )}
    >
      <span
        className="font-mono text-sm font-semibold"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {label}
      </span>
      {description && (
        <span className="text-safe mt-2 block text-xs leading-relaxed text-muted opacity-100 md:opacity-0 md:transition-opacity md:duration-350 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          {description}
        </span>
      )}
    </button>
  );
}
