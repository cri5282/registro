import { useEffect, useRef } from "react";
import { asset } from "./registry";
import { rand, useScatter, vars } from "./animations/shared";
import "@fontsource/anton/latin-400.css";
import "./ultra.css";

// Il suono "Prowler", dal player di YouTube: si sente soltanto, il video resta nascosto. Va in loop.
const AUDIO = "https://www.youtube-nocookie.com/embed/12DTCtnb6ws?autoplay=1&playsinline=1&loop=1&playlist=12DTCtnb6ws&controls=0";

/** Due giorni di assenza di fila: lui avanza piano dal buio, con l'aura e il suono "Prowler" in sottofondo. */
export default function UltraInstinct({ onClose }: { onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const sparks = useScatter(42, () => ({
    x: rand(0, 100),
    size: rand(2, 6),
    duration: rand(2.4, 5.5),
    delay: rand(0, 6),
    drift: rand(-40, 40),
  }));

  useEffect(() => {
    close.current?.focus({ preventScroll: true });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ui-overlay" role="dialog" aria-modal="true" aria-label="Ultra Istinto dell'assenza">
      <div className="ui-walker">
        <img className="ui-img" src={asset("ultra/ultra.webp")} alt="" />
      </div>
      <span className="ui-flicker" />
      <div className="ui-sparks" aria-hidden="true">
        {sparks.map((spark, i) => (
          <span
            key={i}
            style={vars({
              left: `${spark.x}%`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              animationDuration: `${spark.duration}s`,
              animationDelay: `${1.5 + spark.delay}s`,
              "--drift": `${spark.drift}px`,
            })}
          />
        ))}
      </div>
      <span className="ui-vignette" />

      <div className="ui-text">
        <p className="ui-line ui-line-1">Due giorni di assenza. Di fila.</p>
        <p className="ui-line ui-line-2">Il corpo si muove da solo… lontano da scuola.</p>
        <p className="ui-kanji" aria-hidden="true">
          身勝手の極意
        </p>
        <h2 className="ui-title">Ultra Istinto dell'assenza</h2>
      </div>

      <iframe
        className="ui-audio"
        src={AUDIO}
        title="Prowler"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
        aria-hidden="true"
      />

      <button ref={close} type="button" className="ui-close" onClick={onClose}>
        Torna in classe ✕
      </button>
    </div>
  );
}
