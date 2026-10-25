import type { AnimationProps } from "../registry";
import { useTimeline } from "./shared";
import "./default.css";

/** Ritorno al tema normale: dissolvenza veloce con il logo che fa una piroetta. */
export default function Default(props: AnimationProps) {
  useTimeline(props, 320, 950);
  return (
    <div className="anim anim-default">
      <div className="anim-center">
        <svg viewBox="0 0 64 64" width="84" height="84" className="default-logo">
          <rect width="64" height="64" rx="16" fill="#6d5dfc" />
          <path d="m20 33 8 8 16-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
