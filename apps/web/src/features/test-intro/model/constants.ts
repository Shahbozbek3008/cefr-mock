import { DoorOpen, Dumbbell, Headphones, type LucideIcon, RotateCcw, ShieldCheck, Timer, Wifi } from 'lucide-react';
import type { AttemptMode } from '@cefr/core';
import type { RuleKey } from './types';

export const INTRO_STAT_LABELS = ['hours', 'sectionsCount', 'score'] as const;

export const ATTEMPT_MODES: { mode: AttemptMode; icon: LucideIcon }[] = [
  { mode: 'exam', icon: ShieldCheck },
  { mode: 'practice', icon: Dumbbell },
];

export const ATTEMPT_RULES: Record<AttemptMode, { icon: LucideIcon; key: RuleKey }[]> = {
  exam: [
    { icon: Headphones, key: 'ruleAudio' },
    { icon: DoorOpen, key: 'ruleNoExit' },
    { icon: Timer, key: 'ruleTimer' },
    { icon: Wifi, key: 'ruleOffline' },
  ],
  practice: [
    { icon: RotateCcw, key: 'rulePracticeReplay' },
    { icon: DoorOpen, key: 'rulePracticeResume' },
    { icon: Wifi, key: 'ruleOffline' },
  ],
};
