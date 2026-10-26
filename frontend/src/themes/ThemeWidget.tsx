import { useEffect, useState, type ReactNode } from "react";
import { asset } from "./registry";
import { useTheme } from "./ThemeProvider";
import type { ThemeId } from "./words";
import "./decor.css";
import "./decor-extra.css";
import "./decor-more.css";
import Waifu from "./Waifu";
import Noob from "./Noob";
import RaceCar from "./RaceCar";
import WateringCan from "./WateringCan";
import { FollowEye } from "./ObserverNotes";
import { EGG_EVENT, readDebt } from "./eggs";
import { uomo } from "./Uomo";

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

/** Il debito del tema quattro, che cresce con gli interessi dell'easter egg. */
function Debt() {
  const [debt, setDebt] = useState(readDebt);
  useEffect(() => {
    const refresh = () => window.setTimeout(() => setDebt(readDebt()), 600);
    window.addEventListener(EGG_EVENT, refresh);
    return () => window.removeEventListener(EGG_EVENT, refresh);
  }, []);
  return <>{debt.toLocaleString("it-IT")} €</>;
}

/** Quante cose l'osservatore ha annotato sulla pagina. */
function ObservedCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setCount(document.querySelectorAll(".obs-note").length), 1500);
    return () => window.clearInterval(timer);
  }, []);
  return <>{count}</>;
}

