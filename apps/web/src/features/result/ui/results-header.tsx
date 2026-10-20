import type { ReactNode } from 'react';
import { LATEST_RESULT } from '@/shared/mock/results';
import { Breadcrumb } from '@cefr/ui/components/typography';
import { PageHeader } from '@/shared/ui/page-header';

export function ResultsHeader({ crumb, title, actions }: { crumb: string; title: string; actions?: ReactNode }) {
  return <PageHeader meta={<Breadcrumb items={[LATEST_RESULT.testName, crumb]} />} title={title} actions={actions} />;
}
