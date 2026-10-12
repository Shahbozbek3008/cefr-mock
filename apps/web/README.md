# CEFR-MultiLevel — Web (dashboard)

CEFR Multilevel platformasining web ilovasi: kirish/onboarding, dashboard, testlar va natijalar. Landing alohida loyiha — `apps/landing`; umumiy UI — `packages/ui` (`@cefr/ui`).

**Stack:** Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · next-intl (uz / ru / en) · Radix UI · motion · lucide-react

## Ishga tushirish

Node **≥ 20.9** kerak (`.nvmrc` → 22).

```bash
nvm use 22
npm install
npm run dev          # http://localhost:3000 (landing: npm run landing → :3001)
npm run build && npm start
npm run typecheck    # tsc
npm run lint         # eslint
npm run i18n:check   # ru/en kalitlari uz bilan bir xilligini tekshiradi
```

`.env.local` da Supabase/Firebase kalitlaridan tashqari `NEXT_PUBLIC_LANDING_URL` (default `http://localhost:3001`) — login sahifasidagi logo shu manzilga olib boradi.

## Lokalizatsiya

- `uz` — default, prefiksiz (`/`, `/tests`), `ru` → `/ru/...`, `en` → `/en/...` (`@cefr/ui/i18n/routing`).
- Matnlar: `src/messages/{uz,ru,en}.json`. `uz.json` — manba; kalitlar TypeScript orqali tekshiriladi (`src/global.d.ts`).
- Test kontenti (savollar, passage, essay) README talabi bo'yicha inglizcha va `src/lib/mock/*` da turadi.
- Til almashtirgich: Sozlamalar → "Interfeys tili".
- `/login`, `/start` — faqat mehmonlar uchun; qolgan barcha sahifalar sessiya talab qiladi (`src/proxy.ts`).

## Tuzilma

```
src/
  app/[locale]/
    (auth)/login, start/…   03     W1–W4b kirish va onboarding
    (shell)/…               03–06  sidebar'li sahifalar: W5, W12–W19 (`/` — dashboard)
    (focus)/…               04, 06 sidebar'siz: W6, W7–W11 (test), W20
  components/
    layout/      Sidebar, PageHeader/AppMain, Stage
    auth/        onboarding komponentlari
    app/         panel/natija/hisob komponentlari
    test/        test header/footer, navigator, reading, writing, recorder, yakunlash modal'i
  lib/           constants (ROUTES + @cefr/ui konstantalari), mock ma'lumotlar, supabase, firebase
  styles/        globals.css → @cefr/ui/styles/globals.css
```

## Dizayn qoidalari

- Barcha rang/radius/soya `packages/ui/styles/tokens.css` → `@theme` orqali (`bg-surface`, `text-ink-2`, `shadow-e1`, `rounded-card`, `bg-action`…). Arbitrary qiymat faqat tokenda yo'q bo'lsa.
- Chegaralar `box-shadow` ring/inset bilan, `border` emas.
- Sanalar (masalan "1-noyabr 2026") xabarlar faylida — server va brauzer ICU farqi hydration xatosiga olib kelmasligi uchun.