/** Cronometro dei 24 secondi, sempre in corsa. */
function ShotClock() {
  const [left, setLeft] = useState(24);
  useEffect(() => {
    const timer = window.setInterval(() => setLeft((value) => (value <= 0 ? 24 : value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <>{String(left).padStart(2, "0")}</>;
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
        <strong>
          <Debt />
        </strong>
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
  chantal: () => (
    <div className="tw tw-chantal">
      <div className="tw-chantal-rings" aria-hidden="true">
        <span style={{ ["--p" as string]: "87%" }}>📱</span>
        <span style={{ ["--p" as string]: "64%" }}>🎧</span>
        <span style={{ ["--p" as string]: "100%" }}>⌚</span>
      </div>
      <p className="tw-chantal-time">
        <Clock />
      </p>
      <p className="tw-text">Batteria · Tutti i dispositivi di Chantal</p>
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
  overthinker: () => (
    <div className="tw tw-ot">
      <Waifu className="tw-ot-waifu" />
      <div className="tw-ot-dialog">
        <span>Waifu-chan</span>
        <p>Senpai, ai făcut temele? Cioè… hai fatto i compiti? 🥺</p>
      </div>
      <div className="tw-ot-xp" aria-label="Livello 17">
        <span>LVL 17</span>
        <i />
      </div>
    </div>
  ),
  fre: () => {
    const days = Math.floor((Date.now() - new Date(2025, 8, 15).getTime()) / 86_400_000);
    return (
      <div className="tw tw-fre">
        <p className="tw-text">Giorni di purezza</p>
        <p className="tw-fre-streak">{days.toLocaleString("it-IT")}</p>
        <div className="tw-fre-cert">
          <strong>Voto solenne</strong>
          <span>Zero tentazioni, solo lezioni.</span>
          <i>APPROVATO</i>
        </div>
      </div>
    );
  },
  robot: () => (
    <div className="tw tw-rb">
      <div className="tw-rb-face" aria-hidden="true">
        <span />
        <span />
        <div>
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
      <p className="tw-rb-stats">CPU 42% · RAM 3,2 GB</p>
      <p className="tw-text">Umore: binario. Battute: in caricamento…</p>
    </div>
  ),
  uomo: () => (
    <figure className="tw tw-uomo">
      <img src={asset("uomo/scroll.svg")} alt="" />
      <blockquote>«{uomo("L'uomo è misura di tutte le cose")}»</blockquote>
      <figcaption>Protagora, V secolo a.C.</figcaption>
    </figure>
  ),
  roblox: () => (
    <div className="tw tw-rx">
      <div className="tw-rx-stage">
        <Noob className="tw-rx-noob" />
      </div>
      <p className="tw-rx-name">mario_rossi2009</p>
      <p className="tw-rx-robux">⬢ 1.337</p>
      <span className="tw-rx-play">▶ Gioca</span>
    </div>
  ),
  saetta: () => (
    <div className="tw tw-sa">
      <RaceCar className="tw-sa-car" />
      <p className="tw-title">Classifica Piston Cup</p>
      <ol className="tw-sa-standings">
        <li>
          <b>95</b> Saetta McQueen <span>⚡</span>
        </li>
        <li>
          <b>86</b> Chick Hicks
        </li>
        <li>
          <b>43</b> Il Re
        </li>
      </ol>
    </div>
  ),
  theobserver: () => (
    <div className="tw tw-ob">
      <FollowEye className="tw-ob-eye" />
      <p className="tw-title">L'Osservatore</p>
      <p className="tw-ob-stats">
        Elementi osservati: <b><ObservedCount /></b>
        <br />
        Domande senza risposta: <b>∞</b>
      </p>
    </div>
  ),
  darko: () => (
    <div className="tw tw-dk">
      <div className="tw-dk-cover">
        <span className="vinyl tw-dk-vinyl" />
        <div className="tw-dk-sleeve">
          <strong>DARKO</strong>
          <span>SENZA MAMMA</span>
          <i>PARENTAL ADVISORY</i>
        </div>
      </div>
      <ol className="tw-dk-tracks">
        <li>Intro (mamma?)</li>
        <li>Festa della mamma (skit)</li>
        <li>Orfano feat. Nessuno</li>
      </ol>
    </div>
  ),
  justeat: () => (
    <div className="tw tw-je">
      <p className="tw-je-head">
        Ordine <b>#4B</b> · in arrivo
      </p>
      <div className="tw-je-road">
        <img className="tw-je-scooter" src={asset("justeat/scooter.svg")} alt="" />
        <img className="tw-je-house" src={asset("justeat/house.svg")} alt="" />
      </div>
      <ol className="tw-je-steps">
        <li className="is-done">Ordine confermato</li>
        <li className="is-done">In preparazione</li>
        <li className="is-now">Il rider è per strada</li>
      </ol>
    </div>
  ),
  greentheory: () => (
    <div className="tw tw-gt">
      <p className="tw-gt-head">
        Scheda di oggi <span>24/7</span>
      </p>
      <table className="tw-gt-sheet">
        <tbody>
          <tr>
            <td>Panca piana</td>
            <td>4×10</td>
            <td>✅</td>
          </tr>
          <tr>
            <td>Squat</td>
            <td>5×5</td>
            <td>✅</td>
          </tr>
          <tr>
            <td>Gallette di riso</td>
            <td>3×1</td>
            <td>🍘</td>
          </tr>
        </tbody>
      </table>
      <p className="tw-gt-streak">🔥 Streak: 47 giorni</p>
    </div>
  ),
  cryptofix: () => (
    <div className="tw tw-cf">
      <img className="tw-cf-poster" src={asset("cryptofix/poster.webp")} alt="Cryptofix" />
      <div className="tw-cf-eq" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} style={{ animationDelay: `${(i * 0.13) % 0.6}s` }} />
        ))}
      </div>
      <p className="tw-title">Prossima data: sabato</p>
      <p className="tw-text">Live on-chain · ingresso 0,0004 ₿</p>
    </div>
  ),
  ortol: () => (
    <div className="tw tw-or">
      <WateringCan className="tw-or-can" />
      <div className="tw-or-bed">
        {["tomato", "lettuce", "carrot", "seedling", "tomato"].map((crop, i) => (
          <img key={i} src={asset(`ortol/${crop}.svg`)} alt="" />
        ))}
      </div>
      <p className="tw-title">Prossima annaffiatura: ora 💧</p>
      <p className="tw-text">Raccolto della settimana: 12 🍅 · 3 🥕 · 1 🐌 (abusivo)</p>
    </div>
  ),
  basket: () => (
    <div className="tw tw-bk">
      <div className="tw-bk-hoop" aria-hidden="true">
        <span className="tw-bk-board" />
        <span className="tw-bk-rim" />
        <span className="tw-bk-net" />
      </div>
      <div className="tw-bk-score">
        <span>4ªB</span>
        <b>87</b>
        <i>
          <ShotClock />
        </i>
        <b>85</b>
        <span>PROF</span>
      </div>
      <p className="tw-text">4° quarto · palla in mano a te</p>
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
