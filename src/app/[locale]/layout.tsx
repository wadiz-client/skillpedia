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
import { setRequestLocale } from 'next-intl/server';

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

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // 지원하지 않는 로케일인 경우 404를 반환합니다.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);

  // @primer/react가 불러오는 focus-visible 폴리필이 클라이언트에서 html에 클래스와 속성을 추가합니다.
  return (
    <html data-dark-theme="dark" data-light-theme="light" lang={locale} suppressHydrationWarning>
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
