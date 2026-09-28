import { useEffect } from 'react';
import { useUserStore } from '@/entities/user/model';
import { supabase } from '@/shared/api';
import { clearSession } from './session';

export const useAuthListener = () => {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session || !useUserStore.getState().user) return;
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT') clearSession();
    });
    return () => data.subscription.unsubscribe();
  }, []);
};
