import { AudioLines, ChartColumn, ChartLine, ClipboardCheck, House, Layers, PenLine, Target, TrendingUp, UserRound } from 'lucide-react';
import { LEVELS } from '@cefr/ui/lib/constants';

export const HERO_STUDENTS = 12_000;

export const HERO_AVATARS = [
  { letter: 'D', hue: 135 },
  { letter: 'J', hue: 258 },
  { letter: 'M', hue: 75 },
  { letter: 'S', hue: 190 },
  { letter: 'N', hue: 28 },
] as const;

export const STATS = [
  { key: 'students', value: 12_000, prefix: '', suffix: '+', grouped: true },
  { key: 'tests', value: 48_000, prefix: '', suffix: '+', grouped: true },
  { key: 'speed', value: 2, prefix: '', unit: 'speedUnit', grouped: false },
  { key: 'growth', value: 14, prefix: '+', unit: 'growthUnit', grouped: false },
] as const;

export const PREVIEW_NAV = [
  { key: 'home', icon: House },
  { key: 'tests', icon: Layers },
  { key: 'progress', icon: ChartLine },
  { key: 'profile', icon: UserRound },
] as const;

export const LEVEL_THRESHOLDS = LEVELS.slice(1).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));

export const AI_POINTS = [
  { key: 'criteria', icon: ChartColumn },
  { key: 'inline', icon: PenLine },
  { key: 'transcript', icon: AudioLines },
] as const;

export const STEPS = [
  { key: 'goal', icon: Target },
  { key: 'test', icon: ClipboardCheck },
  { key: 'review', icon: TrendingUp },
] as const;

export const TESTIMONIALS = [
  { key: 't1', from: 'B1', to: 'B2', score: 58, hue: 135 },
  { key: 't2', from: 'B1', to: 'B2', score: 55, hue: 258 },
  { key: 't3', from: 'B1', to: 'B2', score: 59, hue: 75 },
  { key: 't4', from: 'B2', to: 'C1', score: 66, hue: 190 },
  { key: 't5', from: 'B1', to: 'B2', score: 53, hue: 28 },
  { key: 't6', from: 'B2', to: 'C1', score: 68, hue: 300 },
] as const;

export const ROTATED_TESTIMONIALS = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)];

export const FAQ_KEYS = ['format', 'accuracy', 'free', 'offline'] as const;

export const CTA_ORBS = [
  { className: '-top-1/3 -right-[10%] size-[520px] bg-[oklch(0.7_0.14_200/.55)]', duration: '16s' },
  { className: '-bottom-1/2 left-[20%] size-[460px] bg-[oklch(0.7_0.15_140/.45)]', duration: '22s' },
] as const;
