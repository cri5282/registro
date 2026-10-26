/** L'auto da corsa rossa numero 95 con gli occhi sul parabrezza. Disegnata apposta, guarda a destra. */
export default function RaceCar({ className }: { className?: string }) {
  return (
    <svg className={`race-car ${className ?? ""}`} viewBox="0 0 300 124" aria-hidden="true">
      <ellipse cx="156" cy="116" rx="140" ry="6" fill="#000" opacity="0.22" />
      {/* Alettone */}
      <path d="M14 40H52L48 47H18Z" fill="#a50f15" />
      <rect x="30" y="46" width="6" height="14" fill="#7a0b10" />
      {/* Carrozzeria */}
      <path
        d="M18 84Q18 62 46 58L96 52Q122 28 162 26L200 28Q228 32 244 52L274 57Q296 62 296 82V90Q296 98 288 98H26Q18 98 18 90Z"
        fill="#d7141a"
      />
      <path d="M26 64Q60 58 100 56L242 56Q270 60 290 66" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
      {/* Saetta gialla sul fianco */}
      <path d="M34 70L150 64L138 72L262 66L150 86L162 78L40 82Z" fill="#ffc72c" stroke="#e08a00" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="96" y="83" fill="#1b1b1b" stroke="#ffc72c" strokeWidth="1" fontFamily="Racing Sans One, Impact, sans-serif" fontSize="22" fontStyle="italic" fontWeight="700">
        95
      </text>
      {/* Parabrezza con gli occhi */}
      <path d="M166 31H204Q228 36 240 53H170Z" fill="#f4fbff" stroke="#1b1b1b" strokeWidth="2" strokeLinejoin="round" />
      <g className="rc-eye">
        <ellipse cx="208" cy="43" rx="10" ry="8" fill="#fff" stroke="#1b1b1b" strokeWidth="1.5" />
        <circle className="rc-iris" cx="212" cy="44" r="5" fill="#2a7fd4" />
        <circle className="rc-iris" cx="213" cy="44" r="2.4" fill="#0b0b0b" />
        <path className="rc-lid" d="M197 40Q208 32 219 40" fill="#d7141a" stroke="#1b1b1b" strokeWidth="1.5" />
      </g>
      <ellipse cx="182" cy="43" rx="7" ry="7.5" fill="#fff" stroke="#1b1b1b" strokeWidth="1.5" />
      <circle cx="185" cy="44" r="3.8" fill="#2a7fd4" />
      <circle cx="186" cy="44" r="1.8" fill="#0b0b0b" />
      <path d="M175 39Q182 34 189 39" fill="#d7141a" stroke="#1b1b1b" strokeWidth="1.5" />
      {/* Sorriso sul paraurti */}
      <path d="M262 80Q278 92 294 80" fill="#1b1b1b" />
      <path d="M266 81Q278 88 290 81" fill="#fff" />
      {/* Ruote */}
      {[78, 238].map((cx) => (
        <g key={cx} className="rc-wheel">
          <circle cx={cx} cy="98" r="21" fill="#1b1b1b" />
          <circle cx={cx} cy="98" r="11" fill="#d7141a" />
          <path d={`M${cx - 11} 98H${cx + 11}M${cx} 87V109`} stroke="#7a0b10" strokeWidth="3" />
          <circle cx={cx} cy="98" r="3" fill="#ffc72c" />
        </g>
      ))}
    </svg>
  );
}
