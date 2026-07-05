'use client';

import { MinimalFooter, Text } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations('Layout.Footer');

  return (
    <MinimalFooter
      copyrightStatement={t('copyright', { year: new Date().getFullYear() })}
      logoHref="https://github.com/aroundus/skillpedia"
      socialLinks={false}
    >
      <MinimalFooter.Footnotes>
        <Text>
          {t.rich('footnote', {
            code: (chunks) => {
              return <code>{chunks}</code>;
            },
            strong: (chunks) => {
              return <strong>{chunks}</strong>;
            },
          })}
        </Text>
      </MinimalFooter.Footnotes>
      <MinimalFooter.Link href="/">{t('about')}</MinimalFooter.Link>
      <MinimalFooter.Link href="/">{t('guide')}</MinimalFooter.Link>
    </MinimalFooter>
  );
};
