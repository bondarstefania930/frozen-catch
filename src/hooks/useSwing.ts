import {useCallback, useRef} from 'react';
import {swingAngle} from '../game/hook';

/**
 * The pendulum clock. It only advances while the round is running, so a pause
 * freezes the swing exactly where it was instead of jumping on resume.
 */
export function useSwing(getPeriodMs: () => number) {
  const clock = useRef(0);
  const frozen = useRef<number | null>(null);

  const advance = useCallback((dtMs: number) => {
    if (frozen.current === null) {
      clock.current += dtMs;
    }
  }, []);

  const angle = useCallback((): number => {
    if (frozen.current !== null) {
      return frozen.current;
    }
    return swingAngle(clock.current, getPeriodMs());
  }, [getPeriodMs]);

  const freeze = useCallback((): number => {
    const a = swingAngle(clock.current, getPeriodMs());
    frozen.current = a;
    return a;
  }, [getPeriodMs]);

  const release = useCallback(() => {
    frozen.current = null;
  }, []);

  const reset = useCallback(() => {
    clock.current = 0;
    frozen.current = null;
  }, []);

  return {advance, angle, freeze, release, reset};
}

export default useSwing;
