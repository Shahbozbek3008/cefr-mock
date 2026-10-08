import {
  beginAttempt as coreBeginAttempt,
  flushAttempt as coreFlushAttempt,
  useAttemptAutosave as coreUseAttemptAutosave,
  useAttemptSession as coreUseAttemptSession,
} from '@cefr/core';
import { useAttemptStore } from '@/entities/attempt';
import type { AttemptMode } from '@/entities/attempt';
import { supabase } from '@/shared/api';

export const beginAttempt = (testId: string, mode: AttemptMode = 'practice') =>
  coreBeginAttempt(supabase, useAttemptStore, testId, mode);

export const flushAttempt = () => coreFlushAttempt(supabase, useAttemptStore);

export const useAttemptSession = (testId: string) => coreUseAttemptSession(useAttemptStore, testId);

export const useAttemptAutosave = (active: boolean) => coreUseAttemptAutosave(useAttemptStore, active);
