import { useEffect, useState, type ReactNode } from "react";
import { asset } from "./registry";
import { useTheme } from "./ThemeProvider";
import type { ThemeId } from "./words";
import "./decor.css";

const VERSES = [
  ["Beati i presenti, perché di essi è il sei in condotta.", "Mt 5,3 (più o meno)"],
  ["Chi è senza assenze scagli la prima giustifica.", "Gv 8,7 (quasi)"],
  ["Alzati e cammina… fino a scuola.", "Lc 5,23 (riadattato)"],
  ["Bussate e vi sarà aperto, ma dopo le 8:10 serve il permesso.", "Mt 7,7 (con postilla)"],
  ["Non di solo pane vivrà lo studente, ma anche di merendine.", "Mt 4,4 (versione bar)"],
  ["Lasciate che i compagni vengano a me, e copiate pure.", "Mc 10,14 (apocrifo)"],
];

function dayIndex(length: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000) % length;
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <>{now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</>;
}

const WIDGETS: Partial<Record<ThemeId, () => ReactNode>> = {
  peru: () => (
    <div className="tw tw-peru">
      <div className="tw-peru-quipu" aria-hidden="true">
        {["#d7263d", "#f2a900", "#1fa5a0", "#7b2d8b", "#ff7a00", "#f6e7cf"].map((color, i) => (
          <span key={i} style={{ backgroundColor: color, height: `${48 + ((i * 17) % 30)}px` }} />
        ))}
      </div>
      <img className="tw-peru-llama" src={asset("peru/llama.svg")} alt="" />
      <p className="tw-title">¡Habla, causa!</p>
      <p className="tw-text">Il quipu del giorno tiene il conto delle tue presenze con i nodi.</p>
    </div>
  ),
  holy: () => {
    const [verse, ref] = VERSES[dayIndex(VERSES.length)];
    return (
      <figure className="tw tw-holy">
        <span className="tw-holy-cross" aria-hidden="true">✝</span>
        <p className="tw-title">Versetto del giorno</p>
        <blockquote>«{verse}»</blockquote>
        <figcaption>{ref}</figcaption>
      </figure>
    );
  },
  quattro: () => (
    <div className="tw tw-quattro">
      <div className="tw-quattro-sign">
        <span>Devi darmi</span>
        <strong>4 €</strong>
      </div>
      <span className="tw-quattro-hands" aria-hidden="true">🙌🙌</span>
      <p className="tw-text">Il pubblico non dimentica. Neanche il debito.</p>
    </div>
  ),
  drum: () => (
    <div className="tw tw-drum">
      <div className="tw-drum-tray" aria-hidden="true">
        <span className="tw-drum-smoke" />
        <span className="tw-drum-smoke" />
        <span className="tw-drum-smoke" />
        <span className="tw-drum-cig" />
        <span className="tw-drum-butt" />
        <span className="tw-drum-butt" />
      </div>
      <p className="tw-title">Pacchetto: 19/20</p>
      <p className="tw-text">Una pausa ogni lezione, come da regolamento (non scritto).</p>
    </div>
  ),
  surebet: () => (
    <div className="tw tw-surebet">
      <p className="tw-text">Saldo disponibile</p>
      <p className="tw-surebet-balance">
        € 4,20 <img src={asset("surebet/coin.svg")} alt="" />
      </p>
      <div className="tw-surebet-bonus">
        <strong>Bonus 100%</strong>
        <span>sulla prossima assenza</span>
      </div>
      <span className="tw-surebet-cta">Gioca ora</span>
    </div>
  ),
  puglia: () => (
    <div className="tw tw-puglia">
      <img className="tw-puglia-nonna" src={asset("puglia/nonna.svg")} alt="" />
      <div className="tw-puglia-bubble">Mangia, ca' sì sicc!</div>
      <div className="tw-puglia-board" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  ),
  kalashmikov: () => (
    <div className="tw tw-kalash">
      <div className="tw-kalash-radar" aria-hidden="true">
        <span className="tw-kalash-sweep" />
        <i style={{ top: "28%", left: "62%" }} />
        <i style={{ top: "64%", left: "30%" }} />
        <i style={{ top: "44%", left: "74%" }} />
      </div>
      <p className="tw-title">Settore 4ªB</p>
      <p className="tw-text">Radar attivo. Nessun disertore in vista, soldato.</p>
    </div>
  ),
  bicicletta: () => (
    <div className="tw tw-bici">
      <img className="tw-bici-bike" src={asset("bicicletta/bicycle.svg")} alt="" />
      <p className="tw-bici-odometer" aria-label="42,7 chilometri">
        {"0042".split("").map((digit, i) => (
          <span key={i}>{digit}</span>
        ))}
        <span className="tw-bici-decimal">7</span>
        <small>km</small>
      </p>
      <p className="tw-text">Ogni presenza è una pedalata. Avanti tutta! 🏳️‍⚧️</p>
    </div>
  ),
  chantalle: () => (
    <div className="tw tw-chantalle">
      <div className="tw-chantalle-rings" aria-hidden="true">
        <span style={{ ["--p" as string]: "87%" }}>📱</span>
        <span style={{ ["--p" as string]: "64%" }}>🎧</span>
        <span style={{ ["--p" as string]: "100%" }}>⌚</span>
      </div>
      <p className="tw-chantalle-time">
        <Clock />
      </p>
      <p className="tw-text">Batteria · Tutti i dispositivi di Chantalle</p>
    </div>
  ),
  baba: () => (
    <div className="tw tw-baba">
      <span className="tw-baba-string" aria-hidden="true" />
      <img className="tw-baba-ball" src={asset("baba/mirrorball.svg")} alt="" />
      <p className="tw-title">Mood di oggi: favoloso</p>
      <p className="tw-text">Il tè caldo ☕ è che sei presente e stai benissimo.</p>
    </div>
  ),
};

/** Il "pezzo da collezione" del tema: in barra laterale su desktop, in fondo a Oggi su telefono. */
export default function ThemeWidget({ placement = "sidebar" }: { placement?: "sidebar" | "page" }) {
  const { theme } = useTheme();
  const Widget = WIDGETS[theme];
  if (!Widget) return null;
  return <div className={`theme-widget theme-widget-${placement}`}>{Widget()}</div>;
}
