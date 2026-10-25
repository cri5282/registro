import type { AnimationProps } from "../registry";
import { useTimeline, vars } from "./shared";
import "./kalashmikov.css";

const SHOTS = [
  { x: 50, y: 48, at: 1.15 },
  { x: 36, y: 60, at: 1.6 },
  { x: 63, y: 38, at: 2.05 },
];

/** Il mirino spazza lo schermo e aggancia; tre colpi aprono dei buchi da cui si vede il nuovo tema. */
export default function Kalashmikov(props: AnimationProps) {
  useTimeline(props, 1180, 3900);
  return (
    <div className="anim anim-kalash">
      <div className="ka-scope">
        <span className="ka-cross" />
        <span className="ka-label">Bersaglio acquisito</span>
      </div>

      <div className="ka-wall" />

      {SHOTS.map((shot, i) => (
        <svg
          key={i}
          className="ka-cracks"
          viewBox="-50 -50 100 100"
          style={vars({ left: `${shot.x}%`, top: `${shot.y}%`, animationDelay: `${shot.at}s, 2.55s` })}
        >
          {Array.from({ length: 9 }, (_, j) => {
            const a = (j / 9) * Math.PI * 2 + i;
            const r = 26 + ((j * 7 + i * 3) % 5) * 5;
            return <line key={j} x1={Math.cos(a) * 6} y1={Math.sin(a) * 6} x2={Math.cos(a) * r} y2={Math.sin(a) * r} />;
          })}
          <circle r="9" />
        </svg>
      ))}

      {SHOTS.map((shot, i) => (
        <span key={i} className="ka-casing" style={vars({ animationDelay: `${shot.at + 0.05}s`, "--drift": `${8 + i * 7}vw` })} />
      ))}

      <div className="ka-flash" />
    </div>
  );
}
