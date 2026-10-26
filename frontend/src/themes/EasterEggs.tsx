import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EGG_EVENT, EGG_REQUEST, EGGS, eggWords } from "./eggs";
import { createMatcher, isTypingTarget } from "./secretWords";
import { playEggSound } from "./sound";
import type { ThemeId } from "./words";

const EggEffect = lazy(() => import("./eggs/EggEffects"));

/** Ascolta parole e clic segreti del tema attivo e fa partire il suo easter egg. */
export default function EasterEggs({ theme }: { theme: ThemeId }) {
  const [active, setActive] = useState<{ theme: ThemeId; key: number } | null>(null);
  const running = useRef(false);
  const counter = useRef(0);
  const matcher = useMemo(() => createMatcher(eggWords(theme)), [theme]);

  const fire = useCallback(() => {
    if (running.current) return;
    running.current = true;
    counter.current += 1;
    playEggSound(theme);
    window.dispatchEvent(new CustomEvent(EGG_EVENT, { detail: theme }));
    setActive({ theme, key: counter.current });
  }, [theme]);

  useEffect(() => {
    const trigger = EGGS[theme];
    let clicks = 0;
    let lastClick = 0;

    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      if (isTypingTarget(event.target)) return;
      if (matcher.push(event.key)) fire();
    }

    function onClick(event: MouseEvent) {
      if (!("click" in trigger)) return;
      const target = event.target as Element | null;
      if (!target?.closest?.(trigger.click)) return;
      const now = performance.now();
      clicks = now - lastClick < 900 ? clicks + 1 : 1;
      lastClick = now;
      if (clicks >= trigger.times) {
        clicks = 0;
        fire();
      }
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener(EGG_REQUEST, fire);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EGG_REQUEST, fire);
      document.removeEventListener("click", onClick);
    };
  }, [theme, matcher, fire]);

  const done = useCallback(() => {
    running.current = false;
    setActive(null);
  }, []);

  if (!active) return null;
  return (
    <div className={`egg-layer egg-layer-${active.theme}`} aria-hidden="true">
      <Suspense fallback={null}>
        <EggEffect key={active.key} theme={active.theme} onDone={done} />
      </Suspense>
    </div>
  );
}
