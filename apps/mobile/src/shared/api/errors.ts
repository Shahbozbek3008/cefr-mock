import { ApiError, invokeFunction as coreInvoke, isNetworkFailure, requireUserId as coreRequireUserId } from '@cefr/core';
import type { TKey } from '../i18n';
import { isSupabaseConfigured, supabase } from './supabase';

export { ApiError, ensureOk, errorCode, isNetworkFailure, unwrap } from '@cefr/core';

export const requireUserId = () => coreRequireUserId(supabase);

export const invokeFunction = async <T>(name: string, body: Record<string, unknown>): Promise<T> => {
  if (!isSupabaseConfigured) throw new ApiError('not_configured');
  try {
    return await coreInvoke<T>(supabase, name, body);
  } catch (failure) {
    if (__DEV__ && failure instanceof ApiError) console.warn(`[${name}] ${failure.code}: ${failure.message}`);
    throw failure;
  }
};

export const failureReason = (error: unknown): TKey =>
  isNetworkFailure(error) ? 'common.checkInternet' : 'common.serverError';
