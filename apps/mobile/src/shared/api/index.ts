export { isSupabaseConfigured, supabase } from './supabase';
export {
  ApiError,
  ensureOk,
  errorCode,
  failureReason,
  invokeFunction,
  isNetworkFailure,
  requireUserId,
  unwrap,
} from './errors';
export type { Database, Json, Tables } from './database';
