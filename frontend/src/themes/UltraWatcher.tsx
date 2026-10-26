import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { api } from "../api";
import { addDays, localDateKey, startOfDay } from "../date";
import type { EventItem } from "../types";
import { ATTENDANCE_EVENT, type AttendanceDetail } from "./ThemeExtras";
import { completesStreak } from "./ultra";

const UltraInstinct = lazy(() => import("./UltraInstinct"));

/**
 * Dopo ogni assenza controlla se quel giorno e uno vicino sono tutti assenti: se sì, arriva lui.
 * La lezione appena cliccata si conta già assente, così non si aspetta la fine del salvataggio.
 */
export default function UltraWatcher() {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;

  useEffect(() => {
    const timers: number[] = [];

    async function check(detail: AttendanceDetail): Promise<boolean> {
      if (openRef.current) return true;
      const day = startOfDay(new Date(detail.start));
      const today = new Date();
      const until = addDays(startOfDay(today), 1);
      const events = await api.events(addDays(day, -10), addDays(day, 10) < until ? addDays(day, 10) : until);
      const patched: EventItem[] = events.map((event) =>
        event.id === detail.eventId
          ? { ...event, attendance: { note: null, entry_time: null, exit_time: null, updated_at: "", ...event.attendance, status: "absent" } }
          : event,
      );
      if (!completesStreak(patched, today, localDateKey(day))) return false;
      setOpen(true);
      return true;
    }

    function onAttendance(event: Event) {
      const detail = (event as CustomEvent<AttendanceDetail>).detail;
      if (detail.status !== "absent") return;
      timers.forEach(window.clearTimeout);
      timers.length = 0;
      // Due tentativi: se si cliccano le assenze in fila, quella prima può essere ancora in salvataggio.
      for (const delay of [500, 2500]) {
        timers.push(
          window.setTimeout(() => {
            void check(detail)
              .then((found) => {
                if (found) timers.forEach(window.clearTimeout);
              })
              .catch(() => {});
          }, delay),
        );
      }
    }

    window.addEventListener(ATTENDANCE_EVENT, onAttendance);
    return () => {
      window.removeEventListener(ATTENDANCE_EVENT, onAttendance);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <UltraInstinct onClose={() => setOpen(false)} />
    </Suspense>
  );
}
