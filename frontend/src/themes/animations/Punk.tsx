import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import Ransom from "../Ransom";
import { useTimeline, vars } from "./shared";
import "./punk.css";

const COUNT = [
  { text: "UN!", x: -24, y: -20, r: -9 },
  { text: "DUE!", x: 22, y: -12, r: 7 },
  { text: "TRE!", x: -20, y: 24, r: 4 },
  { text: "QUATTRO!", x: 6, y: 2, r: -5 },
];

// Il bordo dello strappo: x in % a ogni gradino di altezza.
const TEAR = [52, 47, 55, 49, 44, 53, 58, 50, 46, 54, 48, 51, 45, 53, 49];
const tearPath = TEAR.map((x, i) => `${x}% ${(i / (TEAR.length - 1)) * 100}%`);
const LEFT = `polygon(0 0, ${tearPath.join(", ")}, 0 100%)`;
const RIGHT = `polygon(100% 0, ${tearPath.join(", ")}, 100% 100%)`;

function Flyer() {
  return (
    <div className="pk-paper">
      <img className="pk-photo" src={asset("punk/flyer.png")} alt="" />
      <div className="pk-copy">
        <Ransom text="PUNK" className="pk-title" />
        <p className="pk-line">dal vivo in 4ªB, si entra con la giustifica</p>
        <p className="pk-line pk-line-2">prima ora, aula in fondo al corridoio</p>
      </div>
      <img className="pk-pin pk-pin-a" src={asset("punk/safetypin.svg")} alt="" />
      <img className="pk-pin pk-pin-b" src={asset("punk/safetypin.svg")} alt="" />
    </div>
  );
}

/** Conteggio d'attacco a schermo che trema, poi il volantino fotocopiato si stampa sullo schermo e viene strappato. */
export default function Punk(props: AnimationProps) {
  useTimeline(props, 2000, 3700);
  return (
    <div className="anim anim-punk">
      <div className="pk-stage">
        <img className="pk-crowd" src={asset("punk/flyer.png")} alt="" />
        {COUNT.map((c, i) => (
          <div
            key={c.text}
            className="pk-count"
            style={vars({ "--x": `${c.x}vw`, "--y": `${c.y}vh`, "--r": `${c.r}deg`, animationDelay: `${0.2 + i * 0.35}s` })}
          >
            <Ransom text={c.text} />
          </div>
        ))}
      </div>
      <div className="pk-flyer">
        <div className="pk-half pk-half-l">
          <div style={{ clipPath: LEFT }}>
            <Flyer />
          </div>
        </div>
        <div className="pk-half pk-half-r">
          <div style={{ clipPath: RIGHT }}>
            <Flyer />
          </div>
        </div>
      </div>
    </div>
  );
}
