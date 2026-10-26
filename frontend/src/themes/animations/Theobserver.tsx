import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import { useTimeline, vars } from "./shared";
import "./theobserver.css";

const NOTES = [
  "un occhio",
  "cos'è?",
  "ti guarda",
  "è rotondo (quasi)",
  "la pupilla, credo",
  "perché??",
  "osserva",
  "sta osservando TE",
];

const CENTER = 300;

/** Frecce a penna da ogni parte verso un enorme occhio che si apre, si guarda intorno e ti fissa. */
export default function Theobserver(props: AnimationProps) {
  useTimeline(props, 300, 4300);
  const arrows = NOTES.map((note, i) => {
    const angle = (i / NOTES.length) * Math.PI * 2 - Math.PI / 2 + 0.3;
    const point = (r: number) => [CENTER + Math.cos(angle) * r * 1.15, CENTER + Math.sin(angle) * r] as const;
    const [x1, y1] = point(205);
    const [x2, y2] = point(92);
    const [lx, ly] = point(232);
    // Curva a mano: il punto di controllo esce di lato.
    const cx = (x1 + x2) / 2 + Math.sin(angle) * 40;
    const cy = (y1 + y2) / 2 - Math.cos(angle) * 40;
    const head = Math.atan2(y2 - cy, x2 - cx);
    const wing = (side: number) => `${x2 - Math.cos(head + side) * 16},${y2 - Math.sin(head + side) * 16}`;
    return {
      note,
      path: `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`,
      headPath: `M${wing(0.45)}L${x2},${y2}L${wing(-0.45)}`,
      lx,
      ly,
      anchor: (Math.abs(lx - CENTER) < 40 ? "middle" : lx < CENTER ? "end" : "start") as "middle" | "end" | "start",
      delay: 1.35 + i * 0.13,
    };
  });

  return (
    <div className="anim anim-observer">
      <div className="ob-paper">
        <img className="ob-lens" src={asset("theobserver/magnifier.svg")} alt="" />
        <p className="ob-question">cos'è questo?</p>
        <svg className="ob-stage" viewBox="0 0 600 600">
          <defs>
            <clipPath id="ob-almond">
              <path d="M180 300Q300 180 420 300Q300 420 180 300Z" />
            </clipPath>
          </defs>
          <g className="ob-eye">
            <g clipPath="url(#ob-almond)">
              <rect x="170" y="200" width="260" height="200" fill="#fff" />
              <g className="ob-look">
                <circle cx="300" cy="300" r="48" fill="#3f8f7a" />
                <circle cx="300" cy="300" r="48" fill="none" stroke="#1d4d40" strokeWidth="4" />
                <circle className="ob-pupil" cx="300" cy="300" r="20" fill="#111" />
                <circle cx="316" cy="284" r="8" fill="#fff" />
              </g>
              <rect className="ob-lid ob-lid-top" x="170" y="200" width="260" height="101" fill="#f6f1e3" />
              <rect className="ob-lid ob-lid-bottom" x="170" y="299" width="260" height="101" fill="#f6f1e3" />
            </g>
            <path d="M180 300Q300 180 420 300Q300 420 180 300Z" fill="none" stroke="#1b1b1b" strokeWidth="5" strokeLinejoin="round" />
            <path className="ob-lashes" d="M205 268L192 248M240 247L233 224M280 237L278 212M320 237L322 212M360 247L367 224M395 268L408 248" stroke="#1b1b1b" strokeWidth="5" strokeLinecap="round" />
          </g>
          {arrows.map((arrow) => (
            <g key={arrow.note} className="ob-arrow" style={vars({ "--d": `${arrow.delay}s` })}>
              <path className="ob-line" d={arrow.path} pathLength={1} />
              <path className="ob-head" d={arrow.headPath} />
              <text x={arrow.lx} y={arrow.ly} textAnchor={arrow.anchor} dominantBaseline="middle">
                {arrow.note}
              </text>
            </g>
          ))}
        </svg>
        <p className="ob-stamp">Osservato.</p>
      </div>
    </div>
  );
}
