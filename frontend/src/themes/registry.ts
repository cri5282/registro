import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { ThemeId } from "./words";

export interface AnimationProps {
  /** Lo schermo è coperto: il tema può cambiare sotto. */
  onCovered: () => void;
  /** Animazione finita: smonta la tenda. */
  onDone: () => void;
}

export interface ThemeCopy {
  /** Con "{name}" al posto del nome. */
  greeting: string | null;
  present: string;
  absent: string;
  presentCount: string;
  absentCount: string;
  /** Reazione lampo quando si segna presente/assente. */
  cheer: { present: string; absent: string } | null;
  brand: string;
  tagline: string | null;
  /** Etichette ed emoji della navigazione, per voce. */
  nav: Partial<Record<NavKey, { label: string; icon: string }>>;
  /** Titoli delle pagine e delle sezioni. */
  titles: Partial<Record<TitleKey, string>>;
}

export type NavKey = "today" | "calendar" | "stats" | "settings" | "users";
export type TitleKey = "today" | "calendar" | "stats" | "settings" | "lessons" | "bySubject";

export interface ThemeDef {
  themeColor: string;
  font?: () => Promise<unknown>;
  /** Immagini da scaldare mentre l'animazione parte. */
  assets: string[];
  copy: Partial<ThemeCopy>;
  Animation: LazyExoticComponent<ComponentType<AnimationProps>>;
}

export const DEFAULT_COPY: ThemeCopy = {
  greeting: null,
  present: "Presente",
  absent: "Assente",
  presentCount: "presenti",
  absentCount: "assenti",
  cheer: null,
  brand: "Registro",
  tagline: null,
  nav: {},
  titles: {},
};

export const asset = (path: string) => `${import.meta.env.BASE_URL}themes/${path}`;

