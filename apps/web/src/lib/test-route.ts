import { notFound } from 'next/navigation';
import { SKILLS, type Skill } from '@/lib/constants';

export type TestSectionParams = Promise<{ locale: string; id: string; section: string }>;

export function assertSkill(section: string): Skill {
  if (!(SKILLS as readonly string[]).includes(section)) notFound();
  return section as Skill;
}

export const testName = (id: string) => `Mock Test #${id}`;
