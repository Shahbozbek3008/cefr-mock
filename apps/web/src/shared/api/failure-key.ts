import { isNetworkFailure } from '@cefr/core';
import type { FailureKey } from './types';

export const failureKey = (error: unknown): FailureKey => (isNetworkFailure(error) ? 'checkInternet' : 'serverError');