export const THEMES: Record<ThemeId, ThemeDef> = {
  default: {
    themeColor: "#0b0d12",
    assets: [],
    copy: {},
    Animation: lazy(() => import("./animations/Default")),
  },
  peru: {
    themeColor: "#1c1310",
    font: () => import("@fontsource/alfa-slab-one/latin-400.css"),
    assets: ["peru/machu-picchu.webp", "peru/llama.svg"],
    copy: {
      greeting: "¡Habla, {name}, causa!",
      present: "¡Presente!",
      absent: "En Cusco",
      presentCount: "presentes",
      absentCount: "en Cusco",
      cheer: { present: "¡Chévere! 🦙", absent: "La llama ti ha sputato 💦" },
    },
    Animation: lazy(() => import("./animations/Peru")),
  },
  holy: {
    themeColor: "#0e1024",
    font: () => Promise.all([import("@fontsource/cinzel/latin-700.css"), import("@fontsource/cinzel/latin-400.css")]),
    assets: ["holy/rosone.webp", "holy/dove.svg", "holy/angel.svg"],
    copy: {
      greeting: "Sia lodato, {name}",
      present: "Benedetto",
      absent: "Peccatore",
      presentCount: "benedetti",
      absentCount: "peccatori",
      cheer: { present: "Amen 🙏", absent: "Tre Ave Maria e passa ✝️" },
    },
    Animation: lazy(() => import("./animations/Holy")),
  },
  quattro: {
    themeColor: "#0d0d10",
    font: () => import("@fontsource/anton/latin-400.css"),
    assets: ["quattro/glove.svg"],
    copy: {
      greeting: "E ORA SUL RING… {name}!",
      present: "In piedi",
      absent: "Al tappeto",
      presentCount: "in piedi",
      absentCount: "al tappeto",
      cheer: { present: "1… 2… 3! 🏆", absent: "K.O.! 💥" },
    },
    Animation: lazy(() => import("./animations/Quattro")),
  },
  drum: {
    themeColor: "#221f1c",
    font: () => import("@fontsource/dm-serif-display/latin-400.css"),
    assets: ["drum/cigarette.svg"],
    copy: {
      greeting: "Una pausa, {name}?",
      present: "Acceso",
      absent: "Spento",
      presentCount: "accesi",
      absentCount: "spenti",
      cheer: { present: "*tiro lungo* 🚬", absent: "Uscito a fumare 💨" },
    },
    Animation: lazy(() => import("./animations/Drum")),
  },
  surebet: {
    themeColor: "#0a1220",
    font: () => Promise.all([import("@fontsource/barlow-condensed/latin-600.css"), import("@fontsource/barlow-condensed/latin-800.css")]),
    assets: ["surebet/slot.svg", "surebet/coin.svg"],
    copy: {
      greeting: "Oggi si vince, {name}",
      present: "Vinta",
      absent: "Persa",
      presentCount: "vinte",
      absentCount: "perse",
      cheer: { present: "CASSA! @1.20 💰", absent: "Schedina saltata 📉" },
    },
    Animation: lazy(() => import("./animations/Surebet")),
  },
  puglia: {
    themeColor: "#fbfaf6",
    font: () => Promise.all([import("@fontsource/fraunces/latin-700.css"), import("@fontsource/fraunces/latin-900.css")]),
    assets: ["puglia/trulli.webp", "puglia/nonna.svg", "puglia/olive.svg"],
    copy: {
      greeting: "Uè {name}, bell!",
      present: "Stè",
      absent: "Nan stè",
      presentCount: "stonn",
      absentCount: "nan stonn",
      cheer: { present: "Brav, uagliò! 🫒", absent: "Mo' te la faccio io la giustifica 🩴" },
    },
    Animation: lazy(() => import("./animations/Puglia")),
  },
  kalashmikov: {
    themeColor: "#1b1d1a",
    font: () => import("@fontsource/black-ops-one/latin-400.css"),
    assets: ["kalashmikov/helmet.svg"],
    copy: {
      greeting: "Rapporto, soldato {name}",
      present: "In servizio",
      absent: "Disertore",
      presentCount: "in servizio",
      absentCount: "disertori",
      cheer: { present: "Ricevuto, passo! 🎖️", absent: "Corte marziale 💣" },
    },
    Animation: lazy(() => import("./animations/Kalashmikov")),
  },
  bicicletta: {
    themeColor: "#f7fbff",
    font: () => Promise.all([import("@fontsource/fredoka/latin-500.css"), import("@fontsource/fredoka/latin-700.css")]),
    assets: ["bicicletta/bicycle.svg", "bicicletta/butterfly.svg"],
    copy: {
      greeting: "Ciao {name}, splendore ✨",
      present: "Presente 💖",
      absent: "Assente 💙",
      presentCount: "presenti",
      absentCount: "assenti",
      cheer: { present: "Dring dring! 🚲", absent: "Pedalerà domani 🦋" },
    },
    Animation: lazy(() => import("./animations/Bicicletta")),
  },
  chantal: {
    themeColor: "#f2f2f7",
    font: () => Promise.all([import("@fontsource/inter/latin-400.css"), import("@fontsource/inter/latin-600.css"), import("@fontsource/inter/latin-800.css")]),
    assets: ["chantal/nails.svg"],
    copy: {
      greeting: "Hey {name} 💅",
      cheer: { present: "Presenza salvata su iCloud ☁️", absent: "Spazio di archiviazione quasi pieno 📵" },
    },
    Animation: lazy(() => import("./animations/Chantal")),
  },
  baba: {
    themeColor: "#14101f",
    font: () => Promise.all([import("@fontsource/bricolage-grotesque/latin-700.css"), import("@fontsource/bricolage-grotesque/latin-800.css")]),
    assets: ["baba/mirrorball.svg", "baba/unicorn.svg"],
    copy: {
      greeting: "Yass {name}, regina 👑",
      present: "Presentissim*",
      absent: "Drama 💔",
      presentCount: "slay",
      absentCount: "drama",
      cheer: { present: "SLAY 💅✨", absent: "Non ce la posso fare 💔" },
    },
    Animation: lazy(() => import("./animations/Baba")),
  },
  overthinker: {
    themeColor: "#0b0814",
    font: () => Promise.all([import("@fontsource/orbitron/latin-700.css"), import("@fontsource/orbitron/latin-900.css")]),
    assets: ["overthinker/gamepad.svg", "overthinker/romania.svg"],
    copy: {
      greeting: "Bună, {name}-kun! ✨",
      present: "GG",
      absent: "AFK",
      presentCount: "GG",
      absentCount: "AFK",
      cheer: { present: "GG… ma l'avrò segnato bene? 🤔", absent: "AFK… e se se ne accorgono?! 😰" },
    },
    Animation: lazy(() => import("./animations/Overthinker")),
  },
  fre: {
    themeColor: "#eef6fb",
    font: () => import("@fontsource/archivo-black/latin-400.css"),
    assets: ["fre/prohibited.svg", "fre/ice.svg"],
    copy: {
      greeting: "Mente lucida, {name}. Zero tentazioni.",
      present: "Concentrato",
      absent: "Tentato",
      presentCount: "concentrato",
      absentCount: "tentazioni",
      cheer: { present: "Streak +1 🧊", absent: "Doccia fredda, subito 🚿" },
    },
    Animation: lazy(() => import("./animations/Fre")),
  },
  robot: {
    themeColor: "#0e1316",
    font: () => import("@fontsource/share-tech-mono/latin-400.css"),
    assets: ["robot/robot.svg", "robot/gear.svg"],
    copy: {
      greeting: "UNITÀ {name}: ONLINE",
      present: "ONLINE",
      absent: "ERRORE 404",
      presentCount: "online",
      absentCount: "offline",
      cheer: { present: "BEEP BOOP ✅ PRESENZA SALVATA", absent: "⚠ ERRORE 404: STUDENTE NON TROVATO" },
    },
    Animation: lazy(() => import("./animations/Robot")),
  },
  uomo: {
    themeColor: "#f3efe4",
    font: () => Promise.all([import("@fontsource/eb-garamond/latin-400.css"), import("@fontsource/eb-garamond/latin-700.css")]),
    assets: ["uomo/scroll.svg"],
    copy: {
      greeting: "{name}, uomo del tuo tempo",
      present: "Uomo presente",
      absent: "Uomo assente",
      presentCount: "uomini presenti",
      absentCount: "uomini assenti",
      cheer: { present: "Un piccolo passo per un uomo 🌕", absent: "L'uomo è assente, la storia no 📜" },
    },
    Animation: lazy(() => import("./animations/Uomo")),
  },
  roblox: {
    themeColor: "#232527",
    font: () => import("@fontsource/lilita-one/latin-400.css"),
    assets: ["roblox/brick.svg"],
    copy: {
      greeting: "Benvenuto nel server, {name}!",
      present: "Spawnato",
      absent: "Oof",
      presentCount: "spawnati",
      absentCount: "oof",
      cheer: { present: "+100 Robux 💰", absent: "OOF 💀 respawn tra 5 s" },
    },
    Animation: lazy(() => import("./animations/Roblox")),
  },
  saetta: {
    themeColor: "#c4161c",
    font: () => import("@fontsource/racing-sans-one/latin-400.css"),
    assets: ["saetta/checkered.svg", "saetta/bolt.svg", "saetta/trophy.svg"],
    copy: {
      greeting: "Ka-ciao, {name}! ⚡",
      present: "In pista",
      absent: "Ai box",
      presentCount: "in pista",
      absentCount: "ai box",
      cheer: { present: "Ka-ciao! ⚡ Giro veloce", absent: "Pit stop non programmato 🛞" },
    },
    Animation: lazy(() => import("./animations/Saetta")),
  },
  theobserver: {
    themeColor: "#fbfaf5",
    font: () => import("@fontsource/caveat/latin-700.css"),
    assets: ["theobserver/eye.svg", "theobserver/magnifier.svg"],
    copy: {
      greeting: "Questo è un saluto, {name}. Serve a salutare.",
      present: "Presente (sì)",
      absent: "Assente (no)",
      presentCount: "presenti (contati)",
      absentCount: "assenti (contati anche loro)",
      cheer: { present: "Osservato: c'eri. Annotato. 👁️", absent: "Osservato: non c'eri. Annotato anche questo. 📝" },
    },
    Animation: lazy(() => import("./animations/Theobserver")),
  },
  darko: {
    themeColor: "#0c0c0c",
    font: () => Promise.all([import("@fontsource/permanent-marker/latin-400.css"), import("@fontsource/anton/latin-400.css")]),
    assets: ["darko/mic.svg"],
    copy: {
      greeting: "Yo {name}, mamma non c'è (come sempre)",
      present: "In studio",
      absent: "Come mamma",
      presentCount: "in studio",
      absentCount: "spariti come mamma",
      cheer: { present: "Fra sei un king 👑🎤", absent: "Sparito come la mamma di Darko 🥀" },
    },
    Animation: lazy(() => import("./animations/Darko")),
  },
  justeat: {
    themeColor: "#ff8000",
    font: () => Promise.all([import("@fontsource/fredoka/latin-500.css"), import("@fontsource/fredoka/latin-700.css")]),
    assets: ["justeat/scooter.svg", "justeat/pizza.svg", "justeat/house.svg"],
    copy: {
      greeting: "{name}, il tuo ordine è in arrivo 🛵",
      present: "Consegnato",
      absent: "Annullato",
      presentCount: "consegnati",
      absentCount: "annullati",
      cheer: { present: "Consegnato! Lascia 5 stelle ⭐", absent: "Il rider si è perso 🛵💨" },
    },
    Animation: lazy(() => import("./animations/Justeat")),
  },
  greentheory: {
    themeColor: "#0a0f0b",
    font: () => Promise.all([import("@fontsource/anton/latin-400.css"), import("@fontsource/bebas-neue/latin-400.css")]),
    assets: ["greentheory/biceps.svg", "greentheory/lifter.svg"],
    copy: {
      greeting: "Disciplina, {name}. Oggi si spinge.",
      present: "Allenato",
      absent: "Rest day",
      presentCount: "allenamenti",
      absentCount: "rest day",
      cheer: { present: "+1 rep. Disciplina. 🏛️💪", absent: "Rest day non autorizzato 😤" },
    },
    Animation: lazy(() => import("./animations/Greentheory")),
  },
  cryptofix: {
    themeColor: "#120a24",
    font: () => Promise.all([import("@fontsource/monoton/latin-400.css"), import("@fontsource/orbitron/latin-700.css")]),
    assets: ["cryptofix/poster.webp", "cryptofix/guitar.svg", "cryptofix/drum.svg"],
    copy: {
      greeting: "{name}, stasera si suona on-chain ⚡",
      present: "Live",
      absent: "Offline",
      presentCount: "live",
      absentCount: "offline",
      cheer: { present: "Sold out! 🎸₿", absent: "Rug pull dal palco 🎤📉" },
    },
    Animation: lazy(() => import("./animations/Cryptofix")),
  },
  ortol: {
    themeColor: "#f4f0e2",
    font: () => import("@fontsource/amatic-sc/latin-700.css"),
    assets: ["ortol/seedling.svg", "ortol/tomato.svg", "ortol/carrot.svg", "ortol/lettuce.svg", "ortol/snail.svg"],
    copy: {
      greeting: "Buongiorno {name}, l'orto ha sete 💧",
      present: "Germogliato",
      absent: "Seccato",
      presentCount: "germogli",
      absentCount: "secchi",
      cheer: { present: "Spunta un pomodoro! 🍅", absent: "Hanno vinto le lumache 🐌" },
    },
    Animation: lazy(() => import("./animations/Ortol")),
  },
  basket: {
    themeColor: "#13213c",
    font: () => import("@fontsource/graduate/latin-400.css"),
    assets: ["loscopatroie/ball.svg"],
    copy: {
      greeting: "{name}, palla a due! 🏀",
      present: "Canestro",
      absent: "Airball",
      presentCount: "canestri",
      absentCount: "airball",
      cheer: { present: "SWISH! +2 🏀", absent: "Airball… 🧱" },
    },
    Animation: lazy(() => import("./animations/Basket")),
  },
};
