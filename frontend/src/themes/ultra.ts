// Due giorni di lezione di fila tutti assenti sbloccano l'Ultra Istinto.
// Puro, così si testa senza Firebase.
import { localDateKey } from "../date";
import { isCancelled, type EventItem } from "../types";

/**
 * Coppie di giorni di lezione consecutivi (il weekend non conta) con ogni lezione segnata assente,
 * dalla più recente. Ogni coppia è una chiave "aaaa-mm-gg|aaaa-mm-gg".
 */
export function absentStreaks(events: EventItem[], today: Date): string[] {
  const todayKey = localDateKey(today);
  const allAbsent = new Map<string, boolean>();
  for (const event of events) {
    if (event.all_day || isCancelled(event)) continue;
    const key = localDateKey(new Date(event.start));
    if (key > todayKey) continue;
    const absent = event.attendance?.status === "absent";
    allAbsent.set(key, (allAbsent.get(key) ?? true) && absent);
  }

  const days = [...allAbsent.keys()].sort();
  const streaks: string[] = [];
  for (let i = days.length - 1; i > 0; i -= 1) {
    if (allAbsent.get(days[i]) && allAbsent.get(days[i - 1])) streaks.push(`${days[i - 1]}|${days[i]}`);
  }
  return streaks;
}

/** True se il giorno indicato fa parte di una coppia di giorni tutti assenti. */
export function completesStreak(events: EventItem[], today: Date, day: string): boolean {
  return absentStreaks(events, today).some((pair) => pair.split("|").includes(day));
}
