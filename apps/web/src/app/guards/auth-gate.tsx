import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { LocalizedNavigate } from '@/shared/i18n/navigation';
import { useSessionStatus } from '@/entities/session';
import type { AuthGateProps } from './types';

function AuthGate({ allow, redirectTo }: AuthGateProps) {
  const status = useSessionStatus();
  const { pathname } = useLocation();
  const [checked, setChecked] = useState<{ pathname: string; allowed: boolean } | null>(null);

  if (status !== 'loading' && checked?.pathname !== pathname) setChecked({ pathname, allowed: status === allow });
  if (checked?.pathname !== pathname) return null;

  return checked.allowed ? <Outlet /> : <LocalizedNavigate to={redirectTo} />;
}

export function RequireAuth() {
  return <AuthGate allow="authenticated" redirectTo={ROUTES.login} />;
}

export function GuestOnly() {
  return <AuthGate allow="anonymous" redirectTo={ROUTES.dashboard} />;
}
