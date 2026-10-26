import type { AnimationProps } from "../registry";
import Noob from "../Noob";
import { useTimeline } from "./shared";
import "./roblox.css";

/** Caricamento del server, spawn col campo di forza, chat censurata, "oof" e l'avatar va in pezzi. */
export default function Roblox(props: AnimationProps) {
  useTimeline(props, 300, 4100);
  return (
    <div className="anim anim-roblox">
      <div className="rx-world">
        <div className="rx-sky" />
        <div className="rx-baseplate" />
        <div className="rx-spawn">
          <span className="rx-pad" />
          <div className="rx-player">
            <span className="rx-name">mario_rossi2009</span>
            <span className="rx-bubble rx-bubble-1">ciao raga</span>
            <span className="rx-bubble rx-bubble-2">chi mi da ##### robux</span>
            <span className="rx-forcefield" />
            <Noob className="rx-noob" />
          </div>
        </div>
        <p className="rx-oof">OOF!</p>
      </div>

      <div className="rx-loading">
        <span className="rx-logo" />
        <p className="rx-joining">Entrando nel server…</p>
        <p className="rx-place">Registro 4ªB [OBBY] 🏫</p>
        <div className="rx-progress">
          <i />
        </div>
        <p className="rx-tip">Suggerimento: non cadere dalla mappa.</p>
      </div>
    </div>
  );
}
