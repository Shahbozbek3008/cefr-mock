import type { MarkKind } from '@cefr/ui/components/mark';
import type { SkillScore } from '@/types/dashboard';

export type AnnotatedSegment = string | { text: string; mark: MarkKind | 'filler' };

export type SkillStatCardProps = SkillScore & { variant?: 'compact' | 'detailed'; href?: string };

export type ReviewTab = 'listening' | 'reading';
