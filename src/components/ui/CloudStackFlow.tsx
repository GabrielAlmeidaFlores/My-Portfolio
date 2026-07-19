import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { PipelineLayer } from "@/types/processPipeline";
import { BodyText } from "@/components/ui/BodyText";
import { cn } from "@/lib/cn";

interface CloudStackFlowProps {
  title: string;
  description: string;
  layers: PipelineLayer[];
  className?: string;
}

export function CloudStackFlow({
  title,
  description,
  layers,
  className,
}: CloudStackFlowProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  const displayLayers = layers;

  return (
    <div ref={ref} className={cn("cloud-stack-card spotlight-card w-full p-7", className)}>
      <h3 className="text-safe w-full text-xl font-bold">{title}</h3>
      <BodyText className="mt-2 text-sm">{description}</BodyText>

      <div
        className={cn("cloud-stack mt-8", inView && "cloud-stack-visible")}
        onMouseLeave={() => setHoveredLayer(null)}
      >
        <div className="cloud-stack-beam" aria-hidden="true" />
        <div className="cloud-stack-beam-glow" aria-hidden="true" />

        <div className="cloud-stack-layers">
          {displayLayers.map((layer, index) => {
            const isActive = activeLayer === layer.id;
            const isHovered = hoveredLayer === layer.id;

            return (
              <div
                key={layer.id}
                className="cloud-stack-layer-wrap"
                style={{ "--layer-index": index } as CSSProperties}
              >
                <button
                  type="button"
                  className={cn(
                    "cloud-stack-layer",
                    (isHovered || isActive) && "cloud-stack-layer-active",
                  )}
                  onMouseEnter={() => setHoveredLayer(layer.id)}
                  onClick={() =>
                    setActiveLayer((current) =>
                      current === layer.id ? null : layer.id,
                    )
                  }
                  aria-expanded={isActive}
                >
                  <div className="cloud-stack-layer-frame">
                    <p className="cloud-stack-layer-title">{layer.title}</p>
                    <p className="cloud-stack-layer-subtitle">{layer.subtitle}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="cloud-stack-details"
                    >
                      <ul className="space-y-1.5">
                        {layer.details.map((detail) => (
                          <li key={detail} className="text-xs leading-relaxed text-muted">
                            • {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
