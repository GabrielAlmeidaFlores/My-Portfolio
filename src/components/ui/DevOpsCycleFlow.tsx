import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { CycleStage } from "@/types/processPipeline";
import { BodyText } from "@/components/ui/BodyText";
import { cn } from "@/lib/cn";

interface DevOpsCycleFlowProps {
  title: string;
  description: string;
  stages: CycleStage[];
  className?: string;
}

const CYCLE_SIZE = 320;
const CENTER = CYCLE_SIZE / 2;
const RADIUS = 118;
const NODE_SIZE = 72;

function getNodePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;

  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
    angle,
  };
}

function buildArcPath(index: number, total: number) {
  const start = getNodePosition(index, total);
  const end = getNodePosition((index + 1) % total, total);
  let endAngle = end.angle;
  if (endAngle <= start.angle) endAngle += Math.PI * 2;
  const midAngle = (start.angle + endAngle) / 2;
  const controlRadius = RADIUS + 10;
  const cx = CENTER + controlRadius * Math.cos(midAngle);
  const cy = CENTER + controlRadius * Math.sin(midAngle);

  return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
}

function DeployVisual({ active }: { active: boolean }) {
  return (
    <div className="devops-cycle-deploy" aria-hidden="true">
      <span className={cn("devops-cycle-deploy-bar", active && "devops-cycle-deploy-bar-active")} />
      <span
        className={cn("devops-cycle-deploy-bar", active && "devops-cycle-deploy-bar-active")}
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className={cn("devops-cycle-deploy-bar", active && "devops-cycle-deploy-bar-active")}
        style={{ animationDelay: "0.3s" }}
      />
      <span className={cn("devops-cycle-deploy-pulse", active && "devops-cycle-deploy-pulse-active")} />
    </div>
  );
}

function MonitorVisual({ active }: { active: boolean }) {
  const bars = [42, 68, 55, 82, 48, 74];

  return (
    <div className="devops-cycle-monitor" aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={index}
          className={cn("devops-cycle-monitor-bar", active && "devops-cycle-monitor-bar-active")}
          style={
            {
              "--bar-h": `${height}%`,
              "--bar-i": index,
            } as CSSProperties
          }
        />
      ))}
      <svg className="devops-cycle-monitor-line" viewBox="0 0 48 20" preserveAspectRatio="none">
        <polyline
          className={cn(active && "devops-cycle-monitor-line-active")}
          points="0,16 8,12 16,14 24,6 32,9 40,4 48,8"
        />
      </svg>
    </div>
  );
}

export function DevOpsCycleFlow({
  title,
  description,
  stages,
  className,
}: DevOpsCycleFlowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  const positions = useMemo(
    () => stages.map((_, index) => getNodePosition(index, stages.length)),
    [stages],
  );

  const activeStage = stages[activeIndex]!;
  const lightPosition = positions[activeIndex]!;

  useEffect(() => {
    if (!inView) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % stages.length);
    }, 1400);

    return () => window.clearInterval(interval);
  }, [inView, stages.length]);

  return (
    <div ref={ref} className={cn("devops-cycle-card spotlight-card w-full p-7", className)}>
      <h3 className="text-safe w-full text-xl font-bold">{title}</h3>
      <BodyText className="mt-2 text-sm">{description}</BodyText>

      <div className={cn("devops-cycle mt-8", inView && "devops-cycle-active")}>
        <div
          className="devops-cycle-stage"
          style={{ width: CYCLE_SIZE, height: CYCLE_SIZE }}
        >
          <svg
            className="devops-cycle-svg"
            viewBox={`0 0 ${CYCLE_SIZE} ${CYCLE_SIZE}`}
            aria-hidden="true"
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              className="devops-cycle-ring"
            />
            {stages.map((stage, index) => (
              <path
                key={stage.id}
                d={buildArcPath(index, stages.length)}
                className={cn(
                  "devops-cycle-arc",
                  activeIndex === index && "devops-cycle-arc-active",
                  activeIndex === (index + 1) % stages.length && "devops-cycle-arc-next",
                )}
              />
            ))}
          </svg>

          <motion.span
            className="devops-cycle-light"
            aria-hidden="true"
            animate={{
              left: lightPosition.x,
              top: lightPosition.y,
            }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />

          {stages.map((stage, index) => {
            const position = positions[index]!;
            const isActive = activeIndex === index;
            const isSelected = selectedStage === stage.id;

            return (
              <button
                key={stage.id}
                type="button"
                className={cn(
                  "devops-cycle-node",
                  isActive && "devops-cycle-node-active",
                  isSelected && "devops-cycle-node-selected",
                )}
                style={{
                  left: position.x - NODE_SIZE / 2,
                  top: position.y - NODE_SIZE / 2,
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                }}
                onClick={() =>
                  setSelectedStage((current) =>
                    current === stage.id ? null : stage.id,
                  )
                }
                aria-expanded={isSelected}
                aria-label={`${stage.label}${stage.subtitle ? `, ${stage.subtitle}` : ""}`}
              >
                {stage.variant === "deploy" ? (
                  <DeployVisual active={isActive} />
                ) : stage.variant === "monitor" ? (
                  <MonitorVisual active={isActive} />
                ) : (
                  <span className="devops-cycle-node-icon" aria-hidden="true">
                    {stage.label === "Code" && "</>"}
                    {stage.label === "Build" && "⚙"}
                    {stage.label === "Test" && "✓"}
                    {stage.label === "Feedback" && "↺"}
                  </span>
                )}
                <span className="devops-cycle-node-label">{stage.label}</span>
                {stage.subtitle && (
                  <span className="devops-cycle-node-sub">{stage.subtitle}</span>
                )}
              </button>
            );
          })}

          <div className="devops-cycle-core" aria-hidden="true">
            <span className="devops-cycle-core-label">CI/CD</span>
            <span className="devops-cycle-core-sub">continuous</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeStage.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="devops-cycle-caption"
          >
            {activeStage.label}
            {activeStage.subtitle ? ` · ${activeStage.subtitle}` : ""}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {selectedStage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="devops-cycle-details"
            >
              <ul className="space-y-1">
                {stages
                  .find((stage) => stage.id === selectedStage)
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
