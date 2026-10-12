import { AUTH_ERROR_CODES, errorCode, type AuthErrorCode } from '@cefr/core';

export const authErrorKey = (error: unknown): AuthErrorCode | 'unknown' => {
  const code = errorCode(error);
  return (AUTH_ERROR_CODES as readonly string[]).includes(code) ? (code as AuthErrorCode) : 'unknown';
};
