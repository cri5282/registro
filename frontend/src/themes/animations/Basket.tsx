import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import { useTimeline, vars } from "./shared";
import "./basket.css";

/** Ultimi secondi, tiro da tre sulla sirena: SWISH, tabellone che gira, e il pallone che rimbalza addosso al tema. */
export default function Basket(props: AnimationProps) {
  useTimeline(props, 300, 4100);
  return (
    <div className="anim anim-basket">
      <div className="bk-arena">
        <span className="bk-lights" />
        <div className="bk-board">
          <span className="bk-team">4ªB</span>
          <span className="bk-score">
            <b className="bk-old">98</b>
            <b className="bk-new">101</b>
          </span>
          <span className="bk-clock">
            {["0:03", "0:02", "0:01", "0:00"].map((t, i) => (
              <i key={t} style={vars({ animationDelay: `${0.3 + i * 0.45}s` })}>
                {t}
              </i>
            ))}
          </span>
          <span className="bk-score">99</span>
          <span className="bk-team">PROF</span>
        </div>
        <div className="bk-floor" />
        <div className="bk-hoop">
          <span className="bk-backboard" />
          <span className="bk-rim" />
          <span className="bk-net" />
        </div>
        <div className="bk-shot">
          <div className="bk-arc">
            <img className="bk-ball" src={asset("loscopatroie/ball.svg")} alt="" />
          </div>
        </div>
        <p className="bk-buzzer">BUZZER BEATER!</p>
      </div>
      <div className="bk-bounce">
        <img src={asset("loscopatroie/ball.svg")} alt="" />
      </div>
    </div>
  );
}
