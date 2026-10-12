# CEFR-MultiLevel — Landing

Marketing sahifasi (`/`, `/ru`, `/en`). Supabase yoki sessiyaga bog'liq emas — to'liq statik (SSG).
Umumiy UI, tokenlar va i18n routing — `packages/ui` (`@cefr/ui`).

## Ishga tushirish

```bash
nvm use 22
npm install            # monorepo ildizida
npm run landing        # http://localhost:3001
npm run build --workspace @cefr/landing
npm run i18n:check --workspace @cefr/landing
```

## Muhit o'zgaruvchilari

| O'zgaruvchi | Default | Vazifasi |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Dashboard (`apps/web`) manzili. "Kirish" va "Boshlash" tugmalari `{APP_URL}/{locale}/login` / `/start` ga olib boradi (`src/lib/app-links.ts`). |

## Tuzilma

```
src/
  app/[locale]/   layout (header/footer/sticky CTA) + page
  components/     landing bo'limlari (hero, pricing, faq…)
  lib/            constants, app-links (dashboard havolalari), demo (preview uchun namunaviy ma'lumot), fonts
  messages/       faqat landing matnlari: metadata, common, skills, landing, plans
```
