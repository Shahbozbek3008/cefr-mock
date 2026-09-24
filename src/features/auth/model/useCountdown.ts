import { useCallback, useEffect, useRef, useState } from 'react';

export const useCountdown = (seconds: number) => {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    setRemaining(seconds);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clear();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clear, seconds]);

  useEffect(() => {
    start();
    return clear;
  }, [start, clear]);

  return { remaining, restart: start, finished: remaining === 0 };
};
