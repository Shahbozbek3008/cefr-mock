import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/shared/api/supabase';
import { checkIsAdmin } from '../api/auth-api';

export type AuthState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'denied'; session: Session }
  | { status: 'admin'; session: Session };

const AuthContext = createContext<AuthState>({ status: 'loading' });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    const resolve = async (session: Session | null) => {
      if (!session) {
        if (active) setState({ status: 'guest' });
        return;
      }
      const admin = await checkIsAdmin().catch(() => false);
      if (active) setState(admin ? { status: 'admin', session } : { status: 'denied', session });
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') resolve(session);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
