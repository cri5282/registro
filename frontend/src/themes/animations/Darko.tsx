import type { AnimationProps } from "../registry";
import { asset } from "../registry";
import { useTimeline } from "./shared";
import "./darko.css";

/** La dedica alla mamma, scratch del vinile, silenzio… 404, microfono che cade e bollino "parents not found". */
export default function Darko(props: AnimationProps) {
  useTimeline(props, 300, 4400);
  return (
    <div className="anim anim-darko">
      <div className="dk-stage">
        <span className="dk-spot" />
        <span className="vinyl dk-vinyl" />
        <div className="dk-lines">
          <p className="dk-line dk-line-1">Questo disco lo dedico…</p>
          <p className="dk-line dk-line-2">…a mia madre 🙏</p>
        </div>
        <p className="dk-who">…chi?</p>
        <p className="dk-404">
          <strong>404</strong>
          <span>madre non trovata</span>
        </p>
        <img className="dk-mic" src={asset("darko/mic.svg")} alt="" />
        <div className="dk-sticker">
          <span>Parental</span>
          <strong>Advisory</strong>
          <span>parents not found</span>
        </div>
      </div>
    </div>
  );
}
