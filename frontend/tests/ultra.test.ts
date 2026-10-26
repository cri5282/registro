import { describe, expect, it } from "vitest";
import { absentStreaks, completesStreak } from "../src/themes/ultra";
import type { AttendanceStatus, EventItem } from "../src/types";

function lesson(day: string, hour: number, status: AttendanceStatus | null, title = "Storia"): EventItem {
  const start = new Date(`${day}T${String(hour).padStart(2, "0")}:00:00`);
  return {
    id: `${day}-${hour}`,
    google_event_id: "",
    calendar_id: "primary",
    title,
    description: null,
    location: null,
    start: start.toISOString(),
    end: new Date(start.getTime() + 3_600_000).toISOString(),
    all_day: false,
    status: "confirmed",
    html_link: null,
    attendance: status ? { status, note: null, entry_time: null, exit_time: null, updated_at: "" } : null,
  };
}

const TODAY = new Date("2026-10-27T12:00:00");

describe("ultra istinto", () => {
  it("scatta con due giorni di lezione di fila tutti assenti", () => {
    const events = [lesson("2026-10-26", 8, "absent"), lesson("2026-10-26", 9, "absent"), lesson("2026-10-27", 8, "absent")];
    expect(absentStreaks(events, TODAY)).toEqual(["2026-10-26|2026-10-27"]);
  });

  it("non scatta se anche una sola lezione è presente o non segnata", () => {
    expect(absentStreaks([lesson("2026-10-26", 8, "absent"), lesson("2026-10-26", 9, "present"), lesson("2026-10-27", 8, "absent")], TODAY)).toEqual([]);
    expect(absentStreaks([lesson("2026-10-26", 8, "absent"), lesson("2026-10-27", 8, null)], TODAY)).toEqual([]);
  });

  it("salta il weekend e ignora le lezioni annullate", () => {
    const events = [
      lesson("2026-10-23", 8, "absent"),
      lesson("2026-10-26", 8, "absent"),
      lesson("2026-10-26", 10, null, "Fisica ANNULLATA"),
    ];
    expect(absentStreaks(events, new Date("2026-10-26T12:00:00"))).toEqual(["2026-10-23|2026-10-26"]);
  });

  it("non guarda il futuro", () => {
    expect(absentStreaks([lesson("2026-10-27", 8, "absent"), lesson("2026-10-28", 8, "absent")], TODAY)).toEqual([]);
  });

  it("scatta solo se il giorno appena segnato fa parte della coppia, anche rifacendolo", () => {
    const events = [lesson("2026-10-19", 8, "absent"), lesson("2026-10-20", 8, "absent"), lesson("2026-10-21", 8, "present"), lesson("2026-10-26", 8, "absent"), lesson("2026-10-27", 8, "absent")];
    expect(completesStreak(events, TODAY, "2026-10-27")).toBe(true);
    expect(completesStreak(events, TODAY, "2026-10-20")).toBe(true);
    expect(completesStreak(events, TODAY, "2026-10-21")).toBe(false);
  });
});
