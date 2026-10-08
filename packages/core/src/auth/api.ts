import type { CefrClient } from '../api/client';
import { ensureOk, invokeFunction } from '../api/errors';
import { PHONE_PREFIX } from './phone';

export type CodeRequest = { ok: true; resendIn: number };

type SessionTokens = { access_token: string; refresh_token: string };

export const AUTH_ERROR_CODES = [
  'invalid_code',
  'code_expired',
  'too_many_attempts',
  'too_many_requests',
  'sms_unavailable',
  'invalid_phone',
  'network_error',
  'function_not_found',
  'server_error',
  'not_configured',
] as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];

const toPhone = (digits: string) => `${PHONE_PREFIX}${digits}`;

export const requestCode = (client: CefrClient, digits: string) =>
  invokeFunction<CodeRequest>(client, 'phone-auth', { action: 'request', phone: toPhone(digits) });

export const verifyCode = async (client: CefrClient, digits: string, code: string) => {
  const tokens = await invokeFunction<SessionTokens>(client, 'phone-auth', { action: 'verify', phone: toPhone(digits), code });
  ensureOk(await client.auth.setSession(tokens));
};
