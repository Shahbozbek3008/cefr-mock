import {
  beginAttempt as coreBeginAttempt,
  flushAttempt as coreFlushAttempt,
  useAttemptAutosave as coreUseAttemptAutosave,
  useAttemptSession as coreUseAttemptSession,
} from '@cefr/core';
import { useAttemptStore } from '@/entities/attempt';
import type { AttemptScope } from '@cefr/core';
import type { AttemptMode } from '@/entities/attempt';
import { supabase } from '@/shared/api';

export const beginAttempt = (testId: string, mode: AttemptMode = 'practice', scope: AttemptScope = 'full') =>
  coreBeginAttempt(supabase, useAttemptStore, testId, mode, scope);

export const flushAttempt = () => coreFlushAttempt(supabase, useAttemptStore);

export const useAttemptSession = (testId: string, scope: AttemptScope = 'full') =>
  coreUseAttemptSession(useAttemptStore, testId, scope);

export const useAttemptAutosave = (active: boolean) => coreUseAttemptAutosave(useAttemptStore, active);
