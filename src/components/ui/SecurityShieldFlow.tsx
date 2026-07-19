import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { PipelineLayer } from "@/types/processPipeline";
import { BodyText } from "@/components/ui/BodyText";
import { cn } from "@/lib/cn";

interface SecurityShieldFlowProps {
  title: string;
  description: string;
  layers: PipelineLayer[];
  className?: string;
}

const ATTACKS = [
  { label: "×", top: "16%", left: "6%" },
  { label: "!", top: "20%", right: "8%" },
  { label: "⚠", bottom: "30%", left: "10%" },
  { label: "×", bottom: "26%", right: "6%" },
];

export function SecurityShieldFlow({
  title,
  description,
  layers,
  className,
}: SecurityShieldFlowProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const nestedLayers = [...layers].reverse();

  useEffect(() => {
    if (!inView) return;

    setRevealedCount(0);
    const interval = window.setInterval(() => {
      setRevealedCount((count) => {
        if (count >= layers.length) {
          window.clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, 380);

    return () => window.clearInterval(interval);
  }, [inView, layers.length]);

  function renderNested(index: number): ReactNode {
    if (index >= nestedLayers.length) {
      return (
        <div className="security-shield-core">
          <span className="font-mono text-[10px] text-error/80">perimeter</span>
        </div>
      );
    }

    const layer = nestedLayers[index]!;
    const isRevealed = index < revealedCount;
    const isActive = activeLayer === layer.id;

    return (
      <button
        type="button"
        className={cn(
          "security-shield-layer",
          isRevealed && "security-shield-layer-visible",
          isActive && "security-shield-layer-active",
        )}
        style={{ "--layer-depth": index } as CSSProperties}
        onClick={() =>
          setActiveLayer((current) => (current === layer.id ? null : layer.id))
        }
        aria-expanded={isActive}
      >
        <span className="security-shield-layer-title">{layer.title}</span>
        <span className="security-shield-layer-subtitle">{layer.subtitle}</span>
        {renderNested(index + 1)}
      </button>
    );
  }

  return (
    <div ref={ref} className={cn("security-shield-card spotlight-card w-full p-7", className)}>
      <h3 className="text-safe w-full text-xl font-bold">{title}</h3>
      <BodyText className="mt-2 text-sm">{description}</BodyText>

      <div className={cn("security-shield mt-8", inView && "security-shield-active")}>
        <div className="security-radar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {ATTACKS.map((attack, index) => (
          <span
            key={index}
            className="security-attack"
            style={
              {
                "--attack-i": index,
                top: attack.top,
                left: attack.left,
                right: attack.right,
                bottom: attack.bottom,
              } as CSSProperties
            }
            aria-hidden="true"
          >
            {attack.label}
          </span>
        ))}

        <div className="security-nested">{renderNested(0)}</div>

        <div className="security-token" aria-hidden="true">
          <span className="security-token-label">JWT</span>
        </div>

        <AnimatePresence>
          {activeLayer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="security-shield-details"
            >
              <ul className="space-y-1">
                {layers
                  .find((layer) => layer.id === activeLayer)
                  ?.details.map((detail) => (
                    <li key={detail} className="text-xs leading-relaxed text-muted">
                      • {detail}
                    </li>
                  ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
