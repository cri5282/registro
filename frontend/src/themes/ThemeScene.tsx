import type { ReactNode } from "react";
import { asset } from "./registry";
import type { ThemeId } from "./words";
import "./decor.css";

/** Scenografie fisse dietro ai contenuti: non si cliccano e non coprono niente di importante. */
const SCENES: Partial<Record<ThemeId, () => ReactNode>> = {
  peru: () => (
    <>
      <svg className="ts-andes" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 220V150L90 80L150 120L250 30L330 110L400 70L520 160L600 60L690 130L780 40L880 140L960 90L1060 150L1130 70L1200 120V220Z" fill="#2a1a12" />
        <path d="M0 220V180L120 130L220 170L340 110L460 180L560 120L700 185L820 125L960 180L1080 130L1200 170V220Z" fill="#1f130d" />
        <path d="M250 30L275 55L262 52L250 62L238 50L226 54ZM780 40L800 62L788 58L780 68L770 57L760 60Z" fill="#f6e7cf" opacity="0.85" />
      </svg>
      <svg className="ts-condor" viewBox="0 0 100 40" aria-hidden="true">
        <path d="M50 22C38 10 20 6 0 12C18 14 30 20 44 28L50 34L56 28C70 20 82 14 100 12C80 6 62 10 50 22Z" fill="#120b07" />
        <circle cx="50" cy="20" r="3.4" fill="#f6e7cf" />
      </svg>
    </>
  ),
  holy: () => <img className="ts-dove" src={asset("holy/dove.svg")} alt="" aria-hidden="true" />,
  quattro: () => (
    <div className="ts-crowd" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="ts-flash" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.73) % 5}s` }} />
      ))}
    </div>
  ),
  puglia: () => (
    <div className="ts-sea" aria-hidden="true">
      <span className="ts-boat">⛵</span>
      <span className="ts-wave ts-wave-back" />
      <span className="ts-wave ts-wave-front" />
    </div>
  ),
  bicicletta: () => (
    <div className="ts-bike-lane" aria-hidden="true">
      <span className="ts-bike-trail" />
      <img className="ts-bike" src={asset("bicicletta/bicycle.svg")} alt="" />
    </div>
  ),
  baba: () => <div className="ts-disco-lights" aria-hidden="true" />,
};

export default function ThemeScene({ theme }: { theme: ThemeId }) {
  const Scene = SCENES[theme];
  if (!Scene) return null;
  return <div className={`theme-scene theme-scene-${theme}`}>{Scene()}</div>;
}
