import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <main className="min-h-dvh bg-bg">
      <Outlet />
    </main>
  );
}
