import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import RaceCar from "../RaceCar";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./saetta.css";

const MANTRA = ["Concentrati.", "Velocità.", "Io sono velocità."];

/** Il mantra al buio, l'auto entra sgommando tra i flash, KA-CIAO!, riparte e la bandiera a scacchi scopre il tema. */
export default function Saetta(props: AnimationProps) {
  useTimeline(props, 300, 4200);
  const flashes = useScatter(16, () => ({ x: rand(4, 96), y: rand(6, 70), d: rand(2.1, 2.9), s: rand(60, 160) }));
  return (
    <div className="anim anim-saetta">
      <div className="sa-dark">
        {MANTRA.map((line, i) => (
          <p key={line} className="sa-mantra" style={vars({ animationDelay: `${0.12 + i * 0.45}s` })}>
            {line}
          </p>
        ))}
      </div>

      <div className="sa-track">
        <div className="sa-stands" />
        {flashes.map((flash, i) => (
          <span
            key={i}
            className="sa-flash"
            style={vars({ left: `${flash.x}%`, top: `${flash.y}%`, width: `${flash.s}px`, height: `${flash.s}px`, animationDelay: `${flash.d}s` })}
          />
        ))}
        <span className="sa-skid" />
        <div className="sa-car-move">
          <span className="sa-speed" />
          <RaceCar className="sa-car" />
        </div>
        <p className="sa-kachow">
          <img src={asset("saetta/bolt.svg")} alt="" />
          KA-CIAO!
        </p>
      </div>

      <div className="sa-flag" />
    </div>
  );
}
