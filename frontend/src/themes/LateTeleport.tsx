import { useEffect, useRef, useState } from "react";
import { asset } from "./registry";
import { rand, useScatter, vars } from "./animations/shared";
import { playTeleport } from "./sound";
import "@fontsource/anton/latin-400.css";
import "./teleport.css";

// "goku black theme song", dal player di YouTube: si sente soltanto, il video resta nascosto.
const AUDIO = "https://www.youtube-nocookie.com/embed/_WoaWPl8Sbg?autoplay=1&playsinline=1&controls=0";

/** Più corto dell'Ultra Istinto: è solo un ritardo. */
const SHOW_MS = 6000;
const OUT_MS = 450;

/** Fasce dell'immagine che arrivano sfasate e si rimettono a posto, come il teletrasporto dell'anime. */
const SLICES = [
  { top: 8, h: 9, dx: -90 },
  { top: 27, h: 6, dx: 120 },
  { top: 41, h: 11, dx: -60 },
  { top: 63, h: 7, dx: 150 },
  { top: 80, h: 10, dx: -110 },
];

/**
 * Ogni entrata in ritardo: due dita sulla fronte e lui compare col teletrasporto istantaneo,
 * resta qualche secondo col tema di Goku Black e se ne va allo stesso modo.
 */
export default function LateTeleport({ minutes, onClose }: { minutes: number; onClose: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const latest = useRef(onClose);
  latest.current = onClose;
  const sparks = useScatter(16, () => ({ x: rand(0, 100), d: rand(0.6, 4), t: rand(1.6, 3.2), s: rand(3, 7) }));

  useEffect(() => {
    playTeleport();
    const leave = window.setTimeout(() => setLeaving(true), SHOW_MS);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLeaving(true);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(leave);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    playTeleport();
    const done = window.setTimeout(() => latest.current(), OUT_MS);
    return () => window.clearTimeout(done);
  }, [leaving]);

  const image = asset("ultra/rose.webp");
  return (
    <div
      className={`tp-overlay${leaving ? " is-out" : ""}`}
      role="dialog"
      aria-label={`In ritardo di ${minutes} minuti`}
      onClick={() => setLeaving(true)}
    >
      <span className="tp-dark" />
      <div className="tp-figure">
        <img className="tp-img" src={image} alt="" />
        <img className="tp-ghost tp-ghost-a" src={image} alt="" />
        <img className="tp-ghost tp-ghost-b" src={image} alt="" />
        {SLICES.map((slice) => (
          <img
            key={slice.top}
            className="tp-slice"
            src={image}
            alt=""
            style={vars({ "--top": `${slice.top}%`, "--h": `${slice.h}%`, "--dx": `${slice.dx}px` })}
          />
        ))}
      </div>
      <div className="tp-sparks" aria-hidden="true">
        {sparks.map((spark, i) => (
          <span
            key={i}
            style={vars({ left: `${spark.x}%`, width: `${spark.s}px`, height: `${spark.s}px`, animationDelay: `${spark.d}s`, animationDuration: `${spark.t}s` })}
          />
        ))}
      </div>
      <span className="tp-vignette" />
      <span className="tp-line" />
      <span className="tp-flash" />

      <div className="tp-text">
        <p className="tp-kicker">
          Teletrasporto istantaneo <span aria-hidden="true">瞬間移動</span>
        </p>
        <p className="tp-minutes">
          +{minutes}
          <small>min di ritardo</small>
        </p>
        <p className="tp-quote">«Il tempo appartiene a me.»</p>
      </div>

      <iframe
        className="tp-audio"
        src={AUDIO}
        title="Goku Black"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
