import { CircleGauge, LucideIcon, Mic, RotateCcw, ShieldCheck, Sparkles, WifiOff } from 'lucide-react-native';
import type { TKey } from '@/shared/i18n';

export type FaqTopic = {
  id: string;
  icon: LucideIcon;
  question: TKey;
  answer: TKey;
};

export const faqTopics: FaqTopic[] = [
  { id: 'modes', icon: ShieldCheck, question: 'help.faq.modesQ', answer: 'help.faq.modesA' },
  { id: 'score', icon: CircleGauge, question: 'help.faq.scoreQ', answer: 'help.faq.scoreA' },
  { id: 'ai', icon: Sparkles, question: 'help.faq.aiQ', answer: 'help.faq.aiA' },
  { id: 'mic', icon: Mic, question: 'help.faq.micQ', answer: 'help.faq.micA' },
  { id: 'offline', icon: WifiOff, question: 'help.faq.offlineQ', answer: 'help.faq.offlineA' },
  { id: 'retake', icon: RotateCcw, question: 'help.faq.retakeQ', answer: 'help.faq.retakeA' },
];
