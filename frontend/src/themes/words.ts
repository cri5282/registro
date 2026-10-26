export type ThemeId =
  | "default"
  | "peru"
  | "holy"
  | "quattro"
  | "drum"
  | "surebet"
  | "puglia"
  | "kalashmikov"
  | "bicicletta"
  | "chantal"
  | "baba"
  | "overthinker"
  | "fre"
  | "robot"
  | "uomo"
  | "roblox"
  | "saetta"
  | "theobserver"
  | "darko"
  | "justeat"
  | "greentheory"
  | "cryptofix"
  | "ortol"
  | "basket"
  | "bellesia";

export const THEME_IDS: ThemeId[] = [
  "default",
  "peru",
  "holy",
  "quattro",
  "drum",
  "surebet",
  "puglia",
  "kalashmikov",
  "bicicletta",
  "chantal",
  "baba",
  "overthinker",
  "fre",
  "robot",
  "uomo",
  "roblox",
  "saetta",
  "theobserver",
  "darko",
  "justeat",
  "greentheory",
  "cryptofix",
  "ortol",
  "basket",
  "bellesia",
];

export const SECRET_WORDS: Record<string, ThemeId> = {
  default: "default",
  peru: "peru",
  holy: "holy",
  quattro: "quattro",
  drum: "drum",
  surebet: "surebet",
  puglia: "puglia",
  kalashmikov: "kalashmikov",
  kalashnikov: "kalashmikov",
  bicicletta: "bicicletta",
  chantal: "chantal",
  baba: "baba",
  overthinker: "overthinker",
  fre: "fre",
  robot: "robot",
  uomo: "uomo",
  roblox: "roblox",
  saetta: "saetta",
  theobserver: "theobserver",
  darko: "darko",
  justeat: "justeat",
  greentheory: "greentheory",
  cryptofix: "cryptofix",
  ortol: "ortol",
  loscopatroie: "basket",
  bellesia: "bellesia",
};

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as string[]).includes(value);
}
