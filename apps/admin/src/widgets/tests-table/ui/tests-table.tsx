import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useFormatter, useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { IconButton } from '@cefr/ui/components/icon-button';
import { TestStatusBadges, type TestRow } from '@/entities/test';
import { useDeleteTest } from '@/features/delete-test';
import { useTogglePublish } from '@/features/publish-test';
import { ErrorNotice, Panel } from '@/shared/ui';

type TestActionsProps = {
  test: TestRow;
  publish: ReturnType<typeof useTogglePublish>;
  remove: ReturnType<typeof useDeleteTest>;
};

function TestActions({ test, publish, remove }: TestActionsProps) {
  const t = useTranslations('tests');
  const navigate = useNavigate();
  const published = test.published_at !== null;

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button variant="ghost" size="xs" icon={<Pencil size={14} />} onClick={() => navigate(`/tests/${test.id}`)}>
        {t('edit')}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        icon={published ? <EyeOff size={14} /> : <Eye size={14} />}
        loading={publish.pendingId === test.id}
        onClick={() => publish.toggle(test)}
      >
        {published ? t('hide') : t('publish')}
      </Button>
      <IconButton
        size="xs"
        icon={Trash2}
        label={t('delete')}
        className="hover:text-error-text"
        disabled={remove.pendingId === test.id}
        onClick={() => remove.remove(test)}
      />
    </div>
  );
}

export function TestsTable({ tests }: { tests: TestRow[] }) {
  const t = useTranslations('tests');
  const format = useFormatter();
  const publish = useTogglePublish();
  const remove = useDeleteTest();

  const formatLabel = (test: TestRow) => format.dateTime(new Date(test.format_year, test.format_month, 1), { month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col gap-4">
      <ErrorNotice error={publish.error ?? remove.error} />
      <Panel>
        {tests.length === 0 ? (
          <p className="text-sm text-ink-3">{t('empty')}</p>
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-divider text-left text-xs text-ink-3">
                  <th className="px-5 py-3 font-medium">{t('columns.number')}</th>
                  <th className="px-2 py-3 font-medium">{t('columns.title')}</th>
                  <th className="px-2 py-3 font-medium">{t('columns.format')}</th>
                  <th className="px-2 py-3 font-medium">{t('columns.status')}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="border-b border-divider last:border-0">
                    <td className="px-5 py-3 font-mono text-ink-2">{test.number}</td>
                    <td className="px-2 py-3">
                      <Link to={`/tests/${test.id}`} className="font-medium text-ink hover:underline">
                        {test.title}
                      </Link>
                      <div className="text-xs text-ink-3">{test.id}</div>
                    </td>
                    <td className="px-2 py-3 text-ink-2">{formatLabel(test)}</td>
                    <td className="px-2 py-3">
                      <TestStatusBadges published={test.published_at !== null} isPro={test.is_pro} isNew={test.is_new} />
                    </td>
                    <td className="px-5 py-3">
                      <TestActions test={test} publish={publish} remove={remove} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
