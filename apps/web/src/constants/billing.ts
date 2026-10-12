import { ReceiptText, RotateCcw, ShieldCheck } from 'lucide-react';

export const CHECKOUT_TRUST = [
  { key: 'secure', icon: ShieldCheck },
  { key: 'cancel', icon: RotateCcw },
  { key: 'receipt', icon: ReceiptText },
] as const;

export const LOGO_HEIGHT = 20;
