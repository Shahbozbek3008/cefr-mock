import { InstagramIcon, TelegramIcon } from '@/components/ui/brand-icons';

export const LANDING_NAV = [
  { key: 'format', href: '#format' },
  { key: 'ai', href: '#ai' },
  { key: 'pricing', href: '#pricing' },
  { key: 'app', href: '#download' },
  { key: 'faq', href: '#faq' },
] as const;

export const SOCIAL_LINKS = [
  { key: 'telegram', href: 'https://t.me/', icon: TelegramIcon },
  { key: 'instagram', href: 'https://instagram.com/', icon: InstagramIcon },
] as const;

export const LEGAL_LINKS = [
  { key: 'terms', href: '#' },
  { key: 'privacy', href: '#' },
] as const;
