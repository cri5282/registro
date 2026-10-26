import type { ReactNode } from "react";
import { splitUomo } from "./uomoText";

/** Colora di rosso ogni "uomo" nel testo (solo il tema uomo lo rende visibile). */
export function uomo(text: string): ReactNode {
  const parts = splitUomo(text);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 ? (
      <span key={i} className="uomo-word">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
