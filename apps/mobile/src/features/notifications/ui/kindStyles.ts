import { CalendarClock, Clock, FileText, Sparkles, Trophy } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { NotificationKind } from '@/entities/notification';
import type { Colors } from '@/shared/theme';

type KindStyle = {
  icon: LucideIcon;
  tone: (colors: Colors) => { bg: string; fg: string };
};

export const kindStyles: Record<NotificationKind, KindStyle> = {
  result: { icon: Trophy, tone: (colors) => ({ bg: colors.success.bg, fg: colors.success.text }) },
  aiReview: { icon: Sparkles, tone: (colors) => ({ bg: colors.selectedBg, fg: colors.selectedText }) },
  reminder: { icon: Clock, tone: (colors) => ({ bg: colors.warning.bg, fg: colors.warning.text }) },
  newTest: { icon: FileText, tone: (colors) => ({ bg: colors.surfaceSubtle, fg: colors.textStrong }) },
  exam: { icon: CalendarClock, tone: (colors) => ({ bg: colors.bg, fg: colors.data }) },
};
