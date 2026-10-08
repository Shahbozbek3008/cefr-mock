import { useAttemptStore } from '@/entities/attempt';
import { fetchProfile, updateProfile, useUserStore } from '@/entities/user/model';
import type { Profile, ProfilePatch } from '@/entities/user/model';
import type { TKey } from '@/shared/i18n';
import { ensureOk, errorCode, invokeFunction, supabase } from '@/shared/api';
import { queryClient } from '@/shared/lib';
import { PHONE_PREFIX } from './phone';

type CodeRequest = { ok: true; resendIn: number };
type SessionTokens = { access_token: string; refresh_token: string };

const authErrors: Record<string, TKey> = {
  invalid_code: 'auth.errors.invalid_code',
  code_expired: 'auth.errors.code_expired',
  too_many_attempts: 'auth.errors.too_many_attempts',
  too_many_requests: 'auth.errors.too_many_requests',
  sms_unavailable: 'auth.errors.sms_unavailable',
  invalid_phone: 'auth.errors.invalid_phone',
  network_error: 'auth.errors.network_error',
  function_not_found: 'auth.errors.function_not_found',
  server_error: 'auth.errors.server_error',
  not_configured: 'auth.errors.not_configured',
};

export const authErrorKey = (error: unknown): TKey => authErrors[errorCode(error)] ?? 'auth.errors.unknown';

const toPhone = (digits: string) => `${PHONE_PREFIX}${digits}`;

export const requestCode = (digits: string) =>
  invokeFunction<CodeRequest>('phone-auth', { action: 'request', phone: toPhone(digits) });

const localOnboarding = (profile: Profile): ProfilePatch => {
  const local = useUserStore.getState();
  const patch: ProfilePatch = {};
  if (!profile.targetLevel && local.targetLevel) patch.targetLevel = local.targetLevel;
  if (!profile.examDate && local.examDate) patch.examDate = local.examDate;
  if (!profile.dailyMinutes && local.dailyMinutes) patch.dailyMinutes = local.dailyMinutes;
  return patch;
};

export const loadAccount = async () => {
  const profile = await fetchProfile();
  const patch = localOnboarding(profile);
  await updateProfile(patch);
  const merged = { ...profile, ...patch };
  useUserStore.getState().applyProfile(merged);
  return { needsName: merged.firstName === '' };
};

export const verifyCode = async (digits: string, code: string) => {
  const tokens = await invokeFunction<SessionTokens>('phone-auth', { action: 'verify', phone: toPhone(digits), code });
  ensureOk(await supabase.auth.setSession(tokens));
  return loadAccount();
};

export const clearSession = () => {
  useAttemptStore.getState().reset();
  useUserStore.getState().signOut();
  queryClient.clear();
};

export const signOut = async () => {
  await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);
  clearSession();
};
