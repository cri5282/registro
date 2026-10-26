import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./bellesia.css";

/** Match point al quinto set: battuta, la palla passa la rete e cade, ACE! Pioggia di cuori e la palla vola addosso al tema. */
export default function Bellesia(props: AnimationProps) {
  useTimeline(props, 300, 4100);
  const hearts = useScatter(16, () => ({ x: rand(-40, 14), y: rand(-45, -15), r: rand(-60, 60), d: rand(0, 0.2) }));
  return (
    <div className="anim anim-bellesia">
      <div className="bl-arena">
        <div className="bl-board">
          <span className="bl-team">4ªB</span>
          <span className="bl-score">
            <b className="bl-old">24</b>
            <b className="bl-new">25</b>
          </span>
          <span className="bl-set">SET 5</span>
          <span className="bl-score">23</span>
          <span className="bl-team">PROF</span>
        </div>
        <div className="bl-floor" />
        <div className="bl-net">
          <span className="bl-antenna" />
          <span className="bl-mesh" />
        </div>
        <span className="bl-puff" />
        <div className="bl-shot">
          <div className="bl-arc">
            <img className="bl-ball" src={asset("bellesia/volleyball.svg")} alt="" />
          </div>
        </div>
        <div className="bl-hearts">
          {hearts.map((heart, i) => (
            <span
              key={i}
              style={vars({ "--x": `${heart.x}vw`, "--y": `${heart.y}vh`, "--r": `${heart.r}deg`, animationDelay: `${1.8 + heart.d}s` })}
            >
              ♥
            </span>
          ))}
        </div>
        <p className="bl-ace">ACE!</p>
      </div>
      <div className="bl-zoom">
        <img src={asset("bellesia/volleyball.svg")} alt="" />
      </div>
    </div>
  );
}
