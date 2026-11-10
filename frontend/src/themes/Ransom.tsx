import type { CSSProperties } from "react";
import "./ransom.css";

const TILT = [-7, 4, -3, 6, -5, 2, 8, -2];

/** Scritta da lettera anonima: ogni lettera ritagliata da un giornale diverso. */
export default function Ransom({ text, className = "", style }: { text: string; className?: string; style?: CSSProperties }) {
  return (
    <span className={`ransom ${className}`} style={style} aria-label={text} role="img">
      {[...text].map((ch, i) => {
        if (ch === " ") return <span key={i} className="rn-gap" />;
        const code = ch.charCodeAt(0);
        return (
          <span key={i} className={`rn rn-${(i * 7 + code) % 5}`} style={{ rotate: `${TILT[(i * 3 + code) % TILT.length]}deg` }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}
