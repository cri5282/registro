// Effetti sonori sintetizzati con Web Audio: niente file da scaricare né licenze.
import type { ThemeId } from "./words";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface ToneOptions {
  type?: OscillatorType;
  gain?: number;
  attack?: number;
  glideTo?: number;
  vibrato?: number;
  detune?: number;
}

function tone(ac: AudioContext, out: AudioNode, freq: number, at: number, dur: number, opts: ToneOptions = {}) {
  const { type = "sine", gain = 0.2, attack = 0.005, glideTo, vibrato, detune = 0 } = opts;
  const t = ac.currentTime + at;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.detune.value = detune;
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  if (vibrato) {
    const lfo = ac.createOscillator();
    const depth = ac.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.value = freq * vibrato;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + dur + 0.05);
  }
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(env).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

let noiseBuffer: AudioBuffer | null = null;

function noise(
  ac: AudioContext,
  out: AudioNode,
  at: number,
  dur: number,
  opts: { filter?: BiquadFilterType; freq?: number; q?: number; gain?: number; attack?: number } = {},
) {
  const { filter = "bandpass", freq = 1000, q = 1, gain = 0.3, attack = 0.003 } = opts;
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  const t = ac.currentTime + at;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer;
  const biquad = ac.createBiquadFilter();
  biquad.type = filter;
  biquad.frequency.value = freq;
  biquad.Q.value = q;
  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(biquad).connect(env).connect(out);
  src.start(t);
  src.stop(t + dur + 0.05);
}

function bell(ac: AudioContext, out: AudioNode, freq: number, at: number, dur = 1.2, gain = 0.18) {
  tone(ac, out, freq, at, dur, { gain });
  tone(ac, out, freq * 2.76, at, dur * 0.5, { gain: gain * 0.35 });
  tone(ac, out, freq * 5.4, at, dur * 0.25, { gain: gain * 0.15 });
}

const NOTE = (n: number) => 440 * 2 ** ((n - 69) / 12);

