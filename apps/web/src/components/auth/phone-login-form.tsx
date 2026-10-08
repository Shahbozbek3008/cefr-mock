'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { PHONE_DIGITS, formatPhone, isPhoneComplete, requestCode, sanitizeDigits, useCefrClient } from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Field, PhoneInput } from '@/components/ui/field';
import { authErrorKey } from './auth-error';

export function PhoneLoginForm({ next = ROUTES.loginVerify }: { next?: string }) {
  const t = useTranslations('auth');
  const client = useCefrClient();
  const router = useRouter();
  const [digits, setDigits] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ReturnType<typeof authErrorKey> | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isPhoneComplete(digits) || pending) return;
    setPending(true);
    setError(null);
    try {
      await requestCode(client, digits);
      router.push(`${next}?phone=${digits}`);
    } catch (failure) {
      setError(authErrorKey(failure));
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label={t('phone')} htmlFor="phone" hint={error && <span className="text-error-text">{t(`errors.${error}`)}</span>}>
        <PhoneInput
          id="phone"
          name="phone"
          autoFocus
          placeholder="90 123 45 67"
          value={formatPhone(digits)}
          onChange={(e) => setDigits(sanitizeDigits(e.target.value, PHONE_DIGITS))}
        />
      </Field>
      <Button type="submit" arrow block disabled={!isPhoneComplete(digits)} loading={pending}>
        {t('sendCode')}
      </Button>
    </form>
  );
}
