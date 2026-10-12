import { createBrowserClient } from '@supabase/ssr';
import type { CefrClient, Database } from '@cefr/core';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

let browserClient: CefrClient | undefined;

export const getSupabase = (): CefrClient => {
  browserClient ??= createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
};
