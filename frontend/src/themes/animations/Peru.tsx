import { asset, type AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./peru.css";

const ROWS = 12;

const PALETTES = [
  ["#d7263d", "#f2a900", "#1fa5a0", "#f6e7cf"],
  ["#7b2d8b", "#ff7a00", "#d7263d", "#1c1310"],
  ["#1fa5a0", "#f6e7cf", "#d7263d", "#f2a900"],
  ["#ff7a00", "#1c1310", "#7b2d8b", "#1fa5a0"],
];

/** Il telaio tesse lo schermo, arriva il lama, ti fissa e ti sputa. */
export default function Peru(props: AnimationProps) {
  useTimeline(props, 1150, 4700);

  const drips = useScatter(16, () => ({
    left: rand(0, 100),
    width: rand(3, 9),
    length: rand(20, 70),
    delay: rand(0, 0.35),
  }));

  return (
    <div className="anim anim-peru">
      <div className="peru-loom">
        {Array.from({ length: ROWS }, (_, i) => {
          const [a, b, c, d] = PALETTES[i % PALETTES.length];
          return (
            <div
              key={i}
              className={`peru-row ${i % 2 ? "from-right" : "from-left"}`}
              style={vars({
                "--a": a,
                "--b": b,
                "--c": c,
                "--d": d,
                animationDelay: `${0.05 + i * 0.07}s`,
              })}
            />
          );
        })}
      </div>

      <div className="peru-llama">
        <div className="peru-bubble">¡Habla, causa!</div>
        <img src={asset("peru/llama.svg")} alt="" />
      </div>

      <div className="peru-spit">
        <div className="peru-splat">
          {drips.map((drip, i) => (
            <span
              key={i}
              className="peru-drip"
              style={vars({
                left: `${drip.left}%`,
                width: `${drip.width}vmin`,
                "--len": `${drip.length}vh`,
                animationDelay: `${3.2 + drip.delay}s`,
              })}
            />
          ))}
        </div>
      </div>
      <div className="peru-gob" />
    </div>
  );
}
