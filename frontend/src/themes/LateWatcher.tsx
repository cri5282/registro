import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { LATE_EVENT } from "./ThemeExtras";

const LateTeleport = lazy(() => import("./LateTeleport"));

/** Ogni entrata in ritardo salvata fa comparire il Rosé del ritardo, col teletrasporto. */
export default function LateWatcher() {
  const [late, setLate] = useState<{ minutes: number; key: number } | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    function onLate(event: Event) {
      counter.current += 1;
      setLate({ minutes: (event as CustomEvent<number>).detail, key: counter.current });
    }
    window.addEventListener(LATE_EVENT, onLate);
    return () => window.removeEventListener(LATE_EVENT, onLate);
  }, []);

  if (!late) return null;
  return (
    <Suspense fallback={null}>
      <LateTeleport key={late.key} minutes={late.minutes} onClose={() => setLate(null)} />
    </Suspense>
  );
}
