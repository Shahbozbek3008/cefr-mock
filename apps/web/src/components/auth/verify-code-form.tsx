'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OTP_LENGTH, RESEND_SECONDS, requestCode, useCefrClient, verifyCode } from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { ResendTimer } from './resend-timer';
import { authErrorKey } from './auth-error';

type VerifyCodeFormProps = { digits: string; next?: string; onVerified?: () => Promise<void> };

export function VerifyCodeForm({ digits, next = ROUTES.dashboard, onVerified }: VerifyCodeFormProps) {
  const t = useTranslations('auth');
  const client = useCefrClient();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<ReturnType<typeof authErrorKey> | null>(null);

  const confirm = async (value: string) => {
    if (value.length !== OTP_LENGTH || pending) return;
    setPending(true);
    setError(null);
    try {
      await verifyCode(client, digits, value);
      setDone(true);
      if (onVerified) {
        await onVerified();
        return;
      }
      router.replace(next);
      router.refresh();
    } catch (failure) {
      setError(authErrorKey(failure));
      setPending(false);
    }
  };

  const change = (value: string) => {
    setCode(value);
    setError(null);
    if (value.length === OTP_LENGTH) confirm(value);
  };

  return (
    <div className="flex flex-col gap-5">
      <OtpInput label={t('verify.otpLabel')} autoFocusIndex={0} success={done} error={error !== null} disabled={pending} onChange={change} />
      {error && <span className="-mt-2 text-[13px] text-error-text">{t(`errors.${error}`)}</span>}
      <Button block disabled={code.length !== OTP_LENGTH} loading={pending} onClick={() => confirm(code)}>
        {t('verify.confirm')}
      </Button>
      <ResendTimer seconds={RESEND_SECONDS} onResend={() => requestCode(client, digits)} />
    </div>
  );
}