const SOUNDS: Record<ThemeId, (ac: AudioContext, out: AudioNode) => void> = {
  // Flauto di Pan: soffio + seno con vibrato, frase pentatonica andina.
  peru(ac, out) {
    [76, 79, 81, 83, 81, 79, 76].forEach((n, i) => {
      const at = i * 0.2;
      const dur = i === 6 ? 0.9 : 0.24;
      tone(ac, out, NOTE(n), at, dur, { gain: 0.16, attack: 0.04, vibrato: 0.008 });
      noise(ac, out, at, dur * 0.8, { freq: NOTE(n) * 2, q: 4, gain: 0.04, attack: 0.03 });
    });
  },
  // Coro "aaah": accordo di seghe leggermente stonate, attacco lento.
  holy(ac, out) {
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    filter.connect(out);
    [48, 55, 60, 64, 67, 72].forEach((n) => {
      for (const detune of [-9, 0, 9]) {
        tone(ac, filter, NOTE(n), 0, 3.2, { type: "sawtooth", gain: 0.025, attack: 0.9, detune, vibrato: 0.004 });
      }
    });
    bell(ac, out, NOTE(84), 1.6, 2, 0.08);
  },
  // Campana del ring tre volte e folla in delirio.
  quattro(ac, out) {
    [0, 0.28, 0.56].forEach((at) => bell(ac, out, 1180, at, 0.9, 0.22));
    noise(ac, out, 0.8, 3.2, { freq: 900, q: 0.6, gain: 0.22, attack: 0.6 });
    noise(ac, out, 1.2, 2.6, { freq: 2400, q: 0.8, gain: 0.08, attack: 0.4 });
  },
  // Accendino (scatto + fiammata) e poi un colpo di tosse.
  drum(ac, out) {
    noise(ac, out, 0, 0.04, { filter: "highpass", freq: 3000, gain: 0.5 });
    noise(ac, out, 0.06, 0.5, { freq: 1800, q: 0.5, gain: 0.12, attack: 0.05 });
    [1.2, 1.55, 1.8].forEach((at, i) => {
      noise(ac, out, at, 0.22 - i * 0.03, { freq: 520 + i * 60, q: 1.4, gain: 0.5 - i * 0.12, attack: 0.01 });
      tone(ac, out, 150 - i * 10, at, 0.16, { type: "triangle", gain: 0.12 });
    });
  },
  // Slot machine: rulli che girano e cha-ching finale.
  surebet(ac, out) {
    for (let i = 0; i < 14; i += 1) tone(ac, out, 600 + (i % 3) * 120, i * 0.07, 0.05, { type: "square", gain: 0.05 });
    [83, 88, 91, 95].forEach((n, i) => tone(ac, out, NOTE(n), 1.05 + i * 0.07, 0.6, { type: "square", gain: 0.07 }));
    for (let i = 0; i < 8; i += 1) bell(ac, out, 2400 + Math.random() * 1600, 1.35 + i * 0.06, 0.35, 0.05);
  },
  // La taranta: filo che scende, morso, poi pizzica (tamburello in 6/8 e organetto) e fazzoletto che frusta.
  puglia(ac, out) {
    tone(ac, out, 1400, 0, 0.5, { glideTo: 500, gain: 0.04 });
    noise(ac, out, 0.62, 0.12, { freq: 2500, q: 2, gain: 0.5 });
    tone(ac, out, 220, 0.62, 0.15, { type: "square", glideTo: 90, gain: 0.12 });
    const beat = 0.14;
    for (let i = 0; i < 15; i += 1) {
      const at = 0.75 + i * beat;
      noise(ac, out, at, 0.09, { filter: "highpass", freq: 6500, gain: i % 3 === 0 ? 0.3 : 0.12 });
      if (i % 3 === 0) tone(ac, out, 95, at, 0.16, { gain: 0.3 });
    }
    [74, 76, 77, 79, 77, 76, 74, 73, 74, 76, 74, 69].forEach((n, i) => {
      const at = 0.75 + i * beat;
      tone(ac, out, NOTE(n), at, beat * 1.1, { type: "sawtooth", gain: 0.045 });
      tone(ac, out, NOTE(n + 12), at, beat * 1.1, { type: "square", gain: 0.015 });
    });
    noise(ac, out, 2.2, 0.5, { freq: 900, q: 0.7, gain: 0.25, attack: 0.25 });
    noise(ac, out, 3.35, 0.5, { freq: 1400, q: 0.7, gain: 0.2, attack: 0.2 });
  },
  // Tre colpi e bossoli che tintinnano a terra.
  kalashmikov(ac, out) {
    [0.9, 1.35, 1.8].forEach((at) => {
      noise(ac, out, at, 0.35, { filter: "lowpass", freq: 2600, gain: 0.7, attack: 0.001 });
      tone(ac, out, 120, at, 0.25, { glideTo: 40, gain: 0.45 });
    });
    [2.1, 2.25, 2.33, 2.5, 2.62].forEach((at) => tone(ac, out, 3200 + Math.random() * 1500, at, 0.12, { gain: 0.06 }));
  },
  // Campanello della bici, due volte: dring dring.
  bicicletta(ac, out) {
    [0, 0.38].forEach((at) => {
      for (let i = 0; i < 4; i += 1) bell(ac, out, 2100, at + i * 0.045, 0.5, 0.09);
    });
  },
  // Notifica "ding" vetrosa.
  chantalle(ac, out) {
    tone(ac, out, NOTE(88), 0.9, 0.7, { gain: 0.16 });
    tone(ac, out, NOTE(95), 1.02, 1.1, { gain: 0.14 });
    tone(ac, out, NOTE(100), 1.02, 0.5, { gain: 0.04 });
  },
  // Colpo d'orchestra disco e cassa in quattro.
  baba(ac, out) {
    [60, 64, 67, 72, 76].forEach((n) => tone(ac, out, NOTE(n), 0, 0.5, { type: "sawtooth", gain: 0.05 }));
    noise(ac, out, 0, 0.3, { freq: 2000, q: 0.5, gain: 0.2 });
    for (let i = 0; i < 8; i += 1) {
      tone(ac, out, 110, 0.6 + i * 0.25, 0.18, { glideTo: 45, gain: 0.4 });
      noise(ac, out, 0.725 + i * 0.25, 0.05, { filter: "highpass", freq: 8000, gain: 0.12 });
    }
  },
  default(ac, out) {
    tone(ac, out, 420, 0, 0.18, { glideTo: 980, gain: 0.18 });
  },
};

export function playThemeSound(id: ThemeId) {
  const ac = audio();
  if (!ac) return;
  const master = ac.createGain();
  master.gain.value = 0.7;
  master.connect(ac.destination);
  try {
    SOUNDS[id](ac, master);
  } catch {
    // L'audio è un extra: se il browser si rifiuta, l'animazione va avanti lo stesso.
  }
}
