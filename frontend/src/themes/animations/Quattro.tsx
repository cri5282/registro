import type { AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./quattro.css";

const SHARDS = 14;

/** Il vetro va in frantumi, entra il campione: "Devi darmi quattro euro". */
export default function Quattro(props: AnimationProps) {
  useTimeline(props, 650, 4500);

  // Spicchi di vetro attorno al centro dello schermo, ognuno vola via lungo la sua bisettrice.
  const shards = useScatter(SHARDS, (i) => {
    const a0 = (i / SHARDS) * Math.PI * 2 + rand(-0.12, 0.12);
    const a1 = ((i + 1) / SHARDS) * Math.PI * 2 + rand(-0.12, 0.12);
    const mid = (a0 + a1) / 2;
    const r = 150;
    const p = (a: number, k = 1) => `${50 + Math.cos(a) * r * k}% ${50 + Math.sin(a) * r * k}%`;
    return {
      clip: `polygon(50% 50%, ${p(a0)}, ${p(mid, 1.05)}, ${p(a1)})`,
      dx: Math.cos(mid) * rand(30, 70),
      dy: Math.sin(mid) * rand(30, 70) + 25,
      rot: rand(-50, 50),
      delay: rand(0, 0.12),
    };
  });

  const sparks = useScatter(26, (i) => ({
    side: i % 2 === 0 ? "left" : "right",
    dx: (i % 2 === 0 ? 1 : -1) * rand(8, 38),
    dy: -rand(30, 75),
    delay: 2.05 + rand(0, 0.5),
    hue: rand(30, 55),
  }));

  return (
    <div className="anim anim-quattro">
      <div className="q-backdrop" />
      <svg className="q-cracks" viewBox="0 0 100 100" preserveAspectRatio="none">
        {shards.map((_, i) => {
          const a = (i / SHARDS) * Math.PI * 2;
          return (
            <line key={i} x1="50" y1="50" x2={50 + Math.cos(a) * 80} y2={50 + Math.sin(a) * 80} pathLength={1} />
          );
        })}
        <circle cx="50" cy="50" r="6" pathLength={1} />
        <circle cx="50" cy="50" r="15" pathLength={1} />
      </svg>
      {shards.map((shard, i) => (
        <div
          key={i}
          className="q-shard"
          style={vars({
            clipPath: shard.clip,
            "--dx": `${shard.dx}vw`,
            "--dy": `${shard.dy}vh`,
            "--rot": `${shard.rot}deg`,
            animationDelay: `${0.42 + shard.delay}s`,
          })}
        />
      ))}

      <div className="q-stage">
        <div className="q-title">
          <span className="q-line q-line-1">Devi darmi</span>
          <span className="q-line q-line-2">quattro euro</span>
        </div>
        <div className="q-belt">
          <span className="q-belt-strap" />
          <span className="q-belt-plate">
            <strong>4 €</strong>
            <small>campione dei debiti</small>
          </span>
        </div>
      </div>

      {sparks.map((spark, i) => (
        <span
          key={i}
          className={`q-spark q-spark-${spark.side}`}
          style={vars({
            "--dx": `${spark.dx}vw`,
            "--dy": `${spark.dy}vh`,
            "--hue": spark.hue,
            animationDelay: `${spark.delay}s`,
          })}
        />
      ))}
    </div>
  );
}
