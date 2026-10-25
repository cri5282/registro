import { asset, type AnimationProps } from "../registry";
import { rand, useScatter, useTimeline, vars } from "./shared";
import "./surebet.css";

const SYMBOLS = ["🍒", "⚽", "💰", "🍋", "🔔", "🎲"];
const REEL_LENGTH = 14;

/** Slot machine sul 7-7-7, pioggia di monete, schedina stampata e timbro VINCENTE. */
export default function Surebet(props: AnimationProps) {
  useTimeline(props, 350, 4700);

  // Ogni rullo è una striscia di simboli casuali che finisce sul 7.
  const reels = useScatter(3, () => [
    ...Array.from({ length: REEL_LENGTH - 1 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]),
    "7️⃣",
  ]);

  const coins = useScatter(18, () => ({
    dx: rand(-45, 45),
    dy: -rand(20, 45),
    spin: rand(360, 1080),
    delay: 1.4 + rand(0, 0.25),
  }));

  return (
    <div className="anim anim-surebet">
      <div className="sb-backdrop" />

      <div className="sb-machine">
        <div className="sb-marquee">JACKPOT</div>
        <div className="sb-window">
          {reels.map((reel, i) => (
            <div key={i} className="sb-reel">
              <div className="sb-strip" style={vars({ animationDuration: `${0.75 + i * 0.22}s`, "--n": REEL_LENGTH - 1 })}>
                {reel.map((symbol, j) => (
                  <span key={j}>{symbol}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {coins.map((coin, i) => (
        <img
          key={i}
          className="sb-coin"
          src={asset("surebet/coin.svg")}
          alt=""
          style={vars({
            "--dx": `${coin.dx}vw`,
            "--dy": `${coin.dy}vh`,
            "--spin": `${coin.spin}deg`,
            animationDelay: `${coin.delay}s`,
          })}
        />
      ))}

      <div className="sb-slip-slot">
        <div className="sb-slip">
          <p className="sb-slip-head">
            <strong>SCHEDINA #0004</strong>
            <span>Multipla · 3 eventi</span>
          </p>
          <p>
            <span>Presenza</span>
            <b>@1.01</b>
          </p>
          <p>
            <span>Assenza</span>
            <b>@12.00</b>
          </p>
          <p>
            <span>Uscita anticipata</span>
            <b>@3.50</b>
          </p>
          <p className="sb-slip-total">
            <span>Vincita potenziale</span>
            <b>∞ €</b>
          </p>
          <div className="sb-stamp">Vincente</div>
        </div>
      </div>
    </div>
  );
}
