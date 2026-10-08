# CEFR-MultiLevel — Web

CEFR Multilevel imtihoniga tayyorlanish platformasining web versiyasi (hozircha faqat dizayn, ma'lumotlar mock).

**Stack:** Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · next-intl (uz / ru / en) · Radix UI · motion · lucide-react

## Ishga tushirish

Node **≥ 20.9** kerak (`.nvmrc` → 22).

```bash
nvm use 22
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck    # tsc
npm run lint         # eslint
npm run i18n:check   # ru/en kalitlari uz bilan bir xilligini tekshiradi
```

## Lokalizatsiya

- `uz` — default, prefiksiz (`/`, `/app`), `ru` → `/ru/...`, `en` → `/en/...` (`src/i18n/routing.ts`).
- Matnlar: `src/messages/{uz,ru,en}.json`. `uz.json` — manba; kalitlar TypeScript orqali tekshiriladi (`src/global.d.ts`).
- Test kontenti (savollar, passage, essay) README talabi bo'yicha inglizcha va `src/lib/mock/*` da turadi.
- Til almashtirgich: landing header/footer, mobil menyu va Sozlamalar → "Interfeys tili".

## Tuzilma

```
src/
  app/[locale]/
    (marketing)/            01–02  Landing (desktop + mobil responsive)
    (auth)/login, start/…   03     W1–W4b kirish va onboarding
    app/(shell)/…           03–06  sidebar'li sahifalar: W5, W12–W19
    app/(focus)/…           04, 06 sidebar'siz: W6, W7–W11 (test), W20
  components/
    ui/          primitivlar: Button, Card, Tag, Chip, SegmentedControl, Field/PhoneInput, OtpInput,
                 Switch/Checkbox/RadioCardGroup, Dialog, Gauge/Ring, LineChart, Waveform, ProgressBar…
    layout/      Sidebar, PageHeader/AppMain, Stage, LocaleSwitcher
    motion/      Reveal/Stagger, CountUp, Words, Spotlight, Marquee, Parallax, ScrollTilt, Grow, ActivePill (motion)
    marketing/   landing bo'limlari
    auth/        onboarding komponentlari
    app/         panel/natija/hisob komponentlari
    test/        test header/footer, navigator, reading, writing, recorder, yakunlash modal'i
  lib/           constants (ROUTES, SKILLS, LEVELS), mock ma'lumotlar, i18n helperlar, format
  styles/        tokens.css (yagona manba) + globals.css (Tailwind @theme)
```

## Dizayn qoidalari

- Barcha rang/radius/soya `tokens.css` → `@theme` orqali (`bg-surface`, `text-ink-2`, `shadow-e1`, `rounded-card`, `bg-action`…). Arbitrary qiymat faqat tokenda yo'q bo'lsa.
- Chegaralar `box-shadow` ring/inset bilan, `border` emas.
- Sanalar (masalan "1-noyabr 2026") xabarlar faylida — server va brauzer ICU farqi hydration xatosiga olib kelmasligi uchun.
