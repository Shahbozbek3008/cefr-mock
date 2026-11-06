import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { OTP_LENGTH, PHONE_PREFIX, formatPhone } from '@cefr/core';
import { Button } from '@cefr/ui/components/button';
import { OtpInput } from '@cefr/ui/components/otp-input';

type CodeForm = { code: string };

type CodeStepProps = {
  digits: string;
  failed: boolean;
  onSubmit: (code: string) => Promise<void>;
  onBack: () => void;
};

export function CodeStep({ digits, failed, onSubmit, onBack }: CodeStepProps) {
  const t = useTranslations('auth');
  const { control, handleSubmit, watch, formState } = useForm<CodeForm>({ defaultValues: { code: '' } });
  const complete = watch('code').length === OTP_LENGTH;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(({ code }) => onSubmit(code))}>
      <p className="text-sm text-ink-2">{t('codeSent', { phone: `${PHONE_PREFIX} ${formatPhone(digits)}` })}</p>
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <OtpInput length={OTP_LENGTH} size="md" label={t('codeLabel')} autoFocusIndex={0} error={failed} disabled={formState.isSubmitting} onChange={field.onChange} />
        )}
      />
      <Button type="submit" block loading={formState.isSubmitting} disabled={!complete}>
        {t('signIn')}
      </Button>
      <Button variant="ghost" block onClick={onBack}>
        {t('changePhone')}
      </Button>
    </form>
  );
}
