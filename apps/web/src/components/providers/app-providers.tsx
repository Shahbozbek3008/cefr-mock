'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CefrClientProvider } from '@cefr/core';
import { getSupabase } from '@/lib/supabase/client';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  });

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <CefrClientProvider client={getSupabase()}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </CefrClientProvider>
  );
}
