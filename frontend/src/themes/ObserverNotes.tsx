import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EGG_EVENT } from "./eggs";

type Side = "t" | "b" | "l" | "r" | "tl" | "tr" | "bl" | "br";

interface Rule {
  selector: string;
  side: Side;
  notes: string[];
  max?: number;
  /** Indica la fine del testo invece del bordo del riquadro (i titoli sono larghi ma il testo è corto). */
  text?: boolean;
  /** Elemento fisso o sticky: la nota vive in coordinate dello schermo. */
  fixed?: boolean;
}

/** Cosa si annota e come: la prima nota va al primo elemento trovato, e così via. */
const RULES: Rule[] = [
  { selector: ".topbar-brand", side: "b", notes: ["il logo. Probabilmente importante."], text: true, fixed: true },
  { selector: ".page-header h1", side: "r", notes: ["IL TITOLO. Grande. Importante."], text: true },
  { selector: ".stat-chip", side: "t", notes: ["un numero verde. Buono?", "un numero rosso. Cattivo?"], max: 2 },
  { selector: ".page-subtitle", side: "r", notes: ["la data (è oggi, giuro)"], text: true },
  { selector: ".section-head h2", side: "r", notes: ["un sottotitolo (più piccolo)", "un altro sottotitolo"], text: true, max: 2 },
  {
    selector: ".event-heading h3",
    side: "r",
    notes: ["cos'è questo? Una materia?", "e questo??", "un'altra?!", "ancora…", "ok, ho capito"],
    text: true,
    max: 5,
  },
  { selector: ".status-present", side: "t", notes: ["premi se c'eri (c'eri?)"], max: 1 },
  { selector: ".sidebar .avatar", side: "tr", notes: ["sei tu! ciao!"], max: 1 },
  { selector: ".theme-widget-sidebar .tw-ob", side: "b", notes: ["l'Osservatore. Ti osserva mentre osservi."], max: 1 },
  { selector: ".bottom-nav", side: "t", notes: ["la barra in basso. Sta in basso."], fixed: true },
  { selector: ".ring", side: "r", notes: ["un cerchio. Ipnotico."] },
  { selector: ".group-title", side: "r", notes: ["una materia", "un'altra materia", "sì, anche questa"], text: true, max: 3 },
  { selector: ".bar-track", side: "b", notes: ["una barra. Più è lunga, più è lunga."] },
  { selector: ".calendar-grid", side: "t", notes: ["dei quadratini. Sono giorni."] },
  { selector: ".segmented", side: "b", notes: ["scegli. O non scegliere."] },
  { selector: ".button-primary", side: "b", notes: ["bottone colorato = bottone importante"] },
  { selector: "input:not([type=hidden]):not([type=checkbox])", side: "r", notes: ["qui si scrive", "anche qui"], max: 2 },
];

const DIRECTION: Record<Side, [number, number]> = {
  t: [0, -1],
  b: [0, 1],
  l: [-1, 0],
  r: [1, 0],
  tl: [-1, -1],
  tr: [1, -1],
  bl: [-1, 1],
  br: [1, 1],
};

interface Note {
  text: string;
  x: number;
  y: number;
  width: number;
  path: string;
  head: string;
  align: string;
  tone: "blue" | "red";
  fixed: boolean;
}

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const REACH = 40;
const MAX_LABEL = 170;
const MIN_LABEL = 90;
const CHAR = 7.2;
const LINE = 18;

function targetRect(element: Element, text: boolean): DOMRect {
  if (!text) return element.getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(element);
  const rect = range.getBoundingClientRect();
  return rect.width ? rect : element.getBoundingClientRect();
}

