import { useEffect, useRef, useState, type ReactNode } from "react";
import { asset } from "../registry";
import { doubleDebt } from "../eggs";
import { playShot } from "../sound";
import type { ThemeId } from "../words";
import { rand, useScatter, vars } from "../animations/shared";
import Noob from "../Noob";
import RaceCar from "../RaceCar";
import Waifu from "../Waifu";
import "./eggs.css";

interface EggProps {
  onDone: () => void;
}

/** Chiama onDone dopo ms, e mette una classe su <html> finché l'egg è vivo (per scuotere la pagina). */
function useEgg({ onDone }: EggProps, ms: number, htmlClass?: string) {
  const latest = useRef(onDone);
  latest.current = onDone;
  useEffect(() => {
    const root = document.documentElement;
    if (htmlClass) root.classList.add(htmlClass);
    const timer = window.setTimeout(() => latest.current(), ms);
    return () => {
      window.clearTimeout(timer);
      if (htmlClass) root.classList.remove(htmlClass);
    };
  }, [ms, htmlClass]);
}

function Caption({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <p className={`egg-caption ${className}`} style={vars({ animationDelay: `${delay}s` })}>
      {children}
    </p>
  );
}

function Confetti({ count = 26, colors }: { count?: number; colors: string[] }) {
  const bits = useScatter(count, (i) => ({
    color: colors[i % colors.length],
    x: rand(-46, 46),
    y: rand(-60, -20),
    r: rand(-540, 540),
    d: rand(0, 0.15),
  }));
  return (
    <div className="egg-confetti">
      {bits.map((bit, i) => (
        <span
          key={i}
          style={vars({ background: bit.color, "--x": `${bit.x}vw`, "--y": `${bit.y}vh`, "--r": `${bit.r}deg`, animationDelay: `${bit.d}s` })}
        />
      ))}
    </div>
  );
}

/* ---------- default: il giro della morte ---------- */
function BarrelRoll(props: EggProps) {
  useEgg(props, 1300, "egg-barrel");
  return null;
}

/* ---------- perù: il lama sputa ---------- */
function LlamaSpit(props: EggProps) {
  useEgg(props, 3200);
  return (
    <>
      <img className="egg-llama" src={asset("peru/llama.svg")} alt="" />
      <span className="egg-spit" />
      <span className="egg-splat" />
      <Caption delay={1.3}>¡Te escupió, causa! 🦙💦</Caption>
    </>
  );
}

/* ---------- holy: miracolo ---------- */
function Miracle(props: EggProps) {
  useEgg(props, 3800, "egg-levitate");
  return (
    <>
      <span className="egg-beam" />
      <img className="egg-angel egg-angel-l" src={asset("holy/angel.svg")} alt="" />
      <img className="egg-angel egg-angel-r" src={asset("holy/angel.svg")} alt="" />
      <Caption delay={0.6} className="egg-caption-holy">
        ✨ Miracolo! Le assenze ti sono rimesse (spiritualmente) ✨
      </Caption>
    </>
  );
}

/* ---------- quattro: gli interessi ---------- */
function Debt(props: EggProps) {
  useEgg(props, 3000);
  const [debt] = useState(doubleDebt);
  return (
    <div className="egg-debt">
      <span className="egg-debt-old">{(debt / 2).toLocaleString("it-IT")} €</span>
      <p>ORA MI DEVI</p>
      <strong>{debt.toLocaleString("it-IT")} €</strong>
      <small>interessi di mora: +100% 🫴</small>
    </div>
  );
}

/* ---------- drum: cenere sul registro ---------- */
function BurnHole(props: EggProps) {
  useEgg(props, 3400);
  const puffs = useScatter(7, () => ({ x: rand(-60, 60), d: rand(0.6, 1.4), s: rand(80, 160) }));
  return (
    <>
      <span className="egg-burn" />
      {puffs.map((puff, i) => (
        <span
          key={i}
          className="egg-puff"
          style={vars({ "--x": `${puff.x}px`, width: `${puff.s}px`, height: `${puff.s}px`, animationDelay: `${puff.d}s` })}
        />
      ))}
      <Caption delay={0.7}>Ops. Cenere sul registro 🚬</Caption>
    </>
  );
}

/* ---------- surebet: persa per un risultato ---------- */
const LEGS = [
  ["Matematica", "presenza", "1.20", true],
  ["Italiano", "presenza", "1.15", true],
  ["Inglese", "presenza", "1.30", true],
  ["Storia", "presenza", "1.25", true],
  ["Fisica", "presenza", "1.40", true],
  ["Informatica", "presenza", "1.10", true],
  ["Arte", "presenza", "1.35", true],
  ["Religione", "presenza", "1.05", true],
  ["Ed. fisica (94')", "presenza", "1.01", false],
] as const;

