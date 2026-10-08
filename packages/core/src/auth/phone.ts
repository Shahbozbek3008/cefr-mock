export const PHONE_PREFIX = '+998';
export const PHONE_DIGITS = 9;
export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 60;

export const formatPhone = (digits: string) => {
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return parts.filter(Boolean).join(' ');
};

export const sanitizeDigits = (value: string, max: number) => value.replace(/\D/g, '').slice(0, max);

export const isPhoneComplete = (digits: string) => digits.length === PHONE_DIGITS;

export const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};
