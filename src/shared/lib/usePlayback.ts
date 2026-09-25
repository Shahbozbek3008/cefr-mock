import { useCallback, useEffect, useRef, useState } from 'react';

type PlaybackOptions = {
  autoPlay?: boolean;
  onEnd?: () => void;
};

const TICK_MS = 250;

export const usePlayback = (durationSec: number, { autoPlay = false, onEnd }: PlaybackOptions = {}) => {
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const positionRef = useRef(0);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  useEffect(() => {
    if (!playing) return;
    const anchor = Date.now() - positionRef.current * 1000;

    const interval = setInterval(() => {
      const next = Math.min(durationSec, (Date.now() - anchor) / 1000);
      positionRef.current = next;
      setPosition(next);
      if (next >= durationSec) {
        setPlaying(false);
        endRef.current?.();
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [playing, durationSec]);

  const toggle = useCallback(() => {
    if (positionRef.current >= durationSec) {
      positionRef.current = 0;
      setPosition(0);
    }
    setPlaying((value) => !value);
  }, [durationSec]);

  return { position, playing, progress: durationSec > 0 ? position / durationSec : 0, toggle };
};
