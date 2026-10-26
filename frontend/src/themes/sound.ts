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

/** Il verso "oof": vocale cupa che scende, filtrata come una bocca. */
function oof(ac: AudioContext, out: AudioNode, at: number) {
  const mouth = ac.createBiquadFilter();
  mouth.type = "bandpass";
  mouth.frequency.value = 700;
  mouth.Q.value = 2;
  mouth.connect(out);
  tone(ac, mouth, 230, at, 0.32, { type: "sawtooth", glideTo: 130, gain: 0.5, attack: 0.02 });
  tone(ac, out, 230, at, 0.3, { glideTo: 130, gain: 0.12, attack: 0.02 });
}

/** Accordo di potenza distorto, da chitarra elettrica. */
function powerChord(ac: AudioContext, out: AudioNode, at: number, dur: number) {
  const drive = ac.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < curve.length; i += 1) {
    const x = (i / 128) - 1;
    curve[i] = Math.tanh(x * 6);
  }
  drive.curve = curve;
  const cab = ac.createBiquadFilter();
  cab.type = "lowpass";
  cab.frequency.value = 2600;
  drive.connect(cab).connect(out);
  [40, 47, 52].forEach((n) => tone(ac, drive, NOTE(n), at, dur, { type: "sawtooth", gain: 0.2, attack: 0.01 }));
}

