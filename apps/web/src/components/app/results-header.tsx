import type { ReactNode } from 'react';
import { LATEST_RESULT } from '@/lib/mock/results';
import { Breadcrumb } from '@/components/ui/typography';
import { PageHeader } from '@/components/layout/page-header';

export function ResultsHeader({ crumb, title, actions }: { crumb: string; title: string; actions?: ReactNode }) {
  return <PageHeader meta={<Breadcrumb items={[LATEST_RESULT.testName, crumb]} />} title={title} actions={actions} />;
}
