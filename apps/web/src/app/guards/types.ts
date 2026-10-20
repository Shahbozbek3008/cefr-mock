import type { SessionStatus } from '@/entities/session';

export interface AuthGateProps {
  allow: Exclude<SessionStatus, 'loading'>;
  redirectTo: string;
}
