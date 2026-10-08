import { FunctionsHttpError, FunctionsRelayError } from '@supabase/supabase-js';
import type { CefrClient } from './client';

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'ApiError';
  }
}

type Failure = { message: string; code?: string } | null;

export const unwrap = <R extends { data: unknown; error: Failure }>({ data, error }: R): NonNullable<R['data']> => {
  if (error) throw new ApiError(error.code ?? 'unknown', error.message);
  if (data === null || data === undefined) throw new ApiError('not_found');
  return data as NonNullable<R['data']>;
};

export const ensureOk = ({ error }: { error: Failure }) => {
  if (error) throw new ApiError(error.code ?? 'unknown', error.message);
};

export const requireUserId = async (client: CefrClient) => {
  const { data } = await client.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new ApiError('not_authenticated');
  return id;
};

const HTTP_NOT_FOUND = 404;

const httpFailure = async (error: FunctionsHttpError) => {
  const response = error.context as Response;
  const payload = await response.json().catch(() => null);
  if (typeof payload?.error === 'string') return new ApiError(payload.error);
  const code = response.status === HTTP_NOT_FOUND ? 'function_not_found' : 'server_error';
  return new ApiError(code, `${response.status} ${JSON.stringify(payload)}`);
};

export const invokeFunction = async <T>(client: CefrClient, name: string, body: Record<string, unknown>): Promise<T> => {
  const { data, error } = await client.functions.invoke<T>(name, { body });
  if (!error) return data as T;
  if (error instanceof FunctionsHttpError) throw await httpFailure(error);
  if (error instanceof FunctionsRelayError) throw new ApiError('server_error', error.message);
  throw new ApiError('network_error', error.message);
};

export const errorCode = (error: unknown) => (error instanceof ApiError ? error.code : 'network_error');

const NETWORK_PATTERN = /network request failed|failed to fetch|fetch failed|network error|timed? ?out|aborted/i;

const messageOf = (error: unknown) => {
  const message = (error as { message?: unknown } | null)?.message;
  return typeof message === 'string' ? message : '';
};

export const isNetworkFailure = (error: unknown) =>
  (error instanceof ApiError && error.code === 'network_error') || NETWORK_PATTERN.test(messageOf(error));
