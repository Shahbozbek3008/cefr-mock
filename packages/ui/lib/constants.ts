import { BookOpen, Headphones, Mic, PenLine, type LucideIcon } from 'lucide-react';

export const MAX_SCORE = 75;

export const SKILLS = ['listening', 'reading', 'writing', 'speaking'] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_ICONS: Record<Skill, LucideIcon> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

export const LEVELS = [
  { code: 'B1', min: 38, max: 50 },
  { code: 'B2', min: 51, max: 64 },
  { code: 'C1', min: 65, max: 75 },
] as const;
export type LevelCode = (typeof LEVELS)[number]['code'];

export const SCALE_SEGMENTS = [38, 13, 14, 10] as const;
