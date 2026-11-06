import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { requestCode, verifyCode, type AuthErrorCode } from '@cefr/core';
import { Card } from '@cefr/ui/components/card';
import { supabase } from '@/shared/api/supabase';
import { authErrorCode } from '../lib/auth-error';
import { CodeStep } from './code-step';
import { PhoneStep } from './phone-step';

export function LoginForm() {
  const t = useTranslations('auth.errors');
  const [digits, setDigits] = useState<string | null>(null);
  const tAuth = useTranslations('auth');
  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [notice, setNotice] = useState(false);

  const attempt = async (action: () => Promise<void>) => {
    setError(null);
    try {
      await action();
    } catch (failure) {
      setError(authErrorCode(failure));
    }
  };

  const requestFor = async (value: string) => {
    setError(null);
    setNotice(false);
    try {
      await requestCode(supabase, value);
      setDigits(value);
    } catch (failure) {
      const code = authErrorCode(failure);
      if (code !== 'too_many_requests') return setError(code);
      setNotice(true);
      setDigits(value);
    }
  };

  const verify = (code: string) => attempt(() => verifyCode(supabase, digits ?? '', code));

  const back = () => {
    setError(null);
    setNotice(false);
    setDigits(null);
  };

  return (
    <Card elevation="e1" className="p-6">
      {digits === null ? <PhoneStep onSubmit={requestFor} /> : <CodeStep digits={digits} failed={error !== null} onSubmit={verify} onBack={back} />}
      {notice && !error && <p className="mt-3 text-sm text-ink-2">{tAuth('previousCodeValid')}</p>}
      {error && <p className="mt-3 text-sm text-error-text">{t(error)}</p>}
    </Card>
  );
}
