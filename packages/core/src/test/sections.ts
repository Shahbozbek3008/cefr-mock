import type { SectionKind } from './types';

export const sectionTitles: Record<SectionKind, string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};

export const sectionOrder: SectionKind[] = ['listening', 'reading', 'writing', 'speaking'];

export const tfngChoices = ['True', 'False', 'No Information'] as const;
