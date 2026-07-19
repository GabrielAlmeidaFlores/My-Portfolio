import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { BlueprintDiagram } from "@/types/processPipeline";
import { BodyText } from "@/components/ui/BodyText";
import { cn } from "@/lib/cn";

interface ArchitectureBlueprintFlowProps {
  title: string;
  description: string;
  blueprint: BlueprintDiagram;
  className?: string;
}

const VIEWBOX = { w: 400, h: 300 };

function toPercent(value: number, axis: "x" | "y") {
  const max = axis === "x" ? VIEWBOX.w : VIEWBOX.h;
  return `${(value / max) * 100}%`;
}

export function ArchitectureBlueprintFlow({
  title,
  description,
  blueprint,
  className,
}: ArchitectureBlueprintFlowProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const active = blueprint.nodes.find((node) => node.id === activeNode);

  return (
    <div
      ref={ref}
      className={cn("blueprint-card spotlight-card w-full p-7", className)}
    >
      <h3 className="text-safe w-full text-xl font-bold">{title}</h3>
      <BodyText className="mt-2 text-sm">{description}</BodyText>

      <div className={cn("blueprint mt-8", inView && "blueprint-visible")}>
        <p className="blueprint-label">{blueprint.label}</p>

        <div className="blueprint-canvas">
          <div className="blueprint-grid" aria-hidden="true" />

          <svg
            className="blueprint-svg"
            viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {blueprint.connections.map((connection, index) => (
              <path
                key={connection.id}
                d={connection.path}
                className="blueprint-line"
                style={{ "--line-i": index } as CSSProperties}
              />
            ))}
            {blueprint.junctions.map((junction, index) => (
              <circle
                key={index}
                cx={junction.cx}
                cy={junction.cy}
                r="3"
                className="blueprint-junction"
                style={{ "--dot-i": index } as CSSProperties}
              />
            ))}
          </svg>

          {blueprint.nodes.map((node, index) => {
            const isActive = activeNode === node.id;

            return (
              <button
                key={node.id}
                type="button"
                className={cn("blueprint-node", isActive && "blueprint-node-active")}
                style={
                  {
                    left: toPercent(node.x, "x"),
                    top: toPercent(node.y, "y"),
                    width: toPercent(node.width, "x"),
                    height: toPercent(node.height, "y"),
                    "--node-i": index,
                  } as CSSProperties
                }
                onClick={() =>
                  setActiveNode((current) => (current === node.id ? null : node.id))
                }
                aria-expanded={isActive}
              >
                <span className="blueprint-node-label">{node.label}</span>
                {node.sublabel && (
                  <span className="blueprint-node-sublabel">{node.sublabel}</span>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="blueprint-details"
            >
              <p className="font-mono text-xs font-semibold text-primary-400">
                {active.label}
                {active.sublabel ? ` — ${active.sublabel}` : ""}
              </p>
              <ul className="mt-2 space-y-1">
                {active.details.map((detail) => (
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
