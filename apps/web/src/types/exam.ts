import type { ReactNode } from 'react';
import type { AttemptMode, Choice, McqQuestion, Question, SectionKind } from '@cefr/core';
import type { useSessionControls } from '@/lib/exam/session';

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

export type ExamHeaderProps = {
  title: string;
  subtitle?: string;
  section: SectionKind;
  timer: ReactNode;
  onExit: () => void;
  onFinish: () => void;
};

export type ListeningQuestionsProps = { questions: Question[]; currentId: string; onFocus: (id: string) => void; register: (id: string, el: HTMLElement | null) => void };

export type GapInputProps = { questionId: string; number: number; variant?: 'inline' | 'field'; onFocus?: (id: string) => void };

export type McqOptionsProps = { question: McqQuestion; onAnswer?: (id: string) => void };

export type MatchChipsProps = { questionId: string; choices: Choice[]; onAnswer?: (id: string) => void };

export type QuestionNavigatorProps = { questions: Question[]; currentId: string; onSelect: (id: string) => void; className?: string };

export type ReadingPane = 'text' | 'questions';

export type SessionDialogsProps = { controls: SessionControls; onReview?: (number: number) => void };

export type RuleKey = 'ruleAudio' | 'ruleNoExit' | 'ruleTimer' | 'ruleOffline' | 'rulePracticeReplay' | 'rulePracticeResume';

export type RecorderPhase = 'pending' | 'prep' | 'recording' | 'done' | 'denied';

export type MicIssue = 'denied' | 'missing' | 'busy' | 'unsupported';

export type FailureKey = 'checkInternet' | 'serverError';

export type SessionControls = ReturnType<typeof useSessionControls>;

export type TestSectionParams = Promise<{ locale: string; id: string; section: string }>;
