import type { User } from '@supabase/supabase-js';
import { PHONE_PREFIX, formatPhone } from '@cefr/core';

const PHONE_ALIAS = /^\d+(?=@phone\.)/;

const phoneOf = (user: User) => {
  const digits = user.phone?.replace(/\D/g, '') || user.email?.match(PHONE_ALIAS)?.[0];
  if (!digits) return null;
  const local = digits.startsWith(PHONE_PREFIX.slice(1)) ? digits.slice(PHONE_PREFIX.length - 1) : digits;
  return `${PHONE_PREFIX} ${formatPhone(local)}`;
};

export const accountLabel = (user: User) => phoneOf(user) ?? user.email ?? user.id;