function overlaps(a: Box, b: Box) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function measure(): Note[] {
  const notes: Note[] = [];
  const boxes: Box[] = [];
  const used = new Set<Element>();
  const pageWidth = document.documentElement.clientWidth;

  for (const rule of RULES) {
    let count = 0;
    for (const element of document.querySelectorAll(rule.selector)) {
      if (count >= (rule.max ?? 1)) break;
      if (used.has(element) || element.closest(".theme-curtain, .egg-layer, .secret-prompt")) continue;
      const rect = targetRect(element, Boolean(rule.text));
      if (rect.width === 0 || rect.height === 0) continue;
      const text = rule.notes[count % rule.notes.length];
      const offsetX = rule.fixed ? 0 : window.scrollX;
      const offsetY = rule.fixed ? 0 : window.scrollY;

      let [dx, dy] = DIRECTION[rule.side];
      const anchorX = (side: number) => rect.left + rect.width / 2 + side * Math.max(0, rect.width / 2 - (rule.text ? 0 : 10));
      // Etichetta più stretta se manca spazio; se non ci sta proprio, si gira dall'altra parte.
      const room = (side: number) => (side > 0 ? pageWidth - anchorX(side) - REACH - 8 : side < 0 ? anchorX(side) - REACH - 8 : pageWidth - 16);
      if (dx !== 0 && room(dx) < MIN_LABEL) dx = room(-dx) >= MIN_LABEL ? -dx : 0;
      if (dx === 0 && dy === 0) dy = -1;
      const ax = anchorX(dx);
      const ay = rect.top + rect.height / 2 + dy * Math.max(0, rect.height / 2 - (rule.text ? 0 : 4));
      const width = Math.min(MAX_LABEL, room(dx), text.length * CHAR + 10);
      const length = dx && dy ? REACH * 0.75 : REACH;
      const lx = ax + dx * length;
      const ly = ay + dy * length;

      const height = Math.ceil((text.length * CHAR) / width) * LINE;
      const left = dx < 0 ? lx - width : dx > 0 ? lx : lx - width / 2;
      const top = dy < 0 ? ly - height : dy > 0 ? ly : ly - height / 2;
      const box = { left: left + offsetX, top: top + offsetY, right: left + width + offsetX, bottom: top + height + offsetY };
      // Niente note una sopra l'altra: meglio una in meno che un groviglio.
      if (boxes.some((other) => overlaps(box, other))) continue;
      boxes.push(box);
      used.add(element);

      const mx = (ax + lx) / 2 - dy * 10;
      const my = (ay + ly) / 2 + dx * 10;
      const angle = Math.atan2(ay - my, ax - mx);
      const wing = (turn: number) => `${ax - Math.cos(angle + turn) * 9 + offsetX},${ay - Math.sin(angle + turn) * 9 + offsetY}`;
      notes.push({
        text,
        x: lx + offsetX,
        y: ly + offsetY,
        width,
        path: `M${lx + offsetX} ${ly + offsetY}Q${mx + offsetX} ${my + offsetY} ${ax + offsetX} ${ay + offsetY}`,
        head: `M${wing(0.5)}L${ax + offsetX},${ay + offsetY}L${wing(-0.5)}`,
        align: `${dx < 0 ? "end" : dx > 0 ? "start" : "mid"}-${dy < 0 ? "above" : dy > 0 ? "below" : "middle"}`,
        tone: notes.length % 2 ? "red" : "blue",
        fixed: Boolean(rule.fixed),
      });
      count += 1;
    }
  }
  return notes;
}

function NoteLayer({ notes, fixed, width, height }: { notes: Note[]; fixed: boolean; width: number; height: number }) {
  return (
    <div className={`obs-sheet${fixed ? " obs-sheet-fixed" : ""}`}>
      <svg className="obs-arrows" width={width} height={height}>
        {notes.map((note, i) => (
          <g key={i} className={`obs-arrow obs-${note.tone}`}>
            <path d={note.path} />
            <path d={note.head} />
          </g>
        ))}
      </svg>
      {notes.map((note, i) => (
        <span
          key={i}
          className={`obs-note obs-${note.tone} obs-${note.align}`}
          style={{ left: note.x, top: note.y, maxWidth: note.width }}
        >
          {note.text}
        </span>
      ))}
    </div>
  );
}

/** Frecce a penna che indicano (quasi) tutto, con spiegazioni inutili. Solo nel tema theobserver. */
export default function ObserverNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const frame = useRef(0);

  useEffect(() => {
    let timer = 0;
    function update() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          setNotes(measure());
          setSize({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight });
        });
      }, 120);
    }
    update();
    const root = document.getElementById("root");
    const mutations = new MutationObserver(update);
    if (root) mutations.observe(root, { childList: true, subtree: true });
    const resize = new ResizeObserver(update);
    resize.observe(document.body);
    window.addEventListener("resize", update);
    void document.fonts?.ready.then(update);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame.current);
      mutations.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // L'easter egg dell'occhio: offeso, smette di osservare per un po'.
  useEffect(() => {
    let timer = 0;
    function onEgg(event: Event) {
      if ((event as CustomEvent).detail !== "theobserver") return;
      setHidden(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHidden(false), 5300);
    }
    window.addEventListener(EGG_EVENT, onEgg);
    return () => {
      window.removeEventListener(EGG_EVENT, onEgg);
      window.clearTimeout(timer);
    };
  }, []);

  return createPortal(
    <div className={`obs-layer${hidden ? " is-hidden" : ""}`} aria-hidden="true">
      <NoteLayer notes={notes.filter((note) => !note.fixed)} fixed={false} width={size.width} height={size.height} />
      <NoteLayer notes={notes.filter((note) => note.fixed)} fixed width={window.innerWidth} height={window.innerHeight} />
    </div>,
    document.body,
  );
}

/** Un occhio la cui pupilla segue il puntatore. */
export function FollowEye({ className }: { className?: string }) {
  const eye = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    function onMove(event: PointerEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const element = eye.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, distance / 300);
        element.style.setProperty("--look-x", `${(dx / distance) * reach * 26}%`);
        element.style.setProperty("--look-y", `${(dy / distance) * reach * 18}%`);
      });
    }
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span ref={eye} className={`follow-eye ${className ?? ""}`}>
      <span className="follow-eye-iris" />
    </span>
  );
}
