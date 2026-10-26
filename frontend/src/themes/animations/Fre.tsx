import { asset, type AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./fre.css";

const SHARDS = 12;

/** Arriva l'amore, ma un divieto enorme lo ferma: doccia fredda, tutto ghiaccia e va in frantumi. */
export default function Fre(props: AnimationProps) {
  useTimeline(props, 380, 4100);

  const hearts = useScatter(16, () => ({ left: rand(4, 96), size: rand(18, 42), delay: rand(0, 0.9), dur: rand(1.6, 2.6) }));
  const shards = useScatter(SHARDS, (i) => {
    const a0 = (i / SHARDS) * Math.PI * 2;
    const a1 = ((i + 1) / SHARDS) * Math.PI * 2;
    const cx = 50 + rand(-6, 6);
    const cy = 46 + rand(-6, 6);
    const p = (a: number) => `${cx + Math.cos(a) * 150}% ${cy + Math.sin(a) * 150}%`;
    return {
      clip: `polygon(${cx}% ${cy}%, ${p(a0)}, ${p(a1)})`,
      dx: Math.cos((a0 + a1) / 2) * rand(10, 30),
      rot: rand(-25, 25),
      delay: 2.95 + rand(0, 0.15),
    };
  });

  return (
    <div className="anim anim-fre">
      <div className="fre-love">
        {hearts.map((heart, i) => (
          <span
            key={i}
            className="fre-float"
            style={vars({ left: `${heart.left}%`, fontSize: heart.size, animationDelay: `${heart.delay}s`, animationDuration: `${heart.dur}s` })}
          >
            ♥
          </span>
        ))}
        <img className="fre-heart" src={asset("fre/heartarrow.svg")} alt="" />
        <p className="fre-amore">Amore?</p>
        <img className="fre-no" src={asset("fre/prohibited.svg")} alt="" />
        <p className="fre-stamp">NO.</p>
      </div>

      <div className="fre-ice">
        <div className="fre-shower" />
        <p className="fre-cold">Doccia fredda</p>
        <img className="fre-shower-head" src={asset("fre/shower.svg")} alt="" />
        <svg className="fre-cracks" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M50 46L22 10M50 46L86 8M50 46L96 58M50 46L70 98M50 46L8 74M50 46L30 96M50 46L4 40" pathLength={1} />
        </svg>
      </div>

      {shards.map((shard, i) => (
        <div
          key={i}
          className="fre-shard"
          style={vars({ clipPath: shard.clip, "--dx": `${shard.dx}vw`, "--rot": `${shard.rot}deg`, animationDelay: `${shard.delay}s` })}
        />
      ))}
    </div>
  );
}
