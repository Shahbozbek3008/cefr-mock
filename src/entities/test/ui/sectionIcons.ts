import { BookOpen, Headphones, LucideIcon, Mic, PenLine } from 'lucide-react-native';
import type { SectionKind } from '../model/types';

export const sectionIcons: Record<SectionKind, LucideIcon> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

export const sectionTitles: Record<SectionKind, string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};

export const sectionOrder: SectionKind[] = ['listening', 'reading', 'writing', 'speaking'];
