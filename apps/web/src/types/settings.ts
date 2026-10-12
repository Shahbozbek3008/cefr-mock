import type { ReactNode } from 'react';

export type SaveState = 'idle' | 'saved' | 'failed';

export type SettingsConfirm = 'signOut' | 'reset' | null;

export type SettingsSection = { key: string; label: string; content: ReactNode };
