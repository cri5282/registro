import { asset, type AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./bicicletta.css";

const STRIPES = ["#5bcefa", "#f5a9b8", "#ffffff", "#f5a9b8", "#5bcefa"];

function Wheel({ cx }: { cx: number }) {
  return (
    <g className="bk-wheel" style={vars({ transformOrigin: `${cx}px 50px` })}>
      <circle cx={cx} cy="50" r="17" />
      {[0, 30, 60, 90, 120, 150].map((angle) => (
        <line key={angle} x1={cx} y1="33" x2={cx} y2="67" transform={`rotate(${angle} ${cx} 50)`} />
      ))}
    </g>
  );
}

function Bike() {
  return (
    <svg className="bk-bike" viewBox="0 0 124 72">
      <g className="bk-pennant">
        <line x1="22" y1="46" x2="12" y2="2" />
        {STRIPES.map((color, i) => (
          <rect key={i} x="13" y={3 + i * 3.2} width="20" height="3.2" fill={color} transform="skewY(-6)" />
        ))}
      </g>
      <Wheel cx={26} />
      <Wheel cx={96} />
      <g className="bk-frame">
        <path d="M26 50 L52 50 L82 24 L46 24 Z" />
        <path d="M52 50 L42 16" />
        <path d="M96 50 L80 18 L76 10 L88 8" />
      </g>
      <path className="bk-seat" d="M34 15 Q42 11 50 15" />
      <circle className="bk-hub" cx="52" cy="50" r="4" />
    </svg>
  );
}

/** La bici pedala e la scia dipinge la bandiera trans su tutto lo schermo. */
export default function Bicicletta(props: AnimationProps) {
  useTimeline(props, 1500, 3900);

  const sparkles = useScatter(14, () => ({
    dx: rand(-26, 26),
    dy: rand(-26, 20),
    size: rand(4, 9),
    delay: 1.95 + rand(0, 0.3),
  }));

  return (
    <div className="anim anim-bici">
      <div className="bk-flag">
        {STRIPES.map((color, i) => (
          <span key={i} className={`bk-stripe ${i % 2 ? "to-right" : "to-left"}`} style={vars({ background: color })} />
        ))}
      </div>

      <p className="bk-caption">Pedala fiera</p>

      <div className="bk-rider bk-rider-out">
        <Bike />
      </div>
      <div className="bk-rider bk-rider-back">
        <Bike />
      </div>

      {sparkles.map((sparkle, i) => (
        <img
          key={i}
          className="bk-sparkle"
          src={asset("bicicletta/sparkles.svg")}
          alt=""
          style={vars({
            width: `${sparkle.size}vmin`,
            "--dx": `${sparkle.dx}vw`,
            "--dy": `${sparkle.dy}vh`,
            animationDelay: `${sparkle.delay}s`,
          })}
        />
      ))}
    </div>
  );
}
