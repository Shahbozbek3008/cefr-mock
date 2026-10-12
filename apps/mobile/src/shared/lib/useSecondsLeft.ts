import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { secondsUntil } from './time';

export const useSecondsLeft = (endsAt: number, onExpire?: () => void) => {
  const [left, setLeft] = useState(() => secondsUntil(endsAt));
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    let fired = false;

    const tick = () => {
      const next = secondsUntil(endsAt);
      setLeft(next);
      if (next === 0 && !fired) {
        fired = true;
        expireRef.current?.();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') tick();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [endsAt]);

  return left;
};
