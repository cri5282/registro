import type { AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./greentheory.css";

/** Palestra al buio, i neon verdi si accendono, il bilanciere sbatte, tre ripetizioni e VENI VIDI SQUAT. */
export default function Greentheory(props: AnimationProps) {
  useTimeline(props, 300, 4000);
  const chalk = useScatter(10, () => ({ x: rand(-160, 160), y: rand(-90, -20), s: rand(40, 110) }));
  return (
    <div className="anim anim-gt">
      <div className="gt-gym">
        <div className="gt-neons">
          {[0, 1, 2].map((i) => (
            <span key={i} className="gt-neon" style={vars({ animationDelay: `${0.1 + i * 0.2}s` })} />
          ))}
        </div>
        <p className="gt-word">DISCIPLINA.</p>
        <div className="gt-lift">
          <div className="gt-bar">
            <span className="gt-plate gt-plate-l" />
            <span className="gt-plate gt-plate-l gt-plate-small" />
            <span className="gt-plate gt-plate-r" />
            <span className="gt-plate gt-plate-r gt-plate-small" />
          </div>
          {chalk.map((puff, i) => (
            <span
              key={i}
              className="gt-chalk"
              style={vars({ "--x": `${puff.x}px`, "--y": `${puff.y}px`, width: `${puff.s}px`, height: `${puff.s}px` })}
            />
          ))}
        </div>
        <div className="gt-reps">
          {["1", "2", "3"].map((rep, i) => (
            <b key={rep} style={vars({ animationDelay: `${1.55 + i * 0.3}s` })}>
              {rep}
            </b>
          ))}
        </div>
        <p className="gt-motto">
          <span>🌿</span> VENI · VIDI · SQUAT <span>🌿</span>
        </p>
      </div>
      <span className="gt-wipe" />
    </div>
  );
}
