import { useEffect, useRef, useState } from "react";
import { DEFAULT_COPY, THEMES } from "./registry";
import type { ThemeId } from "./words";
import ThemeScene from "./ThemeScene";
import EasterEggs from "./EasterEggs";
import ObserverNotes from "./ObserverNotes";
import UltraWatcher from "./UltraWatcher";
import LateWatcher from "./LateWatcher";

export const ATTENDANCE_EVENT = "registro:attendance";

export interface AttendanceDetail {
  status: "present" | "absent";
  /** La lezione appena segnata: chi ascolta sa già com'è, anche prima che il salvataggio finisca. */
  eventId: string;
  start: string;
}

export const LATE_EVENT = "registro:late";

/** Da chiamare quando si salva un'entrata in ritardo: il Rosé del ritardo si teletrasporta qui. */
export function announceLate(minutes: number) {
  window.dispatchEvent(new CustomEvent(LATE_EVENT, { detail: minutes }));
}

/** Da chiamare quando l'utente segna una presenza: il tema attivo può reagire. */
export function announceAttendance(detail: AttendanceDetail) {
  window.dispatchEvent(new CustomEvent(ATTENDANCE_EVENT, { detail }));
}

/** Piccole aggiunte al DOM che il solo CSS non riesce a fare. */
export default function ThemeExtras({ theme }: { theme: ThemeId }) {
  return (
    <>
      <EasterEggs theme={theme} />
      <UltraWatcher />
      <LateWatcher />
      {theme === "default" ? null : (
        <>
          <ThemeScene theme={theme} />
          <Cheer theme={theme} />
          {theme === "baba" ? <SparkleTrail /> : null}
          {theme === "theobserver" ? <ObserverNotes /> : null}
        </>
      )}
    </>
  );
}

function Cheer({ theme }: { theme: ThemeId }) {
  const [cheer, setCheer] = useState<{ text: string; status: string; key: number } | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    const lines = THEMES[theme].copy.cheer ?? DEFAULT_COPY.cheer;
    if (!lines) return;
    let timer = 0;
    function onAttendance(event: Event) {
      const { status } = (event as CustomEvent<AttendanceDetail>).detail;
      counter.current += 1;
      setCheer({ text: lines![status], status, key: counter.current });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCheer(null), 1900);
    }
    window.addEventListener(ATTENDANCE_EVENT, onAttendance);
    return () => {
      window.removeEventListener(ATTENDANCE_EVENT, onAttendance);
      window.clearTimeout(timer);
    };
  }, [theme]);

  if (!cheer) return null;
  return (
    <div key={cheer.key} className={`theme-cheer theme-cheer-${cheer.status}`} role="status">
      {cheer.text}
    </div>
  );
}

const SPARKLES = ["✨", "💖", "🌈", "⭐", "💅"];

function SparkleTrail() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    function onMove(event: PointerEvent) {
      const now = performance.now();
      if (now - last < 45 || !layer.current) return;
      last = now;
      const dot = document.createElement("span");
      dot.className = "sparkle";
      dot.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      dot.style.setProperty("--drift", `${(Math.random() - 0.5) * 40}px`);
      layer.current.appendChild(dot);
      if (layer.current.childElementCount > 24) layer.current.firstElementChild?.remove();
      dot.addEventListener("animationend", () => dot.remove());
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={layer} className="sparkle-layer" aria-hidden="true" />;
}
