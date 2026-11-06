import { Navigate, Outlet } from 'react-router';
import { Spinner } from '@cefr/ui/components/spinner';
import { AccessDenied, useAuth } from '@/features/auth';

export function RequireAdmin() {
  const auth = useAuth();

  if (auth.status === 'loading') {
    return (
      <div className="grid min-h-dvh place-items-center text-ink-3">
        <Spinner size={24} />
      </div>
    );
  }
  if (auth.status === 'guest') return <Navigate to="/login" replace />;
  if (auth.status === 'denied') return <AccessDenied session={auth.session} />;
  return <Outlet />;
}
