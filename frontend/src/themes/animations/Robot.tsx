import type { AnimationProps } from "../registry";
import { useTimeline, vars } from "./shared";
import "./robot.css";

const BOOT = [
  ["REGISTRO-3000 BIOS v2.6", "(c) 4ªB Robotics"],
  ["Controllo memoria", "640K OK"],
  ["Caricamento PRESENZE.SYS", "OK"],
  ["Calibrazione sarcasmo", "100%"],
  ["Rilevamento studente", "TROVATO"],
  ["Interfaccia emotiva", "NON TROVATA"],
];

/** Avvio da BIOS, faccia del robot che si accende, scansione che rivela il nuovo tema. */
export default function Robot(props: AnimationProps) {
  useTimeline(props, 260, 4000);
  return (
    <div className="anim anim-robot">
      <div className="rb-screen">
        <div className="rb-boot">
          {BOOT.map(([label, result], i) => (
            <p key={label} style={vars({ animationDelay: `${0.2 + i * 0.17}s` })}>
              <span>{label}</span>
              <span className="rb-dots" />
              <strong className={result.includes("NON") ? "rb-warn" : undefined}>{result}</strong>
            </p>
          ))}
        </div>

        <div className="rb-head">
          <span className="rb-antenna" />
          <div className="rb-face">
            <span className="rb-eye" />
            <span className="rb-eye" />
            <div className="rb-mouth">
              {Array.from({ length: 7 }, (_, i) => (
                <i key={i} style={vars({ animationDelay: `${i * 0.07}s` })} />
              ))}
            </div>
          </div>
          <span className="rb-bolt rb-bolt-l" />
          <span className="rb-bolt rb-bolt-r" />
        </div>
        <p className="rb-speech">BEEP BOOP. CIAO, UMANO.</p>
      </div>
      <span className="rb-scanline" />
    </div>
  );
}
