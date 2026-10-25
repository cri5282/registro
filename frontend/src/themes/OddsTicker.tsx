import { useMemo } from "react";
import { fmtTime } from "../date";
import type { EventItem } from "../types";
import { useTheme } from "./ThemeProvider";

/** Quota "seria" ma stabile per ogni lezione: stesso titolo, stessa quota. */
function odds(seed: string, min: number, max: number) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const unit = (Math.abs(hash) % 1000) / 1000;
  return (min + unit * (max - min)).toFixed(2);
}

/** Striscia LIVE con le quote delle lezioni di oggi. Solo nel tema surebet. */
export default function OddsTicker({ events }: { events: EventItem[] }) {
  const { theme } = useTheme();
  const items = useMemo(() => {
    const lines = events.map(
      (event) =>
        `${fmtTime(event.start)} ${event.title} · presenza @${odds(event.title, 1.05, 1.6)} · assenza @${odds(event.id, 3, 14)}`,
    );
    return lines.length ? lines : ["Nessuna lezione oggi · bonus benvenuto 100% sul riposo @1.01"];
  }, [events]);

  if (theme !== "surebet") return null;
  const track = [...items, "Il gioco può causare dipendenza. Anche la scuola."];
  return (
    <div className="odds-ticker" aria-hidden="true">
      <span className="odds-live">LIVE</span>
      <div className="odds-window">
        <div className="odds-track">
          {[...track, ...track].map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
