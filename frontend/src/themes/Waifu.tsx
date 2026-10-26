import { useId } from "react";

/** Waifu chibi disegnata a mano: felpa, cuffie con orecchie da gatto e spilla rumena. */
export default function Waifu({ className, blink = true }: { className?: string; blink?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 200 230" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8ad8" />
          <stop offset="1" stopColor="#c04fd0" />
        </linearGradient>
        <radialGradient id={`${id}-eye`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#7cf3ff" />
          <stop offset="0.55" stopColor="#5b6cff" />
          <stop offset="1" stopColor="#2a1660" />
        </radialGradient>
      </defs>

      {/* Codini dietro */}
      <path d="M38 96C10 120 12 175 30 205C38 180 44 150 56 128Z" fill={`url(#${id}-hair)`} />
      <path d="M162 96C190 120 188 175 170 205C162 180 156 150 144 128Z" fill={`url(#${id}-hair)`} />

      {/* Felpa */}
      <path d="M44 230C46 196 70 178 100 178S154 196 156 230Z" fill="#3b2a6e" />
      <path d="M86 180L100 200L114 180" fill="none" stroke="#ff8ad8" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(124 206)">
        <rect x="-10" y="-7" width="20" height="14" rx="2" fill="#fcd116" />
        <rect x="-10" y="-7" width="6.7" height="14" fill="#002b7f" />
        <rect x="3.3" y="-7" width="6.7" height="14" fill="#ce1126" />
      </g>

      {/* Orecchie da gatto sulle cuffie */}
      <path d="M52 62L44 18L82 44Z" fill="#ff8ad8" stroke="#2a1660" strokeWidth="3" strokeLinejoin="round" />
      <path d="M148 62L156 18L118 44Z" fill="#ff8ad8" stroke="#2a1660" strokeWidth="3" strokeLinejoin="round" />
      <path d="M56 52L52 30L72 44Z" fill="#ffd1ef" />
      <path d="M144 52L148 30L128 44Z" fill="#ffd1ef" />

      {/* Viso */}
      <ellipse cx="100" cy="112" rx="60" ry="64" fill="#ffe6da" stroke="#2a1660" strokeWidth="3" />

      {/* Frangia */}
      <path
        d="M38 104C34 60 66 38 100 38S166 60 162 104L150 84L142 106L128 76L116 104L104 72L92 104L80 76L68 106L58 84Z"
        fill={`url(#${id}-hair)`}
        stroke="#2a1660"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Cuffie */}
      <path d="M40 104C40 54 160 54 160 104" fill="none" stroke="#2a1660" strokeWidth="9" strokeLinecap="round" />
      <rect x="26" y="98" width="22" height="38" rx="10" fill="#2de2ff" stroke="#2a1660" strokeWidth="3" />
      <rect x="152" y="98" width="22" height="38" rx="10" fill="#2de2ff" stroke="#2a1660" strokeWidth="3" />
      <path d="M36 134Q44 160 70 160" fill="none" stroke="#2a1660" strokeWidth="3" />
      <circle cx="72" cy="160" r="4" fill="#ff4fd8" />

      {/* Occhi */}
      <g className={blink ? "waifu-eyes" : undefined}>
        <ellipse cx="78" cy="122" rx="15" ry="20" fill={`url(#${id}-eye)`} stroke="#2a1660" strokeWidth="3" />
        <ellipse cx="122" cy="122" rx="15" ry="20" fill={`url(#${id}-eye)`} stroke="#2a1660" strokeWidth="3" />
        <ellipse cx="73" cy="113" rx="5.5" ry="7" fill="#fff" />
        <ellipse cx="117" cy="113" rx="5.5" ry="7" fill="#fff" />
        <circle cx="83" cy="131" r="2.6" fill="#fff" />
        <circle cx="127" cy="131" r="2.6" fill="#fff" />
      </g>
      <path d="M60 104Q78 96 94 106" fill="none" stroke="#2a1660" strokeWidth="4" strokeLinecap="round" />
      <path d="M106 106Q122 96 140 104" fill="none" stroke="#2a1660" strokeWidth="4" strokeLinecap="round" />

      {/* Guance e bocca */}
      <ellipse cx="62" cy="146" rx="10" ry="5" fill="#ff8aa8" opacity="0.6" />
      <ellipse cx="138" cy="146" rx="10" ry="5" fill="#ff8aa8" opacity="0.6" />
      <path d="M92 150Q100 158 108 150" fill="#c2335a" stroke="#2a1660" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
