import type { ReactNode } from 'react';
import { initLocale } from '@cefr/ui/i18n/locale';
import { assertSkill, type TestSectionParams } from '@/lib/test-route';
import { LeaveGuard } from '@/components/test/leave-guard';

export default async function TestSectionLayout({ children, params }: { children: ReactNode; params: TestSectionParams }) {
  await initLocale(params);
  assertSkill((await params).section);
  return (
    <div className="flex h-dvh min-h-[640px] flex-col bg-bg-app">
      <LeaveGuard />
      {children}
    </div>
  );
}
