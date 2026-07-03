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
  description: 'GitHub App 기반의 멀티 테넌트 문서 렌더링 엔진',
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
