import { toAppError } from '@/shared/api/app-error';
import { supabase } from '@/shared/api/supabase';

export const checkIsAdmin = async () => {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) throw toAppError(error);
  return data === true;
};

export const signOut = () => supabase.auth.signOut();
