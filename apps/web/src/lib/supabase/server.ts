import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { CefrClient, Database } from '@cefr/core';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

export const getServerSupabase = async (): Promise<CefrClient> => {
  const store = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (entries) => {
        try {
          entries.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          return;
        }
      },
    },
  });
};
