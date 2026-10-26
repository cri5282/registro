/** Avatar a blocchi in stile "noob": testa e braccia gialle, busto blu, gambe verdi. Ogni pezzo si può far volare via. */
export default function Noob({ className }: { className?: string }) {
  return (
    <svg className={`noob ${className ?? ""}`} viewBox="0 0 100 160" aria-hidden="true">
      <g className="nb-part nb-leg-l">
        <rect x="30" y="74" width="19.5" height="44" rx="1.5" fill="#a4bd47" />
        <rect x="30" y="74" width="19.5" height="44" rx="1.5" fill="url(#nb-shade)" />
      </g>
      <g className="nb-part nb-leg-r">
        <rect x="50.5" y="74" width="19.5" height="44" rx="1.5" fill="#a4bd47" />
        <rect x="50.5" y="74" width="19.5" height="44" rx="1.5" fill="url(#nb-shade)" />
      </g>
      <g className="nb-part nb-arm-l">
        <rect x="14" y="34" width="15" height="40" rx="1.5" fill="#f5cd30" />
        <rect x="14" y="34" width="15" height="40" rx="1.5" fill="url(#nb-shade)" />
      </g>
      <g className="nb-part nb-arm-r">
        <rect x="71" y="34" width="15" height="40" rx="1.5" fill="#f5cd30" />
        <rect x="71" y="34" width="15" height="40" rx="1.5" fill="url(#nb-shade)" />
      </g>
      <g className="nb-part nb-torso">
        <rect x="29.5" y="34" width="41" height="40" rx="1.5" fill="#0d69ac" />
        <rect x="29.5" y="34" width="41" height="40" rx="1.5" fill="url(#nb-shade)" />
      </g>
      <g className="nb-part nb-head">
        <rect x="36" y="5" width="28" height="28" rx="7" fill="#f5cd30" />
        <rect x="45" y="1" width="10" height="5" rx="1.5" fill="#f5cd30" />
        <circle cx="45" cy="16" r="2.2" fill="#1b1b1b" />
        <circle cx="55" cy="16" r="2.2" fill="#1b1b1b" />
        <path d="M43 22.5Q50 28 57 22.5" fill="none" stroke="#1b1b1b" strokeWidth="2" strokeLinecap="round" />
      </g>
      <defs>
        <linearGradient id="nb-shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
      </defs>
    </svg>
  );
}
