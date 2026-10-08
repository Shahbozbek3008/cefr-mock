import {
  fetchActiveAttempt as coreFetchActiveAttempt,
  openAttempt as coreOpenAttempt,
  saveAttempt as coreSaveAttempt,
  submitAttempt as coreSubmitAttempt,
} from '@cefr/core';
import type { AttemptMode, AttemptSnapshot } from '@cefr/core';
import { supabase } from '@/shared/api';

export const fetchActiveAttempt = (testId: string) => coreFetchActiveAttempt(supabase, testId);

export const openAttempt = (testId: string, mode: AttemptMode) => coreOpenAttempt(supabase, testId, mode);

export const saveAttempt = (snapshot: AttemptSnapshot) => coreSaveAttempt(supabase, snapshot);

export const submitAttempt = (attemptId: string) => coreSubmitAttempt(supabase, attemptId);
