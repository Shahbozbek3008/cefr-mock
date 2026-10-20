import { Outlet, useParams } from 'react-router';
import { LeaveGuard } from '@/features/test-session/ui/leave-guard';
import { ROUTES } from '@/shared/config/routes';
import { LocalizedNavigate } from '@/shared/i18n/navigation';
import { isSkill } from '@/entities/test';

export default function TestSectionLayout() {
  const { section } = useParams();
  if (!isSkill(section)) return <LocalizedNavigate to={ROUTES.dashboard} />;

  return (
    <div className="flex h-dvh min-h-[640px] flex-col bg-bg-app">
      <LeaveGuard />
      <Outlet />
    </div>
  );
}
