'use client';

import { AnimationProvider, Box, Heading, IDE, Section, Text, useAnimation } from '@primer/react-brand';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';

import { Terminal } from './Terminal';

import styles from './PrivateRepositorySection.module.scss';

export const PrivateRepositorySection = () => {
  const t = useTranslations('HomePage.PrivateRepositorySection');
  const locale = useLocale();
  const headerAnimation = useAnimation({ variant: 'slide-in-up' });
  const terminalAnimation = useAnimation({ delay: 120, variant: 'slide-in-up' });

  return (
    <Section
      as="section"
      backgroundColor="subtle"
      className={styles.container}
      data-color-mode="dark"
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
    >
      <Box
        paddingInlineEnd={40}
        paddingInlineStart={40}
      >
        <AnimationProvider
          animationTrigger="on-visible"
          autoStaggerChildren={false}
          runOnce
          visibilityOptions={15}
        >
          <div className={styles.inner}>
            <header
              className={classNames(styles.header, headerAnimation.classes)}
              style={headerAnimation.styles}
            >
              <span className={styles.label}>
                <span className={styles.labelText}>Private</span>
                <span
                  aria-hidden
                  className={styles.cursor}
                />
              </span>
              <Heading
                as="h2"
                className={styles.heading}
                size="2"
                weight="extrabold"
              >
                {t.rich('title', {
                  br: () => {
                    return <br />;
                  },
                })}
              </Heading>
              <Text
                as="p"
                className={styles.description}
                size="200"
              >
                {t('description')}
              </Text>
              <a
                className={styles.link}
                href={`https://github.com/aroundus/skillpedia/blob/HEAD/${locale === 'en' ? 'INSTALLATION.md' : `INSTALLATION.${locale}.md`}`}
                rel="noreferrer"
                target="_blank"
              >
                {t('link')}
                <svg
                  aria-hidden
                  fill="none"
                  height="16"
                  viewBox="0 0 16 16"
                  width="16"
                >
                  <path
                    d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"
                    fill="currentColor"
                  />
                  <path
                    className={styles.stem}
                    d="M1.75 8H11"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
            </header>
            <div className={styles.content}>
              <Terminal
                className={terminalAnimation.classes}
                style={terminalAnimation.styles}
              >
                <Terminal.Command>git clone https://github.com/aroundus/skillpedia.git</Terminal.Command>
                <Terminal.Group>
                  <Terminal.Comment>{t('terminalAppComment')}</Terminal.Comment>
                  <Terminal.Command>cp .env.local.example .env.local</Terminal.Command>
                </Terminal.Group>
                <Terminal.Command>{'npm install && npm run dev'}</Terminal.Command>
              </Terminal>
              <IDE
                animate={{ delay: 240, variant: 'slide-in-up' }}
                className={styles.ide}
                height={280}
              >
                <IDE.Editor
                  activeTab={0}
                  files={[
                    {
                      alternativeText: '.env.local 파일 예시',
                      code: [
                        '# App ID',
                        'APP_ID=1234567',
                        '',
                        t('envKeyComment'),
                        'APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----',
                        'MIIEowIBAAKCAQEAy8Xn4Qk2vLpR7dTfWm3JhBc9NqZ1sVuE0aGxKrPyO6lHtCbA',
                        '…',
                        '-----END RSA PRIVATE KEY-----"',
                      ],
                      highlighter: 'hljs',
                      name: '.env.local',
                    },
                    {
                      alternativeText: '.env.local.example 파일 예시',
                      code: ['APP_ID=', 'APP_PRIVATE_KEY='],
                      highlighter: 'hljs',
                      name: '.env.local.example',
                    },
                  ]}
                  showLineNumbers
                />
              </IDE>
            </div>
          </div>
        </AnimationProvider>
      </Box>
    </Section>
  );
};
