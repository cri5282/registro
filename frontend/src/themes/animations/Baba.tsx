import { asset, type AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./baba.css";

const RAINBOW = ["#e40303", "#ff8c00", "#ffed00", "#008026", "#24408e", "#732982"];
const CONFETTI = [...RAINBOW, "#ff5fa2", "#ffffff", "#5bcefa"];

/** Scende la palla stroboscopica, la stanza gira, onda arcobaleno e cannone di coriandoli. */
export default function Baba(props: AnimationProps) {
  useTimeline(props, 420, 4900);

  const specks = useScatter(42, (i) => ({
    x: rand(0, 100),
    y: rand(0, 100),
    size: rand(4, 12),
    color: CONFETTI[i % CONFETTI.length],
  }));

  const confetti = useScatter(56, (i) => {
    const left = i % 2 === 0;
    return {
      left,
      dx: (left ? 1 : -1) * rand(10, 55),
      peak: -rand(45, 90),
      spin: rand(-900, 900),
      color: CONFETTI[i % CONFETTI.length],
      w: rand(6, 12),
      h: rand(10, 18),
      delay: 3.3 + rand(0, 0.25),
    };
  });

  return (
    <div className="anim anim-baba">
      <div className="bb-room">
        <div className="bb-specks">
          {specks.map((speck, i) => (
            <span
              key={i}
              className="bb-speck"
              style={vars({
                left: `${speck.x}%`,
                top: `${speck.y}%`,
                width: speck.size,
                height: speck.size,
                "--c": speck.color,
              })}
            />
          ))}
        </div>
        <div className="bb-ball">
          <span className="bb-string" />
          <img src={asset("baba/mirrorball.svg")} alt="" />
        </div>
        <p className="bb-slay">SLAY</p>
      </div>

      <div className="bb-wave">
        {RAINBOW.map((color, i) => (
          <span key={i} style={vars({ background: color })} />
        ))}
      </div>

      {confetti.map((piece, i) => (
        <span
          key={i}
          className={`bb-confetti ${piece.left ? "from-left" : "from-right"}`}
          style={vars({
            width: piece.w,
            height: piece.h,
            background: piece.color,
            "--dx": `${piece.dx}vw`,
            "--peak": `${piece.peak}vh`,
            "--spin": `${piece.spin}deg`,
            animationDelay: `${piece.delay}s`,
          })}
        />
      ))}
    </div>
  );
}
