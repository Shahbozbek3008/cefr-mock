# CEFR-MultiLevel — Web (dashboard)

CEFR Multilevel platformasining web ilovasi: kirish/onboarding, dashboard, testlar va natijalar. Landing alohida loyiha — `apps/landing`; umumiy UI — `packages/ui` (`@cefr/ui`).

**Stack:** Vite 7 · React 19 · TypeScript · React Router 7 · Tailwind v4 · use-intl (uz / ru / en) · Radix UI · motion · lucide-react

## Ishga tushirish

Node **≥ 20.19** kerak (`.nvmrc` → 22).

```bash
nvm use 22
npm install
npm run dev          # http://localhost:3000 (landing: npm run landing → :3001)
npm run build        # dist/
npm run preview      # build natijasini lokal ko'rish
npm run typecheck    # tsc
npm run lint         # eslint
npm run i18n:check   # ru/en kalitlari uz bilan bir xilligini tekshiradi
```

Muhit o'zgaruvchilari (`.env.local`, Vercel) — `VITE_*`; ilovada faqat `src/shared/config/env.ts` orqali o'qiladi:

| O'zgaruvchi | Vazifasi |
| --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Supabase client |
| `VITE_LANDING_URL` | Login sahifasidagi logo havolasi (default `http://localhost:3001`) |
| `VITE_FIREBASE_*` | Web push; to'liq bo'lmasa `firebase-messaging-sw.js` o'zini o'chiradi |

## Lokalizatsiya

- `uz` — default, prefiksiz (`/`, `/tests`), `ru` → `/ru/...`, `en` → `/en/...` (`@cefr/ui/i18n/locales`). `/uz/...` → prefiksiz manzilga yo'naltiriladi.
- Prefiksiz manzilga kirishda til `NEXT_LOCALE` cookie'si (landing bilan umumiy nom), bo'lmasa brauzer tili bo'yicha tanlanadi (`src/shared/i18n/locale-detection.ts`).
- Matnlar: `src/shared/i18n/messages/{uz,ru,en}.json`, tanlangan til bo'yicha alohida chunk bo'lib yuklanadi. `uz.json` — manba; kalitlar TypeScript orqali tekshiriladi (`src/global.d.ts`).
- Test kontenti (savollar, passage, essay) inglizcha va `src/shared/mock/*` da turadi.
- Til almashtirgich: Sozlamalar → "Interfeys tili".

## Auth

- `/login`, `/start/*` — faqat mehmonlar uchun (`GuestOnly`); qolgan barcha sahifalar sessiya talab qiladi (`RequireAuth`), `src/app/guards/auth-gate.tsx`.
- Tekshiruv faqat sahifaga o'tishda bajariladi — sahifa ichida sessiya paydo bo'lsa (masalan `/start/verify` da OTP tasdiqlangach) foydalanuvchi joyida qoladi.

## SEO

Ilova login ortida, shuning uchun qidiruvdan to'liq yopiq: `noindex` meta, `X-Robots-Tag` header (`vercel.json`) va `robots.txt` → `Disallow: /`. Qidiruv uchun SEO landing'da.

## Arxitektura — Feature-Sliced Design

`apps/mobile` bilan bir xil qatlamlar. Qatlam faqat o'zidan pastdagilardan import qiladi (`app → pages → widgets → features → entities → shared`), bir qatlam ichidagi slice'lar bir-birini import qilmaydi. Entities tashqaridan faqat public API (`index.ts`) orqali olinadi. Har slice ichida segmentlar: `ui/`, `model/` (`constants.ts`, `types.ts`, store/hook'lar), `lib/`, `config/`.

```
index.html          HTML shablon (mavzu skripti plagin orqali qo'shiladi)
vite.config.ts      alias, vendor chunk'lar
plugins/            firebase-messaging-sw.js generatsiyasi, mavzu skripti
public/             ikonka, manifest, robots.txt, push ikonkalari
src/
  main.tsx          kirish nuqtasi: tilni aniqlash → router
  app/              router, providers (query, intl, navigation), guards, layouts (auth / shell / focus / test-section), styles
  pages/
    auth/           kirish va onboarding (W1–W4b)
    shell/          sidebar'li sahifalar: W5, W12–W19 (`/` — dashboard)
    focus/          sidebar'siz: W6, W7–W11 (test), W20
  widgets/          app-shell (sidebar, topbar, user-menu), settings, listening / reading / writing / speaking-section
  features/         auth (login + onboarding), billing, catalog, dashboard, progress, result, review, ai-review,
                    notifications, test-intro, test-session, web-push
  entities/         attempt (store, savol inputlari), session (auth holati), result (natija bloklari), test
  shared/           api (supabase, web-push, failure-key), config (env, routes), i18n, lib, ui, mock, assets
```

## Dizayn qoidalari

- Barcha rang/radius/soya `packages/ui/styles/tokens.css` → `@theme` orqali (`bg-surface`, `text-ink-2`, `shadow-e1`, `rounded-card`, `bg-action`…). Arbitrary qiymat faqat tokenda yo'q bo'lsa.
- Chegaralar `box-shadow` ring/inset bilan, `border` emas.
- UI paketidagi `Link`-ga bog'liq komponentlar (`ButtonLink`, `LocaleSwitcher`) navigatsiyani `NavigationProvider` adapteridan oladi: web'da React Router, landing'da next-intl.
