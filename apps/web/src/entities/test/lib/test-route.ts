import { SKILLS, type Skill } from '@cefr/ui/lib/constants';

export const isSkill = (section: string | undefined): section is Skill => (SKILLS as readonly string[]).includes(section ?? '');

export const testName = (id: string) => `Mock Test #${id}`;
