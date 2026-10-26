import type { ReactNode } from "react";
import { asset } from "./registry";
import type { ThemeId } from "./words";
import "./decor.css";
import "./decor-extra.css";
import "./decor-more.css";
import { splitUomo, UOMO_TEXT } from "./uomoText";
import Noob from "./Noob";
import RaceCar from "./RaceCar";
import { FollowEye } from "./ObserverNotes";

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
  overthinker: () => (
    <div className="ts-thoughts" aria-hidden="true">
      {["e se…?", "ma forse…", "e se il prof…", "ho chiuso il gas?", "e se domani…", "ok ma se…"].map((text, i) => (
        <span key={text} style={{ left: `${8 + i * 15}%`, animationDelay: `${i * 3.1}s` }}>
          {text}
        </span>
      ))}
    </div>
  ),
  fre: () => (
    <div className="ts-snow" aria-hidden="true">
      <img className="ts-no" src={asset("fre/prohibited.svg")} alt="" />
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 1.7) % 12}s`, fontSize: `${12 + (i % 4) * 6}px` }}>
          ❄
        </span>
      ))}
    </div>
  ),
  robot: () => <span className="ts-scan" aria-hidden="true" />,
  uomo: () => (
    <div className="ts-uomo" aria-hidden="true">
      {[...UOMO_TEXT, ...UOMO_TEXT, ...UOMO_TEXT].map((paragraph, i) => (
        <p key={i}>
          {splitUomo(paragraph).map((part, j) => (j % 2 ? <b key={j}>{part}</b> : part))}
        </p>
      ))}
    </div>
  ),
  roblox: () => (
    <div className="ts-rx" aria-hidden="true">
      <Noob className="ts-rx-noob" />
    </div>
  ),
  saetta: () => (
    <div className="ts-desert" aria-hidden="true">
      <svg className="ts-mesas" viewBox="0 0 1200 220" preserveAspectRatio="none">
        <path d="M0 220V150H60V110L90 100V60H170L180 70V110H230V150H330V120L350 90H420L440 120V160H560V170H700V100L720 70H800V90L820 100V160H930V130H980V90L1000 80H1070V140H1200V220Z" fill="#c8572b" opacity="0.55" />
        <path d="M0 220V190H160V170H300V185H520V175H760V190H980V175H1200V220Z" fill="#a8401c" opacity="0.6" />
      </svg>
      <div className="ts-sa-run">
        <RaceCar />
      </div>
    </div>
  ),
  theobserver: () => (
    <div className="ts-ob" aria-hidden="true">
      <FollowEye className="ts-ob-eye" />
    </div>
  ),
  darko: () => (
    <div className="ts-graffiti" aria-hidden="true">
      <span className="ts-tag ts-tag-1">DARKO</span>
      <span className="ts-tag ts-tag-2">MAMMA DOVE 6?</span>
      <span className="ts-tag ts-tag-3">👑 KING</span>
      <span className="ts-tag ts-tag-4">no mamma no party</span>
      <span className="ts-smoke" />
    </div>
  ),
  justeat: () => (
    <div className="ts-je" aria-hidden="true">
      <img className="ts-je-scooter" src={asset("justeat/scooter.svg")} alt="" />
    </div>
  ),
  greentheory: () => (
    <div className="ts-gt" aria-hidden="true">
      <span className="ts-gt-sign">NO EXCUSES</span>
    </div>
  ),
  cryptofix: () => (
    <div className="ts-cf" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} style={{ left: `${6 + i * 12}%`, animationDelay: `${i * 2.3}s` }}>
          ₿
        </span>
      ))}
    </div>
  ),
  ortol: () => (
    <div className="ts-or" aria-hidden="true">
      <img className="ts-or-snail" src={asset("ortol/snail.svg")} alt="" />
    </div>
  ),
};

export default function ThemeScene({ theme }: { theme: ThemeId }) {
  const Scene = SCENES[theme];
  if (!Scene) return null;
  return <div className={`theme-scene theme-scene-${theme}`}>{Scene()}</div>;
}
