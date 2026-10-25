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
  | "chantalle"
  | "baba";

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
  "chantalle",
  "baba",
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
  chantalle: "chantalle",
  baba: "baba",
};

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as string[]).includes(value);
}
