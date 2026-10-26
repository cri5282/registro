// Il secondo livello di segreti: dentro ogni tema c'è un easter egg.
// Si sveglia scrivendo una parola (solo in quel tema) o cliccando più volte un pezzo del widget.
import { normalize } from "./secretWords";
import type { ThemeId } from "./words";

export type EggTrigger = { words: string[] } | { click: string; times: number };

export const EGGS: Record<ThemeId, EggTrigger> = {
  default: { words: ["barrelroll"] },
  peru: { click: ".tw-peru-llama", times: 5 },
  holy: { words: ["amen"] },
  quattro: { click: ".tw-quattro-sign", times: 4 },
  drum: { click: ".tw-drum-tray", times: 3 },
  surebet: { click: ".tw-surebet-cta", times: 1 },
  puglia: { click: ".tw-puglia-nonna", times: 3 },
  kalashmikov: { words: ["fuoco"] },
  bicicletta: { click: ".tw-bici-bike", times: 3 },
  chantal: { words: ["siri"] },
  baba: { click: ".tw-baba-ball", times: 5 },
  overthinker: { click: ".tw-ot-waifu", times: 5 },
  fre: { click: ".tw-fre-cert", times: 3 },
  robot: { words: ["beep"] },
  uomo: { words: ["donna"] },
  roblox: { words: ["oof"] },
  saetta: { words: ["kaciao", "kachow"] },
  theobserver: { click: ".tw-ob-eye", times: 5 },
  darko: { words: ["mamma"] },
  justeat: { click: ".tw-je-scooter", times: 3 },
  greentheory: { words: ["galletta"] },
  cryptofix: { words: ["hodl"] },
  ortol: { click: ".tw-or-can", times: 3 },
  basket: { click: ".tw-bk-hoop", times: 3 },
};

/** Scatta quando parte un easter egg: chi vuole reagire (note, widget…) ascolta questo. */
export const EGG_EVENT = "registro:egg";
/** Chiesto dal campo segreto su telefono quando la parola è quella dell'egg del tema. */
export const EGG_REQUEST = "registro:egg-request";

export function eggWords(theme: ThemeId): Record<string, ThemeId> {
  const trigger = EGGS[theme];
  if (!("words" in trigger)) return {};
  return Object.fromEntries(trigger.words.map((word) => [word, theme]));
}

/** True se il testo è la parola dell'egg del tema attivo. */
export function isEggWord(theme: ThemeId, text: string): boolean {
  const word = normalize(text);
  return Object.keys(eggWords(theme)).some((candidate) => normalize(candidate) === word);
}

const DEBT_KEY = "registro.debito";

/** Il debito del tema quattro: raddoppia a ogni egg, perché gli interessi non perdonano. */
export function readDebt(): number {
  try {
    const value = Number(localStorage.getItem(DEBT_KEY));
    return Number.isFinite(value) && value >= 4 ? value : 4;
  } catch {
    return 4;
  }
}

export function doubleDebt(): number {
  const next = Math.min(readDebt() * 2, 4 * 2 ** 40);
  try {
    localStorage.setItem(DEBT_KEY, String(next));
  } catch {
    // Senza storage il debito si azzera al ricaricamento: fortunato.
  }
  return next;
}
