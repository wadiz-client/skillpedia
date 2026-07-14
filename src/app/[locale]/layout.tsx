import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import '@primer/brand-primitives/lib/design-tokens/css/tokens/base/colors/color-scales-with-modes.css';
import '@primer/brand-primitives/lib/design-tokens/css/tokens/functional/colors/global-with-modes.css';
import '@primer/primitives/dist/css/functional/themes/dark.css';
import '@primer/primitives/dist/css/functional/themes/light.css';
import '@primer/primitives/dist/css/primitives.css';
import '@primer/react-brand/fonts/fonts.css';
import '@primer/react-brand/lib/css/main.css';
import 'modern-normalize/modern-normalize.css';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/shared/i18n/routing';
import type { Locale } from '@/shared/i18n/routing';
import { ColorModeProvider } from '@/shared/theme';

import { PrimerThemeProvider } from '../providers';
import '../styles/style.scss';

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => {
    return { locale };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    description: t('description'),
    icons: {
      icon: [
        { media: '(prefers-color-scheme: light)', type: 'image/svg+xml', url: '/favicon_dark.svg' },
        { media: '(prefers-color-scheme: dark)', type: 'image/svg+xml', url: '/favicon_light.svg' },
      ],
    },
    title: t('title'),
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // 지원하지 않는 로케일인 경우 404를 반환합니다.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);

  return (
    <html data-dark-theme="dark" data-light-theme="light" lang={locale}>
      <body>
        <NextIntlClientProvider now={new Date()}>
          <ColorModeProvider>
            <PrimerThemeProvider>{children}</PrimerThemeProvider>
          </ColorModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
