import type { ThemeCopy } from "./registry";
import type { ThemeId } from "./words";

/** Il lessico di ogni tema: nome dell'app, menu, titoli. Più è esagerato, meglio è. */
export const FLAVOR: Record<ThemeId, Partial<ThemeCopy>> = {
  default: {},
  peru: {
    brand: "Registro Inca",
    tagline: "Hecho en Cusco 🇵🇪",
    nav: {
      today: { label: "Hoy", icon: "🦙" },
      calendar: { label: "Inti", icon: "☀️" },
      stats: { label: "Quipu", icon: "🪢" },
      settings: { label: "Ajustes", icon: "🌽" },
      users: { label: "Ayllu", icon: "🏔️" },
    },
    titles: { today: "Hoy", calendar: "Calendario Inti", stats: "Quipu", settings: "Ajustes", lessons: "Clases del día", bySubject: "Nudos por materia" },
  },
  holy: {
    brand: "Sacro Registro",
    tagline: "Ora et labora",
    nav: {
      today: { label: "Vangelo", icon: "📖" },
      calendar: { label: "Feste", icon: "⛪" },
      stats: { label: "Confessione", icon: "🙏" },
      settings: { label: "Sacrestia", icon: "🕯️" },
      users: { label: "Fedeli", icon: "👼" },
    },
    titles: { today: "Vangelo di oggi", calendar: "Calendario liturgico", stats: "Confessione", settings: "Sacrestia", lessons: "Le funzioni", bySubject: "Peccati per materia" },
  },
  quattro: {
    brand: "Registro Rumble",
    tagline: "Main event: 4 €",
    nav: {
      today: { label: "Main event", icon: "🥊" },
      calendar: { label: "Card", icon: "🗓️" },
      stats: { label: "Record", icon: "🏆" },
      settings: { label: "Spogliatoio", icon: "🎽" },
      users: { label: "Roster", icon: "🤼" },
    },
    titles: { today: "Main event", calendar: "Card del mese", stats: "Record", settings: "Spogliatoio", lessons: "Match di stasera", bySubject: "Record per avversario" },
  },
  drum: {
    brand: "Registro Tabacchi",
    tagline: "Rollato a mano",
    nav: {
      today: { label: "Pausa", icon: "🚬" },
      calendar: { label: "Stecca", icon: "📦" },
      stats: { label: "Tiri", icon: "💨" },
      settings: { label: "Accendino", icon: "🔥" },
      users: { label: "Fumatori", icon: "🧔" },
    },
    titles: { today: "Pausa sigaretta", calendar: "La stecca del mese", stats: "Tiri totali", settings: "Accendino", lessons: "Le sigarette di oggi", bySubject: "Tiri per materia" },
  },
  surebet: {
    brand: "RegistroBet",
    tagline: "Quota sicura dal 2026",
    nav: {
      today: { label: "Live", icon: "🔴" },
      calendar: { label: "Palinsesto", icon: "📋" },
      stats: { label: "Storico", icon: "📈" },
      settings: { label: "Conto", icon: "💳" },
      users: { label: "Giocatori", icon: "🎰" },
    },
    titles: { today: "Live", calendar: "Palinsesto", stats: "Storico giocate", settings: "Il tuo conto", lessons: "Schedina di oggi", bySubject: "Esiti per mercato" },
  },
  puglia: {
    brand: "Registro Pugliese",
    tagline: "Mare, sole e presenze",
    nav: {
      today: { label: "Josce", icon: "☀️" },
      calendar: { label: "Feste", icon: "🎆" },
      stats: { label: "I conti", icon: "🫒" },
      settings: { label: "Masseria", icon: "🏡" },
      users: { label: "Paesani", icon: "👵" },
    },
    titles: { today: "Josce", calendar: "Le feste patronali", stats: "I conti della nonna", settings: "La masseria", lessons: "Che s' fasc' josce", bySubject: "Materia per materia" },
  },
  kalashmikov: {
    brand: "Registro Militare",
    tagline: "Comando 4ªB",
    nav: {
      today: { label: "Missione", icon: "🎯" },
      calendar: { label: "Turni", icon: "🗓️" },
      stats: { label: "Rapporto", icon: "🎖️" },
      settings: { label: "Armeria", icon: "🔧" },
      users: { label: "Plotone", icon: "🪖" },
    },
    titles: { today: "Missione di oggi", calendar: "Turni di guardia", stats: "Rapporto", settings: "Armeria", lessons: "Obiettivi", bySubject: "Fronte per fronte" },
  },
  bicicletta: {
    brand: "Registro a pedali",
    tagline: "Pedalare è un diritto 🏳️‍⚧️",
    nav: {
      today: { label: "Pedalata", icon: "🚲" },
      calendar: { label: "Tappe", icon: "🗺️" },
      stats: { label: "Km fatti", icon: "🏁" },
      settings: { label: "Officina", icon: "🔧" },
      users: { label: "Ciclist*", icon: "🦋" },
    },
    titles: { today: "La pedalata di oggi", calendar: "Le tappe", stats: "Km fatti", settings: "Officina", lessons: "Tappe di oggi", bySubject: "Km per materia" },
  },
  chantalle: {
    brand: "Registro",
    tagline: "Progettato da Chantalle in Italia",
    nav: {
      stats: { label: "Salute", icon: "❤️" },
    },
    titles: { stats: "Salute", lessons: "Promemoria", bySubject: "Per materia" },
  },
  baba: {
    brand: "Registro Favoloso",
    tagline: "Slay all day 💅",
    nav: {
      today: { label: "Slay", icon: "💅" },
      calendar: { label: "Agenda", icon: "💃" },
      stats: { label: "Gossip", icon: "☕" },
      settings: { label: "Camerino", icon: "💄" },
      users: { label: "Le girls", icon: "👯" },
    },
    titles: { today: "Oggi si slaya", calendar: "Agenda fabulous", stats: "Gossip", settings: "Camerino", lessons: "Le lezioni (drama)", bySubject: "Il tè per materia ☕" },
  },
};
