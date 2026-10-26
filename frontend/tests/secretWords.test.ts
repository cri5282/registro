import { describe, expect, it } from "vitest";
import { createMatcher, isTypingTarget, normalize } from "../src/themes/secretWords";
import { SECRET_WORDS, THEME_IDS } from "../src/themes/words";
import { EGGS, eggWords, isEggWord } from "../src/themes/eggs";

function type(matcher: ReturnType<typeof createMatcher>, text: string) {
  let hit: string | null = null;
  for (const key of text) hit = matcher.push(key) ?? hit;
  return hit;
}

describe("parole segrete", () => {
  it("ignora maiuscole e accenti", () => {
    expect(normalize("Perù")).toBe("peru");
    expect(type(createMatcher(SECRET_WORDS), "PERÙ")).toBe("peru");
    expect(type(createMatcher(SECRET_WORDS), "perù")).toBe("peru");
    expect(type(createMatcher(SECRET_WORDS), "Holy")).toBe("holy");
  });

  it("accetta kalashnikov come sinonimo", () => {
    expect(type(createMatcher(SECRET_WORDS), "kalashmikov")).toBe("kalashmikov");
    expect(type(createMatcher(SECRET_WORDS), "kalashnikov")).toBe("kalashmikov");
  });

  it("trova la parola anche in mezzo ad altro testo", () => {
    expect(type(createMatcher(SECRET_WORDS), "ciaoquattro")).toBe("quattro");
    expect(type(createMatcher(SECRET_WORDS), "xxbabaxx")).toBe("baba");
  });

  it("non confonde fre con altre parole", () => {
    expect(type(createMatcher(SECRET_WORDS), "fre")).toBe("fre");
    expect(type(createMatcher(SECRET_WORDS), "robot")).toBe("robot");
    expect(type(createMatcher(SECRET_WORDS), "uomo")).toBe("uomo");
  });

  it("usa le parole nuove: chantal senza le, e le ultime aggiunte", () => {
    expect(type(createMatcher(SECRET_WORDS), "chantal")).toBe("chantal");
    expect(type(createMatcher(SECRET_WORDS), "theobserver")).toBe("theobserver");
    expect(type(createMatcher(SECRET_WORDS), "saetta")).toBe("saetta");
    expect(type(createMatcher(SECRET_WORDS), "roblox")).toBe("roblox");
    expect(type(createMatcher(SECRET_WORDS), "darko")).toBe("darko");
    expect(type(createMatcher(SECRET_WORDS), "justeat")).toBe("justeat");
    expect(type(createMatcher(SECRET_WORDS), "greentheory")).toBe("greentheory");
    expect(type(createMatcher(SECRET_WORDS), "cryptofix")).toBe("cryptofix");
    expect(type(createMatcher(SECRET_WORDS), "ortol")).toBe("ortol");
    expect(type(createMatcher(SECRET_WORDS), "loscopatroie")).toBe("basket");
    expect(type(createMatcher(SECRET_WORDS), "bellesia")).toBe("bellesia");
  });

  it("nessuna parola ne contiene un'altra (scatterebbe a metà)", () => {
    const words = [
      ...Object.keys(SECRET_WORDS),
      ...THEME_IDS.flatMap((theme) => Object.keys(eggWords(theme))),
    ].map(normalize);
    for (const word of words) {
      for (const other of words) {
        if (word !== other) expect(word.includes(other), `${word} contiene ${other}`).toBe(false);
      }
    }
  });

  it("ogni tema ha il suo easter egg", () => {
    for (const theme of THEME_IDS) expect(EGGS[theme]).toBeTruthy();
    expect(type(createMatcher(eggWords("robot")), "beep")).toBe("robot");
    expect(type(createMatcher(eggWords("robot")), "amen")).toBeNull();
    expect(isEggWord("saetta", " KaChow ")).toBe(true);
    expect(isEggWord("saetta", "mamma")).toBe(false);
  });

  it("scarta i caratteri vecchi oltre il buffer", () => {
    const matcher = createMatcher(SECRET_WORDS);
    expect(type(matcher, "pug")).toBeNull();
    expect(type(matcher, "z".repeat(60))).toBeNull();
    expect(type(matcher, "lia")).toBeNull();
    expect(type(matcher, "puglia")).toBe("puglia");
  });

  it("ignora tasti speciali come Shift o Enter", () => {
    const matcher = createMatcher(SECRET_WORDS);
    const results = ["d", "Shift", "r", "Enter", "u", "m"].map((key) => matcher.push(key));
    expect(results.at(-1)).toBe("drum");
    expect(results.slice(0, -1).every((result) => result === null)).toBe(true);
  });

  it("riconosce la parola intera nel prompt", () => {
    const matcher = createMatcher(SECRET_WORDS);
    expect(matcher.match("  Chantal ")).toBe("chantal");
    expect(matcher.match("default")).toBe("default");
    expect(matcher.match("nope")).toBeNull();
  });

  it("non intercetta i campi di testo", () => {
    expect(isTypingTarget({ tagName: "INPUT" } as unknown as EventTarget)).toBe(true);
    expect(isTypingTarget({ tagName: "TEXTAREA" } as unknown as EventTarget)).toBe(true);
    expect(isTypingTarget({ tagName: "DIV", isContentEditable: true } as unknown as EventTarget)).toBe(true);
    expect(isTypingTarget({ tagName: "BODY", isContentEditable: false } as unknown as EventTarget)).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});
