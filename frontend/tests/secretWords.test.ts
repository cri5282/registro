import { describe, expect, it } from "vitest";
import { createMatcher, isTypingTarget, normalize } from "../src/themes/secretWords";
import { SECRET_WORDS } from "../src/themes/words";

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

  it("scarta i caratteri vecchi oltre il buffer", () => {
    const matcher = createMatcher(SECRET_WORDS);
    expect(type(matcher, "pug")).toBeNull();
    expect(type(matcher, "z".repeat(20))).toBeNull();
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
    expect(matcher.match("  Chantalle ")).toBe("chantalle");
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
