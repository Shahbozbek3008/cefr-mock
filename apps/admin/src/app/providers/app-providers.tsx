import { AuthProvider } from "@/features/auth";
import { LocaleProvider, navigationAdapter } from "@/shared/i18n";
import { NavigationProvider } from "@cefr/ui/navigation/navigation-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LocaleProvider>
      <NavigationProvider adapter={navigationAdapter}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </NavigationProvider>
    </LocaleProvider>
  );
}
