import type { AnimationProps } from "../registry";
import { useTimeline } from "./shared";
import "./chantalle.css";

/** Schermata di blocco finta: orologio enorme, notifica, "scorri per sbloccare" e su. */
export default function Chantalle(props: AnimationProps) {
  useTimeline(props, 320, 4500);

  const now = new Date();
  const time = now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="anim anim-chantalle">
      <div className="ch-lock">
        <div className="ch-status">
          <span>{time}</span>
          <span className="ch-status-icons">
            <i className="ch-signal" />
            <i className="ch-battery" />
          </span>
        </div>
        <div className="ch-island" />
        <div className="ch-clock">
          <p className="ch-date">{date}</p>
          <p className="ch-time">{time}</p>
        </div>
        <div className="ch-notif">
          <span className="ch-app" />
          <div>
            <p>
              <strong>Registro</strong>
              <span>ora</span>
            </p>
            <p>Chantalle, il tuo tema è pronto 💅</p>
          </div>
        </div>
        <p className="ch-slide">scorri per sbloccare</p>
        <span className="ch-home" />
      </div>

      <div className="ch-island-big">
        <span className="ch-island-check">✓</span>
        <span>Tema installato</span>
      </div>
    </div>
  );
}
