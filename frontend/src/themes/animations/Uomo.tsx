import { useEffect, useRef, useState } from "react";
import type { AnimationProps } from "../registry";
import { splitUomo, UOMO_TEXT } from "../uomoText";
import { useTimeline, vars } from "./shared";
import "./uomo.css";

interface Flyer {
  x: number;
  y: number;
  dx: number;
  dy: number;
  delay: number;
}

/** Colonne vere (niente CSS columns: Firefox spezza male i paragrafi animati). */
function columnCount() {
  return Math.max(1, Math.min(6, Math.floor((window.innerWidth - 24) / 250)));
}

/**
 * La pagina si riempie di storia, ogni "uomo" viene cerchiato a penna rossa,
 * poi tutti gli uomini della storia volano al centro e diventano un solo UOMO.
 */
export default function Uomo(props: AnimationProps) {
  useTimeline(props, 300, 4300);
  const [columns] = useState(columnCount);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si misura tardi, quando il carattere è caricato e il testo non si sposta più.
    const timer = window.setTimeout(() => {
      const words = page.current?.querySelectorAll<HTMLElement>(".uo-red") ?? [];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const found: Flyer[] = [];
      for (const word of words) {
        const rect = word.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight || rect.width === 0) continue;
        found.push({
          x: rect.left,
          y: rect.top,
          dx: cx - rect.left - rect.width / 2,
          dy: cy - rect.top - rect.height / 2,
          delay: Math.min(0.35, Math.hypot(cx - rect.left, cy - rect.top) / 2400),
        });
        if (found.length >= 90) break;
      }
      setFlyers(found);
    }, 1750);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="anim anim-uomo">
      <div ref={page} className={`uo-page${flyers.length ? " uo-flying" : ""}`}>
        <div className="uo-columns" style={vars({ "--cols": columns })}>
          {Array.from({ length: columns }, (_, col) => (
            <div key={col} className="uo-col">
              {Array.from({ length: UOMO_TEXT.length }, (_, i) => {
                const paragraph = UOMO_TEXT[(i + col * 3) % UOMO_TEXT.length];
                return (
                  <p key={i}>
                    {splitUomo(paragraph).map((part, j) =>
                      j % 2 ? (
                        <span key={j} className="uo-red">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
        <span className="uo-cover" />
      </div>

      <div className="uo-flyers">
        {flyers.map((flyer, i) => (
          <span
            key={i}
            className="uo-flyer"
            style={vars({
              left: `${flyer.x}px`,
              top: `${flyer.y}px`,
              "--dx": `${flyer.dx}px`,
              "--dy": `${flyer.dy}px`,
              animationDelay: `${flyer.delay}s`,
            })}
          >
            uomo
          </span>
        ))}
      </div>

      <p className="uo-big">UOMO</p>
    </div>
  );
}
