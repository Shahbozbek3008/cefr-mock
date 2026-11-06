import { useTranslations } from 'use-intl';
import { Tag } from '@cefr/ui/components/tag';
import { errorsOf, useIssueText, type Issue } from '@/entities/test';
import { Notice } from '@/shared/ui';

const MAX_AUTO_OPEN_ERRORS = 8;

function IssueItem({ issue }: { issue: Issue }) {
  const { where, message } = useIssueText();
  const isError = issue.level === 'error';
  return (
    <li className="flex gap-2 py-1">
      <span className={isError ? 'text-error-text' : 'text-warning-text'}>{isError ? '●' : '○'}</span>
      <span className="text-ink-2">{where(issue)}:</span>
      <span className="text-ink">{message(issue)}</span>
    </li>
  );
}

export function IssuesPanel({ issues }: { issues: Issue[] }) {
  const t = useTranslations('issues');
  const errors = errorsOf(issues);
  const warnings = issues.filter((issue) => issue.level === 'warning');

  if (issues.length === 0) return <Notice tone="success">{t('ok')}</Notice>;

  return (
    <details className="rounded-card-sm bg-surface shadow-e1" open={errors.length > 0 && errors.length <= MAX_AUTO_OPEN_ERRORS}>
      <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-4 py-3 text-sm font-medium text-ink">
        {t('title')}
        {errors.length > 0 && <Tag tone="error">{t('errors', { count: errors.length })}</Tag>}
        {warnings.length > 0 && <Tag tone="warning">{t('warnings', { count: warnings.length })}</Tag>}
        <span className="text-xs font-normal text-ink-3">{t('hint')}</span>
      </summary>
      <ul className="max-h-64 overflow-auto border-t border-divider px-4 py-2 text-sm">
        {[...errors, ...warnings].map((issue, i) => (
          <IssueItem key={i} issue={issue} />
        ))}
      </ul>
    </details>
  );
}
