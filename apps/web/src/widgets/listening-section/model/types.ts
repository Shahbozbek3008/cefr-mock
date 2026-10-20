import type { ReactNode } from 'react';
import type { AttemptMode, Question } from '@cefr/core';

export type PlayerFrameProps = {
  mode: AttemptMode;
  label: string;
  active: boolean;
  position: number;
  duration: number;
  action?: ReactNode;
};

export type PlayerProps = { src: string; durationSec: number; mode: AttemptMode; onStart: () => void; onEnded: () => void };

export type AudioPlayerProps = PlayerProps & { played: boolean };

export type ListeningQuestionsProps = { questions: Question[]; currentId: string; onFocus: (id: string) => void; register: (id: string, el: HTMLElement | null) => void };
