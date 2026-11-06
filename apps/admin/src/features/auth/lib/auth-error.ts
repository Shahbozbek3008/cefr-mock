import { AUTH_ERROR_CODES, errorCode, type AuthErrorCode } from '@cefr/core';

const FALLBACK: AuthErrorCode = 'server_error';

export const authErrorCode = (error: unknown): AuthErrorCode => {
  const code = errorCode(error);
  return (AUTH_ERROR_CODES as readonly string[]).includes(code) ? (code as AuthErrorCode) : FALLBACK;
};
