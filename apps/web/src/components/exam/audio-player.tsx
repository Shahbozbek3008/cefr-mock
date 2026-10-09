'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Lock, Play, RotateCcw } from 'lucide-react';
import { formatClock, type AttemptMode } from '@cefr/core';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { Waveform } from '@/components/ui/waveform';

const END_TOLERANCE_SEC = 0.5;
const EXAM_ROUNDS = 2;

type FrameProps = {
  mode: AttemptMode;
  label: string;
  active: boolean;
  position: number;
  duration: number;
  action?: ReactNode;
};

function Frame({ mode, label, active, position, duration, action }: FrameProps) {
  const t = useTranslations('exam.listening');
  return (
    <div className="flex flex-col gap-4 rounded-card-sm bg-surface p-4 sm:p-5 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_1px_2px_rgba(20,22,30,.04)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={cn('flex items-center gap-2 text-[13px] font-medium', active ? 'text-green-text' : 'text-ink-2')}>
          <span className={cn('relative grid size-2 place-items-center')}>
            {active && <span className="absolute size-2 animate-ping-soft rounded-full bg-blue" />}
            <span className={cn('size-2 rounded-full', active ? 'bg-blue' : 'bg-ink-4')} />
          </span>
          {label}
        </span>
        <span className="flex items-center gap-1 rounded-[7px] bg-surface-sunken px-2 py-0.5 text-[11px] font-medium text-ink-2">
          {mode === 'exam' && <Icon as={Lock} size={11} strokeWidth={2.2} />}
          {t(mode === 'exam' ? 'realMode' : 'practiceMode')}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="shrink-0 font-mono text-sm tabular-nums">
          {formatClock(position)} <span className="text-ink-3">/ {formatClock(duration)}</span>
        </span>
        <Waveform progress={duration > 0 ? position / duration : 0} className="h-8" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="text-xs text-ink-2">{t(mode === 'exam' ? 'onceNote' : 'practiceNote')}</span>
        {action}
      </div>
    </div>
  );
}

type PlayerProps = { src: string; durationSec: number; mode: AttemptMode; onStart: () => void; onEnded: () => void };

function Player({ src, durationSec, mode, onStart, onEnded }: PlayerProps) {
  const t = useTranslations('exam');
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);
  const startRef = useRef(onStart);
  const endedRef = useRef(onEnded);
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(1);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(durationSec);

  useEffect(() => {
    startRef.current = onStart;
    endedRef.current = onEnded;
  }, [onStart, onEnded]);

  const play = () => {
    audioRef.current
      ?.play()
      .then(() => setBlocked(false))
      .catch(() => setBlocked(true));
  };

  const onLoaded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setLoaded(true);
    if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    if (startedRef.current) return;
    startedRef.current = true;
    startRef.current();
    play();
  };

  const onFinished = () => {
    const lastRound = mode !== 'exam' || round === EXAM_ROUNDS;
    if (lastRound) {
      setFinished(true);
      endedRef.current();
      return;
    }
    setRound((current) => current + 1);
    if (audioRef.current) audioRef.current.currentTime = 0;
    play();
  };

  const replay = () => {
    if (audioRef.current) audioRef.current.currentTime = 0;
    setFinished(false);
    play();
  };

  const label = !loaded ? t('common.loading') : finished ? t('listening.ended') : t('listening.playing');
  const roundLabel = mode === 'exam' && !finished ? ` · ${t('listening.round', { count: round })}` : '';
  const ended = finished || position >= duration - END_TOLERANCE_SEC;

  const action = blocked ? (
    <button type="button" onClick={play} className="flex items-center gap-1.5 text-[13px] font-medium text-green-text hover:text-green-hover">
      <Icon as={Play} size={13} fill="currentColor" strokeWidth={0} />
      {t('common.start')}
    </button>
  ) : mode === 'practice' && finished ? (
    <button type="button" onClick={replay} className="flex items-center gap-1.5 text-[13px] font-medium text-green-text hover:text-green-hover">
      <Icon as={RotateCcw} size={14} strokeWidth={1.8} />
      {t('listening.replay')}
    </button>
  ) : undefined;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onLoadedMetadata={onLoaded}
        onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
        onEnded={onFinished}
      />
      <Frame mode={mode} label={`${label}${roundLabel}`} active={loaded && !ended && !blocked} position={position} duration={duration} action={action} />
    </>
  );
}

type AudioPlayerProps = PlayerProps & { played: boolean };

export function AudioPlayer({ played, ...props }: AudioPlayerProps) {
  const t = useTranslations('exam.listening');
  const [playedBefore] = useState(played);
  if (props.mode === 'exam' && playedBefore) {
    return <Frame mode="exam" label={t('ended')} active={false} position={props.durationSec} duration={props.durationSec} />;
  }
  return <Player {...props} />;
}
