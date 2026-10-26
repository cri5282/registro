import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import WateringCan from "../WateringCan";
import "./ortol.css";

const CROPS = ["tomato", "carrot", "lettuce", "tomato", "carrot"];

/** L'annaffiatoio bagna la terra, spuntano i germogli, diventano ortaggi e l'erba cresce sul tema. */
export default function Ortol(props: AnimationProps) {
  useTimeline(props, 300, 4200);
  const drops = useScatter(18, () => ({ x: rand(-30, 30), d: rand(0.45, 1.3) }));
  return (
    <div className="anim anim-ortol">
      <div className="or-garden">
        <span className="or-sun" />
        <div className="or-can-wrap">
          <WateringCan className="or-can" />
          {drops.map((drop, i) => (
            <span key={i} className="or-drop" style={vars({ "--x": `${drop.x}px`, animationDelay: `${drop.d}s` })} />
          ))}
        </div>
        <div className="or-bed">
          {CROPS.map((crop, i) => (
            <span key={i} className="or-plant" style={vars({ "--d": `${1.35 + i * 0.16}s`, left: `${12 + i * 19}%` })}>
              <img className="or-sprout" src={asset("ortol/seedling.svg")} alt="" />
              <img className="or-crop" src={asset(`ortol/${crop}.svg`)} alt="" />
            </span>
          ))}
        </div>
        <p className="or-title">Raccolto del giorno!</p>
      </div>
      <span className="or-grass" />
    </div>
  );
}
