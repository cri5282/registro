import { useEffect } from "react";
import type { AnimationProps } from "../registry";
import { useTimeline } from "./shared";
import "./puglia.css";

const COVER_AT = 2750;
const RIBBONS = ["#d2382b", "#2f8f3a", "#f2c230", "#0a6fb5", "#d2382b"];

/** La taranta: il ragno scende e morde, tutta l'app balla la pizzica, il fazzoletto rosso spazza via. */
export default function Puglia(props: AnimationProps) {
  useTimeline(props, COVER_AT, 4300);

  // Il morso fa ballare la pagina vera sotto la tenda, finché il fazzoletto non la copre.
  useEffect(() => {
    const root = document.documentElement;
    const start = window.setTimeout(() => root.classList.add("pizzica-dance"), 720);
    const stop = window.setTimeout(() => root.classList.remove("pizzica-dance"), COVER_AT);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
      root.classList.remove("pizzica-dance");
    };
  }, []);

  return (
    <div className="anim anim-puglia">
      <div className="pg-dim" />

      <div className="pg-spider-drop">
        <span className="pg-thread" />
        <svg className="pg-spider" viewBox="-60 -50 120 110">
          <g className="pg-legs pg-legs-left">
            <path d="M-10 -6 Q-34 -30 -50 -18" />
            <path d="M-12 0 Q-40 -10 -56 4" />
            <path d="M-12 6 Q-40 14 -54 30" />
            <path d="M-10 12 Q-30 32 -40 48" />
          </g>
          <g className="pg-legs pg-legs-right">
            <path d="M10 -6 Q34 -30 50 -18" />
            <path d="M12 0 Q40 -10 56 4" />
            <path d="M12 6 Q40 14 54 30" />
            <path d="M10 12 Q30 32 40 48" />
          </g>
          <ellipse cx="0" cy="18" rx="17" ry="21" fill="#3b2416" />
          <path d="M0 4 L7 16 L0 30 L-7 16 Z" fill="#d2382b" />
          <circle cx="0" cy="-8" r="12" fill="#4a2e1c" />
          <circle cx="-4.5" cy="-11" r="3" fill="#fff" />
          <circle cx="4.5" cy="-11" r="3" fill="#fff" />
          <circle cx="-4" cy="-10.5" r="1.4" fill="#000" />
          <circle cx="5" cy="-10.5" r="1.4" fill="#000" />
          <path d="M-5 -1 L-3 4 M5 -1 L3 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="pg-bite">ZAC!</div>

      <div className="pg-tambourine-track">
        <div className="pg-tambourine">
          <div className="pg-frame">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="pg-jingle" style={{ transform: `rotate(${i * 45 + 22}deg)` }} />
            ))}
            <div className="pg-skin">
              <span className="pg-flower" />
            </div>
          </div>
          <div className="pg-ribbons">
            {RIBBONS.map((color, i) => (
              <span key={i} style={{ background: color, animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        </div>
      </div>

      <p className="pg-shout">Pizzica!</p>

      <div className="pg-scarf">
        <svg viewBox="0 0 200 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pg-scarf-shade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff4a3a" />
              <stop offset="0.5" stopColor="#d2382b" />
              <stop offset="1" stopColor="#9e1f16" />
            </linearGradient>
          </defs>
          <path
            className="pg-cloth"
            d="M-20 -20 H220 V200 Q200 214 180 200 T140 200 T100 200 T60 200 T20 200 T-20 200 Z"
            fill="url(#pg-scarf-shade)"
          />
          <path d="M-20 60 Q100 40 220 70" stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none" />
          <path d="M-20 130 Q100 112 220 140" stroke="rgba(0,0,0,0.12)" strokeWidth="14" fill="none" />
        </svg>
        <p className="pg-ue">Uè!</p>
      </div>
    </div>
  );
}
