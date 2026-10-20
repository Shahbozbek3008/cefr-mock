import type { SkillScore } from '@/entities/result';

export type SkillStatCardProps = SkillScore & { variant?: 'compact' | 'detailed'; href?: string };
