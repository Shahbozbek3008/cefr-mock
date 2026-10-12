import { DoorOpen, Dumbbell, Headphones, Mic, MicOff, MonitorX, RotateCcw, ShieldCheck, Timer, Wifi, type LucideIcon } from 'lucide-react';
import type { AttemptMode } from '@cefr/core';
import type { MicIssue, RuleKey } from '@/types/exam';

export const END_TOLERANCE_SEC = 0.5;

export const EXAM_ROUNDS = 2;

export const CATALOG_SKELETON_CARDS = 6;

export const WARNING_SEC = 300;

export const WAVE_BARS = 24;

export const ISSUE_ICONS: Record<MicIssue, LucideIcon> = { denied: MicOff, missing: Headphones, busy: Mic, unsupported: MonitorX };

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

export const METER_MS = 120;

export const MIME_TYPES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'];

export const COUNTDOWN_TICK_MS = 250;

export const AUTOSAVE_MS = 2000;

export const SAVE_STATUS_TICK_MS = 5000;
