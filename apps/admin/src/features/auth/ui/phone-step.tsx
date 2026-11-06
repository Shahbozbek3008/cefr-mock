import { useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { PHONE_DIGITS, formatPhone, sanitizeDigits } from '@cefr/core';
import { Button } from '@cefr/ui/components/button';
import { Field, PhoneInput } from '@cefr/ui/components/field';

type PhoneForm = { digits: string };

export function PhoneStep({ onSubmit }: { onSubmit: (digits: string) => Promise<void> }) {
  const t = useTranslations('auth');
  const id = useId();
  const { control, handleSubmit, watch, formState } = useForm<PhoneForm>({ defaultValues: { digits: '' } });
  const complete = watch('digits').length === PHONE_DIGITS;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(({ digits }) => onSubmit(digits))}>
      <Field label={t('phone')} htmlFor={id}>
        <Controller
          control={control}
          name="digits"
          render={({ field }) => (
            <PhoneInput
              id={id}
              ref={field.ref}
              name={field.name}
              autoFocus
              placeholder={t('phonePlaceholder')}
              value={formatPhone(field.value)}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(sanitizeDigits(event.target.value, PHONE_DIGITS))}
            />
          )}
        />
      </Field>
      <Button type="submit" block loading={formState.isSubmitting} disabled={!complete}>
        {t('getCode')}
      </Button>
    </form>
  );
}
