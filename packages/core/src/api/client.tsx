import { createContext, useContext, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database';

export type CefrClient = SupabaseClient<Database>;

const ClientContext = createContext<CefrClient | null>(null);

export function CefrClientProvider({ client, children }: { client: CefrClient; children: ReactNode }) {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

export const useCefrClient = () => {
  const client = useContext(ClientContext);
  if (!client) throw new Error('CefrClientProvider is missing');
  return client;
};
