import { generateKeyboardKeys } from "@/data/keyboardLayout";
import { useKeyboardBackground } from "@/hooks/useKeyboardBackground";

const keys = generateKeyboardKeys();

export function MechanicalKeyboardBackground() {
  const { rootRef, gridRef, spotlightRef, setKeyRef } = useKeyboardBackground({
    keyCount: keys.length,
  });

  return (
    <div ref={rootRef} className="keyboard-bg" aria-hidden="true">
      <div className="keyboard-bg-base" />
      <div className="keyboard-bg-ambient" />

      <div ref={gridRef} className="keyboard-bg-grid-wrap">
        <div className="keyboard-bg-grid">
          {keys.map((key, index) => (
            <div
              key={key.id}
              ref={setKeyRef(index)}
              className="keyboard-bg-key"
            >
              <span className="keyboard-bg-key-label">{key.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={spotlightRef} className="keyboard-bg-spotlight" />
      <div className="keyboard-bg-vignette" />
    </div>
  );
}