/** Motore che sale o scende di giri. */
function engine(ac: AudioContext, out: AudioNode, at: number, dur: number, from: number, to: number) {
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  filter.connect(out);
  tone(ac, filter, from, at, dur, { type: "sawtooth", glideTo: to, gain: 0.14, attack: 0.05 });
  tone(ac, filter, from * 1.5, at, dur, { type: "square", glideTo: to * 1.5, gain: 0.04, attack: 0.05 });
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
  chantal(ac, out) {
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
  // Avvio da videogioco: arpeggio a 8 bit, bip dei dialoghi e "level up".
  overthinker(ac, out) {
    [60, 64, 67, 72, 76, 79, 84].forEach((n, i) => tone(ac, out, NOTE(n), i * 0.06, 0.1, { type: "square", gain: 0.06 }));
    for (let i = 0; i < 14; i += 1) tone(ac, out, 880 + (i % 3) * 110, 1.2 + i * 0.05, 0.03, { type: "square", gain: 0.03 });
    [72, 76, 79, 84, 88].forEach((n, i) => tone(ac, out, NOTE(n), 2.6 + i * 0.08, 0.25, { type: "square", gain: 0.06 }));
  },
  // Arpa di Cupido, poi il ghiaccio che si forma e si spacca.
  fre(ac, out) {
    [72, 76, 79, 83, 86, 88].forEach((n, i) => tone(ac, out, NOTE(n), i * 0.07, 0.6, { type: "triangle", gain: 0.06 }));
    tone(ac, out, 700, 1.0, 0.25, { type: "sawtooth", glideTo: 120, gain: 0.08 });
    noise(ac, out, 1.25, 0.8, { filter: "highpass", freq: 5000, gain: 0.12, attack: 0.3 });
    for (let i = 0; i < 6; i += 1) tone(ac, out, 2500 + Math.random() * 2500, 2.6 + i * 0.04, 0.15, { gain: 0.05 });
    noise(ac, out, 2.6, 0.4, { freq: 3000, q: 0.8, gain: 0.35 });
  },
  // Bip di avvio, servomotori e "beep boop".
  robot(ac, out) {
    for (let i = 0; i < 10; i += 1) tone(ac, out, 1200 + (i % 4) * 300, i * 0.09, 0.04, { type: "square", gain: 0.04 });
    tone(ac, out, 200, 1.0, 0.5, { type: "sawtooth", glideTo: 600, gain: 0.05 });
    tone(ac, out, 600, 1.5, 0.4, { type: "sawtooth", glideTo: 250, gain: 0.05 });
    tone(ac, out, 880, 2.1, 0.14, { type: "square", gain: 0.07 });
    tone(ac, out, 440, 2.3, 0.2, { type: "square", gain: 0.07 });
  },
  // Macchina da scrivere a raffica, campanello di fine riga e un rintocco solenne.
  uomo(ac, out) {
    for (let i = 0; i < 22; i += 1) noise(ac, out, i * 0.055 + Math.random() * 0.02, 0.03, { freq: 2200, q: 2, gain: 0.25 });
    bell(ac, out, 2200, 1.3, 0.6, 0.08);
    tone(ac, out, NOTE(43), 2.35, 2.2, { type: "triangle", gain: 0.35 });
    tone(ac, out, NOTE(55), 2.35, 2, { gain: 0.12 });
  },
  // Chime di ingresso nel server, spawn, due pop della chat e il celebre "oof".
  roblox(ac, out) {
    tone(ac, out, NOTE(72), 0, 0.18, { type: "triangle", gain: 0.12 });
    tone(ac, out, NOTE(79), 0.12, 0.35, { type: "triangle", gain: 0.12 });
    noise(ac, out, 1.25, 0.35, { freq: 1800, q: 0.6, gain: 0.12, attack: 0.15 });
    [2.1, 2.45].forEach((at) => tone(ac, out, 1250, at, 0.07, { gain: 0.1 }));
    oof(ac, out, 2.8);
  },
  // "Velocità. Io sono velocità": motore che sale, flash dei fotografi, ka-ciao e sfrecciata.
  saetta(ac, out) {
    tone(ac, out, 55, 0.1, 1.3, { type: "sawtooth", gain: 0.05, vibrato: 0.06 });
    engine(ac, out, 1.35, 0.7, 70, 260);
    [2.15, 2.25, 2.32, 2.45, 2.52, 2.66].forEach((at) => noise(ac, out, at, 0.05, { filter: "highpass", freq: 4000, gain: 0.18 }));
    [76, 83, 88].forEach((n) => tone(ac, out, NOTE(n), 2.2, 0.8, { type: "square", gain: 0.035 }));
    engine(ac, out, 2.9, 0.6, 320, 90);
  },
  // Matita che scarabocchia le frecce, un "mmh?" e il battito di ciglia.
  theobserver(ac, out) {
    tone(ac, out, 160, 0.5, 0.5, { type: "triangle", glideTo: 220, gain: 0.12, attack: 0.08 });
    for (let i = 0; i < 8; i += 1) noise(ac, out, 1.3 + i * 0.12, 0.09, { filter: "highpass", freq: 3500, gain: 0.08, attack: 0.02 });
    tone(ac, out, 180, 2.6, 0.35, { type: "triangle", glideTo: 120, gain: 0.14, attack: 0.05 });
    tone(ac, out, 230, 2.95, 0.35, { type: "triangle", glideTo: 300, gain: 0.14, attack: 0.05 });
    noise(ac, out, 3.45, 0.05, { freq: 900, q: 2, gain: 0.2 });
  },
  // Boom bap, scratch del vinile, silenzio imbarazzante, colpo e microfono che cade.
  darko(ac, out) {
    const beat = 0.21;
    for (let i = 0; i < 8; i += 1) {
      const at = i * beat;
      if (i % 4 === 0 || i === 5) tone(ac, out, 120, at, 0.22, { glideTo: 45, gain: 0.5 });
      if (i % 4 === 2) noise(ac, out, at, 0.16, { freq: 1800, q: 0.7, gain: 0.35 });
      noise(ac, out, at + beat / 2, 0.04, { filter: "highpass", freq: 8000, gain: 0.08 });
    }
    noise(ac, out, 1.7, 0.18, { freq: 900, q: 3, gain: 0.4, attack: 0.01 });
    noise(ac, out, 1.88, 0.14, { freq: 1600, q: 3, gain: 0.35, attack: 0.01 });
    tone(ac, out, 70, 2.4, 0.5, { glideTo: 35, gain: 0.5 });
    noise(ac, out, 2.95, 0.3, { filter: "lowpass", freq: 600, gain: 0.6, attack: 0.002 });
    tone(ac, out, 2600, 3.05, 0.6, { glideTo: 3100, gain: 0.025 });
  },
  // Notifica dell'app, motorino che arriva, campanello.
  justeat(ac, out) {
    tone(ac, out, NOTE(84), 0, 0.15, { gain: 0.12 });
    tone(ac, out, NOTE(91), 0.12, 0.3, { gain: 0.12 });
    engine(ac, out, 0.6, 1.6, 140, 200);
    tone(ac, out, NOTE(76), 2.4, 0.9, { gain: 0.16 });
    tone(ac, out, NOTE(72), 2.75, 1.1, { gain: 0.16 });
  },
  // Neon che si accendono, bilanciere che sbatte, conteggio delle ripetizioni.
  greentheory(ac, out) {
    [0.1, 0.35, 0.5].forEach((at) => noise(ac, out, at, 0.08, { filter: "highpass", freq: 3000, gain: 0.15 }));
    tone(ac, out, 100, 0.1, 0.9, { type: "sawtooth", gain: 0.02 });
    noise(ac, out, 1.1, 0.3, { filter: "lowpass", freq: 500, gain: 0.7, attack: 0.002 });
    tone(ac, out, 60, 1.1, 0.4, { glideTo: 35, gain: 0.6 });
    [1.6, 1.85, 2.1].forEach((at, i) => tone(ac, out, NOTE(72 + i * 2), at, 0.12, { type: "square", gain: 0.05 }));
    tone(ac, out, NOTE(79), 2.4, 0.5, { type: "square", gain: 0.06 });
  },
  // Ronzio dei neon, cassa, rullata e accordo distorto.
  cryptofix(ac, out) {
    tone(ac, out, 100, 0, 1.2, { type: "sawtooth", gain: 0.025 });
    [0.3, 0.5, 0.62].forEach((at) => noise(ac, out, at, 0.06, { filter: "highpass", freq: 3500, gain: 0.12 }));
    [1.2, 1.5, 1.8, 1.9, 2.0, 2.1].forEach((at, i) =>
      i < 2 ? tone(ac, out, 110, at, 0.25, { glideTo: 45, gain: 0.55 }) : noise(ac, out, at, 0.08, { freq: 1800, gain: 0.3 }),
    );
    powerChord(ac, out, 2.2, 1.6);
    noise(ac, out, 2.2, 1.2, { filter: "highpass", freq: 6000, gain: 0.12, attack: 0.01 });
  },
  // Annaffiatoio, germogli che spuntano (plip!) e uccellini.
  ortol(ac, out) {
    noise(ac, out, 0.3, 1.1, { freq: 3000, q: 0.5, gain: 0.08, attack: 0.2 });
    [1.4, 1.6, 1.8, 2.0].forEach((at, i) => tone(ac, out, NOTE(72 + i * 3), at, 0.12, { glideTo: NOTE(79 + i * 3), gain: 0.1 }));
    [2.5, 2.62, 2.9, 3.02].forEach((at) => tone(ac, out, 3200, at, 0.09, { glideTo: 4200, gain: 0.05 }));
  },
  // Palleggi, swish della retina, sirena di fine partita.
  basket(ac, out) {
    [0, 0.32, 0.6].forEach((at) => tone(ac, out, 140, at, 0.12, { type: "triangle", glideTo: 70, gain: 0.45 }));
    noise(ac, out, 1.45, 0.3, { filter: "highpass", freq: 2500, gain: 0.18, attack: 0.05 });
    tone(ac, out, 240, 1.9, 0.9, { type: "sawtooth", gain: 0.08 });
    tone(ac, out, 247, 1.9, 0.9, { type: "square", gain: 0.05 });
    noise(ac, out, 2.1, 1.4, { freq: 1000, q: 0.5, gain: 0.18, attack: 0.3 });
  },
  // Fischio dell'arbitro, battuta, palla a terra, il palazzetto che esplode e un trillo per il punto.
  bellesia(ac, out) {
    tone(ac, out, 2900, 0.05, 0.35, { type: "triangle", gain: 0.08, vibrato: 0.04 });
    noise(ac, out, 0.6, 0.08, { freq: 1200, q: 1.5, gain: 0.45 });
    noise(ac, out, 0.65, 1.1, { freq: 700, q: 0.6, gain: 0.06, attack: 0.5 });
    tone(ac, out, 150, 1.8, 0.15, { type: "triangle", glideTo: 70, gain: 0.45 });
    noise(ac, out, 1.85, 1.5, { freq: 1100, q: 0.5, gain: 0.2, attack: 0.25 });
    [84, 88, 91, 96].forEach((n, i) => tone(ac, out, NOTE(n), 1.9 + i * 0.09, 0.35, { gain: 0.08 }));
  },
  default(ac, out) {
    tone(ac, out, 420, 0, 0.18, { glideTo: 980, gain: 0.18 });
  },
};

export function playThemeSound(id: ThemeId) {
  play(SOUNDS[id]);
}

/** I suoni degli easter egg, uno per tema. */
const EGG_SOUNDS: Record<ThemeId, (ac: AudioContext, out: AudioNode) => void> = {
  // Whoosh del giro della morte.
  default(ac, out) {
    noise(ac, out, 0, 1, { freq: 600, q: 0.7, gain: 0.25, attack: 0.4 });
    tone(ac, out, 300, 0, 1, { glideTo: 900, gain: 0.06 });
  },
  // Rantolo del lama, sputo e splash.
  peru(ac, out) {
    noise(ac, out, 0.5, 0.4, { freq: 400, q: 2, gain: 0.35, attack: 0.2 });
    noise(ac, out, 0.95, 0.12, { freq: 2500, q: 1, gain: 0.4 });
    noise(ac, out, 1.25, 0.35, { filter: "lowpass", freq: 900, gain: 0.5 });
  },
  holy(ac, out) {
    [60, 64, 67, 72, 76].forEach((n) => {
      for (const detune of [-8, 8]) tone(ac, out, NOTE(n), 0, 3, { type: "sawtooth", gain: 0.02, attack: 0.7, detune });
    });
    bell(ac, out, NOTE(88), 0.4, 2, 0.06);
  },
  // Cassa che fa i conti: tic tic tic e campanello.
  quattro(ac, out) {
    for (let i = 0; i < 6; i += 1) tone(ac, out, 1800, i * 0.07, 0.04, { type: "square", gain: 0.05 });
    bell(ac, out, 1180, 0.5, 0.9, 0.2);
  },
  drum(ac, out) {
    noise(ac, out, 0, 1.4, { filter: "highpass", freq: 2500, gain: 0.08, attack: 0.3 });
    [1.4, 1.65].forEach((at) => noise(ac, out, at, 0.2, { freq: 560, q: 1.4, gain: 0.45 }));
  },
  // Trombone triste: schedina persa.
  surebet(ac, out) {
    [67, 66, 65].forEach((n, i) => tone(ac, out, NOTE(n - 12), 0.9 + i * 0.4, 0.38, { type: "sawtooth", gain: 0.08, vibrato: 0.01 }));
    tone(ac, out, NOTE(52), 2.1, 1.1, { type: "sawtooth", gain: 0.08, vibrato: 0.03 });
  },
  // Fischio della ciabatta in volo e schiaffo.
  puglia(ac, out) {
    noise(ac, out, 0.3, 0.6, { freq: 1400, q: 3, gain: 0.15, attack: 0.4 });
    noise(ac, out, 0.95, 0.15, { freq: 1800, q: 0.5, gain: 0.7 });
    tone(ac, out, 180, 0.95, 0.15, { glideTo: 60, gain: 0.4 });
  },
  // Colpo in canna: il resto dei colpi lo fa ogni clic.
  kalashmikov(ac, out) {
    noise(ac, out, 0, 0.06, { filter: "highpass", freq: 3000, gain: 0.4 });
    noise(ac, out, 0.15, 0.08, { filter: "highpass", freq: 2000, gain: 0.4 });
  },
  bicicletta(ac, out) {
    [0, 0.3, 0.6].forEach((at) => {
      for (let i = 0; i < 3; i += 1) bell(ac, out, 2100, at + i * 0.045, 0.4, 0.08);
    });
  },
  // Il "plin" di Siri che si mette in ascolto.
  chantal(ac, out) {
    tone(ac, out, NOTE(76), 0, 0.25, { gain: 0.12 });
    tone(ac, out, NOTE(83), 0.12, 0.4, { gain: 0.12 });
  },
  // Colpo di frusta, tonfo del death drop e applausi.
  baba(ac, out) {
    noise(ac, out, 0, 0.1, { filter: "highpass", freq: 3000, gain: 0.5 });
    tone(ac, out, 140, 0.35, 0.3, { glideTo: 40, gain: 0.6 });
    noise(ac, out, 0.6, 1.6, { freq: 2500, q: 0.4, gain: 0.15, attack: 0.2 });
  },
  overthinker(ac, out) {
    [84, 88, 91].forEach((n, i) => tone(ac, out, NOTE(n), i * 0.08, 0.15, { type: "square", gain: 0.05 }));
    for (let i = 0; i < 10; i += 1) tone(ac, out, 900 + (i % 2) * 120, 0.5 + i * 0.06, 0.03, { type: "square", gain: 0.03 });
  },
  // Timbro e ghiaccio che si forma.
  fre(ac, out) {
    tone(ac, out, 110, 1.0, 0.2, { glideTo: 50, gain: 0.5 });
    noise(ac, out, 1.0, 0.1, { freq: 700, gain: 0.4 });
    noise(ac, out, 1.8, 0.7, { filter: "highpass", freq: 5000, gain: 0.1, attack: 0.3 });
  },
  // "Boop", poi l'allarme dell'autodistruzione.
  robot(ac, out) {
    tone(ac, out, 440, 0, 0.18, { type: "square", gain: 0.08 });
    for (let i = 0; i < 6; i += 1) tone(ac, out, i % 2 ? 660 : 880, 0.9 + i * 0.4, 0.3, { type: "square", gain: 0.05 });
    tone(ac, out, 600, 3.5, 0.6, { type: "sawtooth", glideTo: 150, gain: 0.06 });
  },
  // La penna che corregge la storia.
  uomo(ac, out) {
    for (let i = 0; i < 6; i += 1) noise(ac, out, i * 0.1, 0.08, { filter: "highpass", freq: 3500, gain: 0.1, attack: 0.02 });
  },
  roblox(ac, out) {
    oof(ac, out, 0.05);
    tone(ac, out, NOTE(72), 2.8, 0.15, { type: "triangle", gain: 0.1 });
    tone(ac, out, NOTE(79), 2.9, 0.3, { type: "triangle", gain: 0.1 });
  },
  saetta(ac, out) {
    engine(ac, out, 0, 0.7, 80, 320);
    [0.4, 0.5, 0.62, 0.75, 0.9].forEach((at) => noise(ac, out, at, 0.05, { filter: "highpass", freq: 4000, gain: 0.18 }));
  },
  // Occhio che sbatte, irritato.
  theobserver(ac, out) {
    [0, 0.18, 0.36].forEach((at) => noise(ac, out, at, 0.05, { freq: 900, q: 2, gain: 0.2 }));
    tone(ac, out, 220, 0.5, 0.4, { type: "triangle", glideTo: 140, gain: 0.12 });
  },
  // Scratch del vinile.
  darko(ac, out) {
    noise(ac, out, 0, 0.18, { freq: 900, q: 3, gain: 0.4, attack: 0.01 });
    noise(ac, out, 0.2, 0.14, { freq: 1600, q: 3, gain: 0.35, attack: 0.01 });
  },
  // Il rider sgranocchia le patatine.
  justeat(ac, out) {
    for (let i = 0; i < 7; i += 1) noise(ac, out, 0.6 + i * 0.13, 0.05, { freq: 3000, q: 1.5, gain: 0.25 });
  },
  // Crunch della galletta di riso.
  greentheory(ac, out) {
    for (let i = 0; i < 5; i += 1) noise(ac, out, i * 0.2, 0.08, { freq: 2500, q: 0.8, gain: 0.3 });
  },
  // Pump con ka-ching… poi il crollo.
  cryptofix(ac, out) {
    tone(ac, out, 300, 0, 1.2, { type: "sawtooth", glideTo: 1200, gain: 0.04 });
    bell(ac, out, 2400, 1.2, 0.5, 0.08);
    tone(ac, out, 1200, 1.6, 0.9, { type: "sawtooth", glideTo: 80, gain: 0.06 });
  },
  ortol(ac, out) {
    noise(ac, out, 0, 1.4, { freq: 3000, q: 0.5, gain: 0.1, attack: 0.2 });
    [79, 84, 88, 91].forEach((n, i) => tone(ac, out, NOTE(n), 1.5 + i * 0.1, 0.4, { gain: 0.08 }));
  },
  // Schiacciata e tabellone che va in frantumi.
  basket(ac, out) {
    noise(ac, out, 0.5, 0.15, { freq: 900, gain: 0.6 });
    for (let i = 0; i < 10; i += 1) tone(ac, out, 2500 + Math.random() * 3000, 0.55 + i * 0.03, 0.2, { gain: 0.05 });
    noise(ac, out, 0.8, 1.6, { freq: 1000, q: 0.5, gain: 0.2, attack: 0.2 });
  },
  // Rincorsa, schiacciata a terra e fischio lungo dell'arbitro.
  bellesia(ac, out) {
    noise(ac, out, 0.3, 0.6, { freq: 900, q: 0.7, gain: 0.2, attack: 0.5 });
    noise(ac, out, 0.9, 0.15, { filter: "lowpass", freq: 900, gain: 0.7, attack: 0.002 });
    tone(ac, out, 110, 0.9, 0.35, { glideTo: 45, gain: 0.55 });
    tone(ac, out, 2900, 1.5, 0.7, { type: "triangle", gain: 0.08, vibrato: 0.04 });
  },
};

export function playEggSound(id: ThemeId) {
  play(EGG_SOUNDS[id]);
}

/** Il "shiun" del teletrasporto istantaneo: fischio che scende e soffio. */
export function playTeleport() {
  play((ac, out) => {
    tone(ac, out, 2600, 0, 0.18, { glideTo: 500, gain: 0.12 });
    tone(ac, out, 1300, 0.02, 0.16, { type: "triangle", glideTo: 300, gain: 0.08 });
    noise(ac, out, 0, 0.2, { freq: 3500, q: 1.2, gain: 0.2, attack: 0.01 });
  });
}

/** Uno sparo singolo, per il tiro a segno del tema kalashmikov. */
export function playShot() {
  play((ac, out) => {
    noise(ac, out, 0, 0.25, { filter: "lowpass", freq: 2600, gain: 0.6, attack: 0.001 });
    tone(ac, out, 120, 0, 0.2, { glideTo: 40, gain: 0.35 });
  });
}

function play(sound: (ac: AudioContext, out: AudioNode) => void) {
  const ac = audio();
  if (!ac) return;
  const master = ac.createGain();
  master.gain.value = 0.7;
  master.connect(ac.destination);
  try {
    sound(ac, master);
  } catch {
    // L'audio è un extra: se il browser si rifiuta, l'animazione va avanti lo stesso.
  }
}