function LostSlip(props: EggProps) {
  useEgg(props, 4200);
  return (
    <div className="egg-slip">
      <p className="egg-slip-head">SCHEDINA #4207 · multipla ×9</p>
      {LEGS.map(([subject, market, odd, won], i) => (
        <p key={subject} className={`egg-slip-row${won ? "" : " is-lost"}`} style={vars({ animationDelay: `${0.15 + i * 0.12}s` })}>
          <span>{subject}</span>
          <span>
            {market} @{odd}
          </span>
          <b>{won ? "✅" : "❌"}</b>
        </p>
      ))}
      <p className="egg-slip-total">Vincita potenziale: € 4.207,00 → € 0,00</p>
      <span className="egg-slip-stamp">PERSA</span>
    </div>
  );
}

/* ---------- puglia: la ciabatta della nonna ---------- */
function Ciabatta(props: EggProps) {
  useEgg(props, 2900, "egg-slap");
  return (
    <>
      <img className="egg-nonna" src={asset("puglia/nonna.svg")} alt="" />
      <span className="egg-ciabatta">🩴</span>
      <Caption delay={1}>Mo' vid'! 🩴</Caption>
    </>
  );
}

/* ---------- kalashmikov: tiro a segno ---------- */
function Shooting(props: EggProps) {
  useEgg(props, 5600);
  const [holes, setHoles] = useState<{ x: number; y: number; id: number }[]>([]);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const stop = window.setTimeout(() => setOpen(false), 4800);
    return () => window.clearTimeout(stop);
  }, []);
  return (
    <div
      className={`egg-range${open ? " is-open" : ""}`}
      onPointerDown={(event) => {
        if (!open) return;
        event.preventDefault();
        playShot();
        setHoles((list) => [...list.slice(-30), { x: event.clientX, y: event.clientY, id: performance.now() }]);
      }}
    >
      <p className="egg-range-banner">FUOCO A VOLONTÀ 🎯</p>
      {holes.map((hole) => (
        <span key={hole.id} className="egg-hole" style={vars({ left: `${hole.x}px`, top: `${hole.y}px` })} />
      ))}
    </div>
  );
}

/* ---------- bicicletta: impennata arcobaleno ---------- */
function Wheelie(props: EggProps) {
  useEgg(props, 3400);
  return (
    <>
      <div className="egg-flag-trail" />
      <img className="egg-bike" src={asset("bicicletta/bicycle.svg")} alt="" />
      <Caption delay={0.8}>Dring dring, fate largo, regina! 🏳️‍⚧️</Caption>
    </>
  );
}

/* ---------- chantal: Siri ---------- */
function Siri(props: EggProps) {
  useEgg(props, 4600);
  return (
    <>
      <span className="egg-siri-glow" />
      <div className="egg-siri-card">
        <p>Ecco cosa ho trovato sul web per «assenze»:</p>
        <ul>
          <li>Come giustificare 47 assenze senza farsi beccare</li>
          <li>«Febbre da cavallo»: sintomi e durata</li>
          <li>Chantal è bellissima? (Sì.)</li>
        </ul>
      </div>
    </>
  );
}

/* ---------- baba: death drop ---------- */
function DeathDrop(props: EggProps) {
  useEgg(props, 2800, "egg-deathdrop");
  return (
    <>
      <p className="egg-drop-text">DEATH DROP 💅</p>
      <Confetti colors={["#e40303", "#ff8c00", "#ffed00", "#008026", "#24408e", "#732982", "#ff5fa2"]} />
    </>
  );
}

/* ---------- overthinker: tsundere ---------- */
function Tsundere(props: EggProps) {
  useEgg(props, 4400);
  return (
    <div className="egg-tsun">
      <Waifu className="egg-tsun-waifu" />
      <span className="egg-tsun-blush" />
      <p className="egg-tsun-line egg-tsun-1">B-baka! Non è che mi piaci o cosa… 😤</p>
      <p className="egg-tsun-line egg-tsun-2">…aspetta, l'ho detto ad alta voce? E se l'ha sentito?! 😳</p>
    </div>
  );
}

/* ---------- fre: tentazione respinta ---------- */
function Rejected(props: EggProps) {
  useEgg(props, 3600);
  return (
    <>
      <div className="egg-letter">
        <span className="egg-letter-icon">💌</span>
        <span className="egg-letter-stamp">RIFIUTATO</span>
        <span className="egg-letter-ice" />
      </div>
      <Caption delay={1.9}>Tentazione respinta. Streak salva 🧊</Caption>
    </>
  );
}

