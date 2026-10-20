import { Outlet } from 'react-router';
import { WebPushSync } from '@/features/web-push/ui/web-push-sync';

export default function FocusLayout() {
  return (
    <div className="min-h-dvh bg-bg-app">
      <WebPushSync />
      <Outlet />
    </div>
  );
}
