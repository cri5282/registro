import type { AnimationProps } from "../registry";
import Waifu from "../Waifu";
import { useTimeline, vars } from "./shared";
import "./overthinker.css";

const KEY_ROWS = [14, 13, 12, 10];
const RO = ["#002b7f", "#fcd116", "#ce1126"];

/** Avvio del gioco, visual novel con la waifu che ti sgrida perché pensi troppo, poi LEVEL UP. */
export default function Overthinker(props: AnimationProps) {
  useTimeline(props, 350, 4500);
  return (
    <div className="anim anim-overthinker">
      <div className="ot-boot">
        <p className="ot-logo">OVERTHINKER</p>
        <p className="ot-start">▶ PRESS START</p>
        <div className="ot-keyboard">
          {KEY_ROWS.map((count, row) => (
            <div key={row} className="ot-row">
              {Array.from({ length: count }, (_, i) => (
                <span key={i} style={vars({ "--d": `${(i + row) * 0.035}s` })} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="ot-vn">
        <div className="ot-window" />
        <Waifu className="ot-waifu" />
        <div className="ot-thoughts">
          <span>e se…?</span>
          <span>ma se poi…</span>
          <span>e se il prof…</span>
        </div>
        <div className="ot-dialog">
          <span className="ot-name">Waifu-chan 🇷🇴</span>
          <p className="ot-line">Senpai… stai pensando troppo, di nuovo?</p>
          <div className="ot-choices">
            <span>▶ No, sono tranquillo</span>
            <span className="ot-pick">▶ Sì (decisamente sì)</span>
          </div>
        </div>
        <p className="ot-levelup">LEVEL UP!</p>
      </div>

      <div className="ot-flag">
        {RO.map((color, i) => (
          <span key={color} style={vars({ background: color, animationDelay: `${3.2 + i * 0.08}s, ${3.75 + i * 0.08}s` })} />
        ))}
      </div>
    </div>
  );
}
