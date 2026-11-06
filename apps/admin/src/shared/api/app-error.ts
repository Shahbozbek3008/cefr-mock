import { ApiError, isNetworkFailure } from '@cefr/core';

export const APP_ERROR_CODES = [
  'numberTaken',
  'idTaken',
  'hasAttempts',
  'forbidden',
  'invalidTestId',
  'notFound',
  'ttsFailed',
  'notConfigured',
  'onlyMp3',
  'needsScript',
  'audioUnreadable',
  'publishedWithErrors',
  'publishBlocked',
  'network',
  'unknown',
] as const;

export type AppErrorCode = (typeof APP_ERROR_CODES)[number];

export type AppErrorValues = Record<string, string | number>;

export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    readonly values: AppErrorValues = {},
  ) {
    super(code);
    this.name = 'AppError';
  }
}

const MESSAGE_CODES: [RegExp, AppErrorCode][] = [
  [/tests_number_key/, 'numberTaken'],
  [/test_has_attempts/, 'hasAttempts'],
  [/forbidden/, 'forbidden'],
  [/invalid_test_id/, 'invalidTestId'],
  [/test_not_found|not_found/, 'notFound'],
  [/tts_failed/, 'ttsFailed'],
  [/not_configured/, 'notConfigured'],
];

export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (isNetworkFailure(error)) return new AppError('network');
  const text = error instanceof ApiError ? `${error.code} ${error.message}` : error instanceof Error ? error.message : '';
  const match = MESSAGE_CODES.find(([pattern]) => pattern.test(text));
  return new AppError(match?.[1] ?? 'unknown');
};