/* ---------- robot: autodistruzione ---------- */
function SelfDestruct(props: EggProps) {
  useEgg(props, 4800);
  return (
    <>
      <span className="egg-alarm" />
      <p className="egg-boop">BOOP.</p>
      <div className="egg-count">
        <p>AUTODISTRUZIONE IN</p>
        {[3, 2, 1].map((n, i) => (
          <strong key={n} style={vars({ animationDelay: `${0.9 + i * 0.8}s` })}>
            {n}
          </strong>
        ))}
      </div>
      <Caption delay={3.4}>…annullata. Sono troppo carino per esplodere 🤖💕</Caption>
    </>
  );
}

/* ---------- uomo: e la donna? ---------- */
function Donna(props: EggProps) {
  useEgg(props, 8000, "uomo-donna");
  return <Caption className="egg-caption-uomo">Revisione storica in corso… ✍️</Caption>;
}

/* ---------- roblox: oof e respawn ---------- */
function Oof(props: EggProps) {
  useEgg(props, 4000);
  return (
    <div className="egg-oof">
      <Noob className="egg-noob egg-noob-dead" />
      <p className="egg-oof-text">OOF</p>
      <p className="egg-respawn">
        Respawn tra{" "}
        <span className="egg-respawn-n">
          <i>3</i>
          <i>2</i>
          <i>1</i>
        </span>
      </p>
      <Noob className="egg-noob egg-noob-new" />
    </div>
  );
}

/* ---------- saetta: ka-ciao! ---------- */
function Kachow(props: EggProps) {
  useEgg(props, 2900);
  const flashes = useScatter(12, () => ({ x: rand(5, 95), y: rand(5, 85), d: rand(0.3, 1.1) }));
  return (
    <>
      {flashes.map((flash, i) => (
        <span key={i} className="egg-flash" style={vars({ left: `${flash.x}%`, top: `${flash.y}%`, animationDelay: `${flash.d}s` })} />
      ))}
      <div className="egg-car-run">
        <RaceCar />
      </div>
      <p className="egg-kachow">KA-CIAO! ⚡</p>
    </>
  );
}

/* ---------- theobserver: l'occhio si offende ---------- */
function Offended(props: EggProps) {
  useEgg(props, 7000);
  return (
    <>
      <div className="egg-eye">
        <img src={asset("theobserver/eye.svg")} alt="" />
      </div>
      <p className="egg-caption egg-caption-note egg-note-1">Ahia! Ok, smetto di osservare. 😒</p>
      <p className="egg-caption egg-caption-note egg-note-2">…scherzo. Ti osservo ancora. 👁️</p>
    </>
  );
}

/* ---------- darko: scomparsa ---------- */
function Missing(props: EggProps) {
  useEgg(props, 4400);
  return (
    <>
      <div className="egg-poster">
        <strong>SCOMPARSA</strong>
        <span className="egg-poster-photo">?</span>
        <b>MAMMA DI DARKO</b>
        <span>Ultimo avvistamento: mai</span>
        <span>Ricompensa: un disco d'oro 💿</span>
      </div>
      <Caption delay={2}>(Darko dice che va tutto bene. Ha scritto un pezzo.) 🎤</Caption>
    </>
  );
}

/* ---------- justeat: il rider ha fame ---------- */
function HungryRider(props: EggProps) {
  useEgg(props, 3800);
  const fries = useScatter(10, () => ({ x: rand(-40, 40), r: rand(-200, 200), d: rand(0.6, 1.4) }));
  return (
    <>
      <div className="egg-receipt">
        <p className="egg-receipt-head">Ordine #4B</p>
        <p>1× Registro margherita</p>
        <p>1× Patatine grandi</p>
        <p className="egg-receipt-state">Stato: mangiato dal rider 😋</p>
      </div>
      {fries.map((fry, i) => (
        <img
          key={i}
          className="egg-fry"
          src={asset("justeat/fries.svg")}
          alt=""
          style={vars({ "--x": `${fry.x}vw`, "--r": `${fry.r}deg`, animationDelay: `${fry.d}s` })}
        />
      ))}
      <Caption delay={1.6}>Il rider aveva fame. Rimborso: 0,50 € 🛵</Caption>
    </>
  );
}

