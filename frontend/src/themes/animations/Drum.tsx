import type { AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./drum.css";

/** Una sigaretta rollata, l'accendino, il colpo di tosse e il fumo che riempie tutto. */
export default function Drum(props: AnimationProps) {
  useTimeline(props, 2350, 4700);

  const puffs = useScatter(18, (i) => ({
    dx: rand(-30, 30),
    dy: -rand(20, 60),
    size: rand(14, 30),
    scale: rand(4, 9),
    delay: 1.25 + i * 0.055,
  }));

  return (
    <div className="anim anim-drum">
      <div className="drum-dim" />
      <div className="drum-stage">
        <div className="drum-cig">
          <span className="drum-filter" />
          <span className="drum-paper" />
          <span className="drum-tip" />
          <span className="drum-flame" />
        </div>
      </div>
      {puffs.map((puff, i) => (
        <span
          key={i}
          className="drum-puff"
          style={vars({
            width: `${puff.size}vmin`,
            height: `${puff.size}vmin`,
            "--dx": `${puff.dx}vw`,
            "--dy": `${puff.dy}vh`,
            "--scale": puff.scale,
            animationDelay: `${puff.delay}s`,
          })}
        />
      ))}
      <div className="drum-smoke" />
      <p className="drum-caption">Fumare uccide (il tempo).</p>
    </div>
  );
}
