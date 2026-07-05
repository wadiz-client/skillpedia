import type { Metadata } from 'next';

import '@primer/brand-primitives/lib/design-tokens/css/tokens/base/colors/color-scales-with-modes.css';
import '@primer/brand-primitives/lib/design-tokens/css/tokens/functional/colors/global-with-modes.css';
import '@primer/primitives/dist/css/functional/themes/dark.css';
import '@primer/primitives/dist/css/functional/themes/light.css';
import '@primer/primitives/dist/css/primitives.css';
import '@primer/react-brand/fonts/fonts.css';
import '@primer/react-brand/lib/css/main.css';
import 'modern-normalize/modern-normalize.css';

import { ColorModeProvider, PrimerThemeProvider } from './providers';

import './styles/style.scss';

export const metadata: Metadata = {
  description:
    'GitHub 저장소에 흩어진 SKILL.md 파일을 수집하여 구조화된 문서를 제공합니다. 개발자가 작성한 스킬 문서를 읽고 정확한 사용법을 파악할 수 있도록 합니다.',
  icons: {
    icon: [
      { media: '(prefers-color-scheme: light)', type: 'image/svg+xml', url: '/favicon_dark.svg' },
      { media: '(prefers-color-scheme: dark)', type: 'image/svg+xml', url: '/favicon_light.svg' },
    ],
  },
  title: 'Skillpedia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-dark-theme="dark" data-light-theme="light" lang="ko">
      <body>
        <ColorModeProvider>
          <PrimerThemeProvider>{children}</PrimerThemeProvider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
