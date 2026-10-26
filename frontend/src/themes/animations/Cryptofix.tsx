import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./cryptofix.css";

const CABLES = [
  "M-20 120C200 150 260 300 500 300",
  "M1020 80C800 120 760 280 500 300",
  "M-20 520C220 480 300 360 500 300",
  "M1020 560C780 500 720 380 500 300",
  "M300 -20C320 140 420 220 500 300",
  "M720 640C680 480 580 380 500 300",
];

/** Città in rovina, i cavi al neon si accendono, CRYPTOFIX, cassa, accordo, e il palco si spezza in blocchi. */
export default function Cryptofix(props: AnimationProps) {
  useTimeline(props, 300, 4200);
  const coins = useScatter(14, () => ({ x: rand(4, 96), d: rand(2.2, 3), s: rand(18, 40) }));
  return (
    <div className="anim anim-cf">
      <div className="cf-stage">
        <img className="cf-poster" src={asset("cryptofix/poster.webp")} alt="" />
        <span className="cf-dark" />
        <svg className="cf-cables" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {CABLES.map((d, i) => (
            <g key={d} className={i % 2 ? "cf-cable-pink" : "cf-cable-cyan"} style={vars({ "--d": `${0.3 + i * 0.1}s` })}>
              <path className="cf-glow" d={d} pathLength={1} />
              <path d={d} pathLength={1} />
            </g>
          ))}
        </svg>
        <p className="cf-logo">CRYPTOFIX</p>
        <p className="cf-slogan">DECENTRALIZZA IL RUMORE</p>
        <span className="cf-wave" />
        {coins.map((coin, i) => (
          <span key={i} className="cf-coin" style={vars({ left: `${coin.x}%`, fontSize: `${coin.s}px`, animationDelay: `${coin.d}s` })}>
            ₿
          </span>
        ))}
      </div>
      <div className="cf-blocks">
        {Array.from({ length: 40 }, (_, i) => (
          <span key={i} style={vars({ "--d": `${3.2 + ((i % 8) + Math.floor(i / 8)) * 0.05}s` })} />
        ))}
      </div>
    </div>
  );
}
