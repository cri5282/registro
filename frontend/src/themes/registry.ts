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
  chantalle: {
    themeColor: "#f2f2f7",
    font: () => Promise.all([import("@fontsource/inter/latin-400.css"), import("@fontsource/inter/latin-600.css"), import("@fontsource/inter/latin-800.css")]),
    assets: ["chantalle/nails.svg"],
    copy: {
      greeting: "Hey {name} 💅",
      cheer: { present: "Presenza salvata su iCloud ☁️", absent: "Spazio di archiviazione quasi pieno 📵" },
    },
    Animation: lazy(() => import("./animations/Chantalle")),
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
};