/* ---------- greentheory: gallette di riso ---------- */
function RiceCakes(props: EggProps) {
  useEgg(props, 3800);
  const cakes = useScatter(22, () => ({ x: rand(0, 100), d: rand(0, 1.4), s: rand(40, 90), r: rand(-180, 180) }));
  return (
    <>
      {cakes.map((cake, i) => (
        <span
          key={i}
          className="egg-ricecake"
          style={vars({ left: `${cake.x}%`, width: `${cake.s}px`, height: `${cake.s}px`, "--r": `${cake.r}deg`, animationDelay: `${cake.d}s` })}
        />
      ))}
      <Caption delay={0.5} className="egg-caption-gt">
        Pre-workout: una galletta. Post-workout: una galletta. Cena: indovina. 🍘
      </Caption>
    </>
  );
}

/* ---------- cryptofix: pump and dump ---------- */
function PumpDump(props: EggProps) {
  useEgg(props, 4200);
  return (
    <div className="egg-chart">
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
        <path className="egg-chart-up" d="M0 180L40 170L70 175L110 140L140 150L180 90L210 100L250 20" pathLength={1} />
        <path className="egg-chart-down" d="M250 20L270 60L300 130L330 185L400 198" pathLength={1} />
      </svg>
      <p className="egg-chart-up-text">+9000% 🚀</p>
      <p className="egg-chart-down-text">−99% 📉</p>
      <Caption delay={2.4} className="egg-caption-cf">
        Decentralizziamo anche le perdite. HODL 💎🙌
      </Caption>
    </div>
  );
}

/* ---------- ortol: pioggia e pomodoro gigante ---------- */
function GiantTomato(props: EggProps) {
  useEgg(props, 4000);
  const drops = useScatter(40, () => ({ x: rand(0, 100), d: rand(0, 1.2), t: rand(0.5, 0.9) }));
  return (
    <>
      {drops.map((drop, i) => (
        <span key={i} className="egg-rain" style={vars({ left: `${drop.x}%`, animationDelay: `${drop.d}s`, animationDuration: `${drop.t}s` })} />
      ))}
      <img className="egg-tomato" src={asset("ortol/tomato.svg")} alt="" />
      <Caption delay={1.9} className="egg-caption-or">
        Il tuo pomodoro ha vinto la sagra del paese 🏆🍅
      </Caption>
    </>
  );
}

/* ---------- basket: schiacciata che spacca il tabellone ---------- */
function SlamDunk(props: EggProps) {
  useEgg(props, 3600, "egg-slap");
  return (
    <>
      <img className="egg-dunk-ball" src={asset("loscopatroie/ball.svg")} alt="" />
      <svg className="egg-crack" viewBox="-100 -100 200 200" aria-hidden="true">
        <path d="M0 0L-30 -70L-25 -100M0 0L60 -50L100 -60M0 0L80 20L100 50M0 0L20 70L10 100M0 0L-60 40L-100 30M0 0L-80 -10M-30 -70L-60 -80M60 -50L50 -90M80 20L100 0" />
      </svg>
      <p className="egg-dunk-text">SLAM DUNK!</p>
      <Caption delay={1.5}>Il tabellone non era assicurato 🏀💥</Caption>
    </>
  );
}

/* ---------- bellesia: la schiacciata che fa tremare il palazzetto ---------- */
function Spike(props: EggProps) {
  useEgg(props, 3800, "egg-slap");
  const [hit, setHit] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setHit(true), 900);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <>
      <img className="egg-spike-ball" src={asset("bellesia/volleyball.svg")} alt="" />
      <span className="egg-spike-mark" />
      {hit && <Confetti colors={["#db2777", "#f472b6", "#fbcfe8", "#ffffff"]} />}
      <p className="egg-spike-text">SCHIACCIATA!</p>
      <Caption delay={1.6} className="egg-caption-bl">
        Il muro avversario ha chiesto il cambio 🏐💖
      </Caption>
    </>
  );
}

const EFFECTS: Record<ThemeId, (props: EggProps) => ReactNode> = {
  default: BarrelRoll,
  peru: LlamaSpit,
  holy: Miracle,
  quattro: Debt,
  drum: BurnHole,
  surebet: LostSlip,
  puglia: Ciabatta,
  kalashmikov: Shooting,
  bicicletta: Wheelie,
  chantal: Siri,
  baba: DeathDrop,
  overthinker: Tsundere,
  fre: Rejected,
  robot: SelfDestruct,
  uomo: Donna,
  roblox: Oof,
  saetta: Kachow,
  theobserver: Offended,
  darko: Missing,
  justeat: HungryRider,
  greentheory: RiceCakes,
  cryptofix: PumpDump,
  ortol: GiantTomato,
  basket: SlamDunk,
  bellesia: Spike,
};

export default function EggEffect({ theme, onDone }: { theme: ThemeId; onDone: () => void }) {
  const Effect = EFFECTS[theme];
  return <Effect onDone={onDone} />;
}
