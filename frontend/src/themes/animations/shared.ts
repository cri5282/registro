import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { AnimationProps } from "../registry";
import "./base.css";

/** Chiama onCovered e onDone ai millisecondi indicati, una volta sola. */
export function useTimeline({ onCovered, onDone }: AnimationProps, coverAt: number, doneAt: number) {
  const latest = useRef({ onCovered, onDone });
  latest.current = { onCovered, onDone };

  useEffect(() => {
    const cover = window.setTimeout(() => latest.current.onCovered(), coverAt);
    const done = window.setTimeout(() => latest.current.onDone(), doneAt);
    return () => {
      window.clearTimeout(cover);
      window.clearTimeout(done);
    };
  }, [coverAt, doneAt]);
}

/** n elementi con valori casuali stabili per tutta l'animazione. */
export function useScatter<T>(n: number, make: (index: number) => T): T[] {
  const [items] = useState(() => Array.from({ length: n }, (_, index) => make(index)));
  return items;
}

export const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Scorciatoia per passare custom properties CSS negli style inline. */
export function vars(values: Record<string, string | number>): CSSProperties {
  return values as CSSProperties;
}
