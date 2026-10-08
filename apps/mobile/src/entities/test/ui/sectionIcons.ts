import { BookOpen, Headphones, LucideIcon, Mic, PenLine } from 'lucide-react-native';
import type { TKey } from '@/shared/i18n';
import type { SectionKind } from '../model/types';

export const sectionIcons: Record<SectionKind, LucideIcon> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

export { sectionOrder, sectionTitles } from '@cefr/core';

export const sectionDetailKeys = {
  listening: 'sections.listeningDetail',
  reading: 'sections.readingDetail',
  writing: 'sections.writingDetail',
  speaking: 'sections.speakingDetail',
} as const satisfies Record<SectionKind, TKey>;
