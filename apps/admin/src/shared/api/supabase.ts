import { createClient } from '@supabase/supabase-js';
import type { CefrClient, Database } from '@cefr/core';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/shared/config/env';
import { AUTH_STORAGE_KEY } from '@/shared/config/storage';

const FALLBACK_URL = 'http://localhost';
const FALLBACK_KEY = 'missing';

export const supabase: CefrClient = createClient<Database>(SUPABASE_URL || FALLBACK_URL, SUPABASE_ANON_KEY || FALLBACK_KEY, {
  auth: { storageKey: AUTH_STORAGE_KEY },
});
