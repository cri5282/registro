import { useRef, type MouseEvent, type PointerEvent } from "react";

/** Gestori da spalmare su un elemento: chiamano onLongPress dopo `ms` di pressione ferma. */
export function useLongPress(onLongPress: () => void, ms = 700) {
  const timer = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  function cancel() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    origin.current = null;
  }

  return {
    onPointerDown(event: PointerEvent) {
      cancel();
      origin.current = { x: event.clientX, y: event.clientY };
      timer.current = window.setTimeout(() => {
        timer.current = null;
        navigator.vibrate?.(12);
        onLongPress();
      }, ms);
    },
    onPointerMove(event: PointerEvent) {
      const start = origin.current;
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) cancel();
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu(event: MouseEvent) {
      event.preventDefault();
    },
  };
}
