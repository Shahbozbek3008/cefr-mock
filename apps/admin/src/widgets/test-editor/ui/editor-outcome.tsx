import { useTranslations } from 'use-intl';
import { ErrorNotice, Notice } from '@/shared/ui';
import type { EditorOutcome } from '../model/use-test-editor';

export function EditorOutcomeNotice({ outcome }: { outcome: EditorOutcome | null }) {
  const t = useTranslations('editor.outcome');
  if (!outcome) return null;
  if (outcome.kind === 'error') return <ErrorNotice error={outcome.error} />;
  return <Notice tone="success">{t(outcome.message)}</Notice>;
}
