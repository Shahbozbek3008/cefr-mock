import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@cefr/ui/i18n/routing';
import { OG_IMAGE_SIZE, SITE_URL } from '@/constants/seo';

const FONT_DIR = join(process.cwd(), 'src/assets/fonts');

const BARS = [
  { height: 22, opacity: 0.5 },
  { height: 36, opacity: 0.75 },
  { height: 50, opacity: 1 },
] as const;

export function LogoMarkImage({ size, rounded = true }: { size: number; rounded?: boolean }) {
  const scale = size / 72;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: rounded ? 22 * scale : 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 7 * scale,
        paddingBottom: 11 * scale,
        backgroundImage: 'linear-gradient(180deg, #4f9b35, #3f8a2c)',
      }}
    >
      {BARS.map((bar) => (
        <div key={bar.height} style={{ width: 13 * scale, height: bar.height * scale, borderRadius: 7 * scale, background: '#fff', opacity: bar.opacity }} />
      ))}
    </div>
  );
}

export async function renderOgImage(requestedLocale: string) {
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
  const [t, regular, semibold] = await Promise.all([
    getTranslations({ locale, namespace: 'metadata' }),
    readFile(join(FONT_DIR, 'Onest-400.ttf')),
    readFile(join(FONT_DIR, 'Onest-600.ttf')),
  ]);
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0E1621',
          backgroundImage: 'radial-gradient(circle at 88% 12%, rgba(109,179,35,0.34), transparent 42%), radial-gradient(circle at 8% 110%, rgba(106,179,243,0.26), transparent 48%)',
          color: '#F5F5F5',
          fontFamily: 'Onest',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <LogoMarkImage size={64} />
          <div style={{ display: 'flex', fontSize: 36 }}>
            <span style={{ fontWeight: 600 }}>CEFR</span>
            <span style={{ marginLeft: 10, color: '#93A3B4' }}>Multilevel</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ display: 'flex', fontSize: 74, fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.03em', maxWidth: 1000 }}>{t('ogHeadline')}</div>
          <div style={{ display: 'flex', fontSize: 34, color: '#93A3B4' }}>{t('ogTagline')}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26 }}>
          <span style={{ color: '#708499' }}>{host}</span>
          <span style={{ color: '#A5DC6C' }}>B1 · B2 · C1</span>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: 'Onest', data: regular, weight: 400, style: 'normal' },
        { name: 'Onest', data: semibold, weight: 600, style: 'normal' },
      ],
    },
  );
}
