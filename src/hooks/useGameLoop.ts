import {useEffect, useRef} from 'react';

type TickFn = (dtMs: number, elapsedMs: number) => void;

/**
 * requestAnimationFrame ticker. Starts when `active` turns true, stops on
 * pause and is cancelled in the effect cleanup, so nothing keeps running
 * after the screen is gone.
 */
export function useGameLoop(active: boolean, onTick: TickFn): void {
  const cb = useRef<TickFn>(onTick);
  cb.current = onTick;

  const elapsed = useRef(0);

  useEffect(() => {
    if (!active) {
      return;
    }
    let raf = 0;
    let last = Date.now();
    let alive = true;

    const step = () => {
      if (!alive) {
        return;
      }
      const now = Date.now();
      const dt = Math.min(64, now - last);
      last = now;
      elapsed.current += dt;
      try {
        cb.current(dt, elapsed.current);
      } catch (e) {
        // a tick must never take the whole app down
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      alive = false;
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [active]);
}

export default useGameLoop;
