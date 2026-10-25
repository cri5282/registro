import { asset, type AnimationProps } from "../registry";
import { useTimeline } from "./shared";
import "./holy.css";

/** Buio totale, "Fiat lux." si scrive da sé, croce di luce, angeli, aureola che esplode. */
export default function Holy(props: AnimationProps) {
  useTimeline(props, 480, 4800);
  return (
    <div className="anim anim-holy">
      <div className="holy-dark" />
      <div className="holy-clouds holy-clouds-left" />
      <div className="holy-clouds holy-clouds-right" />

      <svg className="holy-text" viewBox="0 0 600 140">
        <text x="300" y="98" textAnchor="middle">
          Fiat lux.
        </text>
      </svg>

      <div className="holy-cross">
        <span className="holy-beam holy-beam-v" />
        <span className="holy-beam holy-beam-h" />
      </div>

      <img className="holy-angel holy-angel-left" src={asset("holy/angel.svg")} alt="" />
      <img className="holy-angel holy-angel-right" src={asset("holy/angel.svg")} alt="" />
      <img className="holy-dove" src={asset("holy/dove.svg")} alt="" />

      <div className="holy-halo" />
      <div className="holy-flash" />
    </div>
  );
}
