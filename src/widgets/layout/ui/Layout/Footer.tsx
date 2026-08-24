'use client';

import { useTranslations } from 'next-intl';

import { SymbolMark } from './SymbolMark';

import styles from './Footer.module.scss';

export const Footer = () => {
  const t = useTranslations('Layout.Footer');

  return (
    <footer className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a
            className={styles.logo}
            href="https://github.com/aroundus/skillpedia"
            rel="noreferrer"
            target="_blank"
          >
            <SymbolMark size={32} />
            <span className={styles.title}>Skillpedia</span>
          </a>

          <p className={styles.footnote}>
            {t.rich('footnote', {
              code: (chunks) => {
                return <code>{chunks}</code>;
              },
              strong: (chunks) => {
                return <strong>{chunks}</strong>;
              },
            })}
          </p>
        </div>

        <div className={styles.bottom}>
          <small className={styles.copyright}>{t('copyright', { year: new Date().getFullYear() })}</small>
        </div>
      </div>
    </footer>
  );
};
