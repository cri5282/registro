// Riconoscimento delle parole segrete digitate in giro per l'app.
// Puro e senza DOM, così si può testare da solo.

const BUFFER_SIZE = 16;

/** Minuscolo, senza accenti e solo lettere: "Perù" → "peru". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export function createMatcher<T extends string>(words: Record<string, T>) {
  const entries = Object.entries(words).map(([word, id]) => [normalize(word), id] as const);
  let buffer = "";

  return {
    /** Aggiunge un tasto; restituisce l'id se il buffer ora termina con una parola. */
    push(key: string): T | null {
      const letter = normalize(key);
      if (letter.length !== 1) return null;
      buffer = (buffer + letter).slice(-BUFFER_SIZE);
      for (const [word, id] of entries) {
        if (buffer.endsWith(word)) {
          buffer = "";
          return id;
        }
      }
      return null;
    },
    /** Riconosce una parola intera (usato dal prompt su mobile). */
    match(text: string): T | null {
      const word = normalize(text);
      return entries.find(([candidate]) => candidate === word)?.[1] ?? null;
    },
    reset() {
      buffer = "";
    },
  };
}

/** True se il tasto arriva da un campo dove l'utente sta scrivendo davvero. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || typeof (target as HTMLElement).tagName !== "string") return false;
  const element = target as HTMLElement;
  const tag = element.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || element.isContentEditable;
}
