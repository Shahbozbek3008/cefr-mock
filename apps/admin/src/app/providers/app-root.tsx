import { Outlet } from 'react-router';
import { AppProviders } from './app-providers';

export function AppRoot() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}
