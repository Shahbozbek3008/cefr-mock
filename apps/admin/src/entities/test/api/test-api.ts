import type { AnswerKeys, Json } from '@cefr/core';
import { AppError, toAppError } from '@/shared/api/app-error';
import { supabase } from '@/shared/api/supabase';
import { LISTENING_BUCKET } from '@/shared/config/storage';
import { fromStored, toStored } from '../model/mappers';
import type { LoadedTest, StoredScript, StoredTest, TestDraft, TestRow } from '../model/types';

const ROW_COLUMNS = 'id, number, title, format_month, format_year, duration_label, is_new, is_pro, published_at';

const orFail = <T>({ data, error }: { data: T | null; error: unknown }): T => {
  if (error) throw toAppError(error);
  if (data === null) throw new AppError('notFound');
  return data;
};

const failOn = ({ error }: { error: unknown }) => {
  if (error) throw toAppError(error);
};

export const listTests = async (): Promise<TestRow[]> =>
  orFail(await supabase.from('tests').select(ROW_COLUMNS).order('number', { ascending: false }));

export const loadTest = async (id: string): Promise<LoadedTest> => {
  const row = orFail(await supabase.from('tests').select(`${ROW_COLUMNS}, content`).eq('id', id).maybeSingle()) as StoredTest;
  const key = await supabase.from('test_keys').select('keys, scripts').eq('test_id', id).maybeSingle();
  failOn(key);
  const keys = (key.data?.keys ?? {}) as AnswerKeys;
  const scripts = (key.data?.scripts ?? []) as unknown as StoredScript[];
  return { draft: fromStored(row, keys, scripts), published: row.published_at !== null };
};

export const testExists = async (id: string) => {
  const { data } = await supabase.from('tests').select('id').eq('id', id).maybeSingle();
  return data !== null;
};

export const saveTest = async (draft: TestDraft): Promise<TestDraft> => {
  const stored = toStored(draft);
  failOn(
    await supabase.rpc('admin_save_test', {
      test_id: stored.id,
      meta: stored.meta as unknown as Json,
      content: stored.content as unknown as Json,
      keys: stored.keys as unknown as Json,
      scripts: stored.scripts as unknown as Json,
    }),
  );
  return stored.draft;
};

export const setTestPublished = async (id: string, published: boolean) =>
  failOn(await supabase.rpc('admin_set_published', { test_id: id, published }));

export const deleteTest = async (id: string) => {
  failOn(await supabase.rpc('admin_delete_test', { test_id: id }));
  const { data: files } = await supabase.storage.from(LISTENING_BUCKET).list(id);
  if (files?.length) await supabase.storage.from(LISTENING_BUCKET).remove(files.map((file) => `${id}/${file.name}`));
};
