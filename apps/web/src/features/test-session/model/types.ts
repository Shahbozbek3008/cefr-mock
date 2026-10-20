import type { ReactNode } from 'react';
import type { SectionKind } from '@cefr/core';
import type { useSessionControls } from './session';

export type ExamHeaderProps = {
  title: string;
  subtitle?: string;
  section: SectionKind;
  timer: ReactNode;
  onExit: () => void;
  onFinish: () => void;
};

export type SessionDialogsProps = { controls: SessionControls; onReview?: (number: number) => void };

export type SessionControls = ReturnType<typeof useSessionControls>;
