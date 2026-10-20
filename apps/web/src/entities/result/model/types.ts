import type { Skill } from '@cefr/ui/lib/constants';

export type SkillScore = { skill: Skill; score: number; delta: number; weak?: boolean };

export type SkillsCardProps = { skills: readonly SkillScore[]; title: string; subtitle: string };
