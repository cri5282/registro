/** Annaffiatoio verde con il beccuccio a destra. Disegnato apposta. */
export default function WateringCan({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" aria-hidden="true">
      <path d="M30 22Q40 6 58 6Q76 6 84 22" fill="none" stroke="#2f6b3a" strokeWidth="6" strokeLinecap="round" />
      <path d="M78 40L112 18L116 24L84 52Z" fill="#3f8f4a" stroke="#2f6b3a" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="114" cy="20" rx="5" ry="8" transform="rotate(-35 114 20)" fill="#2f6b3a" />
      <path d="M22 26H86L82 74Q80 78 74 78H34Q28 78 26 74Z" fill="#4fae5c" stroke="#2f6b3a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 36H80" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
