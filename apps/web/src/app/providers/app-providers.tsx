import { getSupabase } from "@/shared/api/supabase-client";
import { CefrClientProvider } from "@cefr/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

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

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <CefrClientProvider client={getSupabase()}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </CefrClientProvider>
  );
}
