'use client';

import { useEffect, useRef, useState } from 'react';
import { secondsUntil } from '@cefr/core';

const TICK_MS = 250;

export const useSecondsLeft = (endsAt: number | undefined, onExpire?: () => void) => {
  const [left, setLeft] = useState(() => (endsAt ? secondsUntil(endsAt) : 0));
  const expireRef = useRef(onExpire);
  const firedRef = useRef(false);

  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!endsAt) return;
    firedRef.current = false;
    const tick = () => {
      const next = secondsUntil(endsAt);
      setLeft(next);
      if (next <= 0 && !firedRef.current) {
        firedRef.current = true;
        expireRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [endsAt]);

  return left;
};
