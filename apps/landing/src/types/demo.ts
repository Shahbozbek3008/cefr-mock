import type { Skill } from '@cefr/ui/lib/constants';

export type SkillScore = { skill: Skill; score: number; delta: number; weak?: boolean };
