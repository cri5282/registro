import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import { useTimeline, vars } from "./shared";
import "./justeat.css";

const STEPS = ["Ordine confermato", "In preparazione", "In consegna", "Consegnato!"];
const ETA = ["30", "18", "7", "1"];

/** Tracciamento dell'ordine: il rider attraversa la mappa, suona, il cartone della pizza si apre sul tema. */
export default function Justeat(props: AnimationProps) {
  useTimeline(props, 300, 4100);
  return (
    <div className="anim anim-justeat">
      <div className="je-app">
        <div className="je-card">
          <p className="je-title">Il tuo ordine 🧾</p>
          <p className="je-eta">
            Arrivo tra{" "}
            <span className="je-eta-n">
              {ETA.map((n, i) => (
                <b key={n} style={vars({ animationDelay: `${0.2 + i * 0.6}s` })}>
                  {n}
                </b>
              ))}
            </span>{" "}
            min
          </p>
          <ol className="je-steps">
            {STEPS.map((step, i) => (
              <li key={step} style={vars({ animationDelay: `${0.25 + i * 0.65}s` })}>
                {step}
              </li>
            ))}
          </ol>
          <div className="je-map">
            <span className="je-road je-road-h" />
            <span className="je-road je-road-v" />
            <span className="je-route" />
            <span className="je-pin">🍕</span>
            <img className="je-house" src={asset("justeat/house.svg")} alt="" />
            <img className="je-scooter" src={asset("justeat/scooter.svg")} alt="" />
            <span className="je-ding">Din don! 🔔</span>
          </div>
        </div>
      </div>

      <div className="je-box">
        <span className="je-box-base">
          <span className="je-box-inside">📋 Registro caldo caldo</span>
        </span>
        <span className="je-box-lid">REGISTRO · PIZZA</span>
      </div>
    </div>
  );
}
