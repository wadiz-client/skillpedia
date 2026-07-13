'use client';

import { useState } from 'react';

import { SearchIcon } from '@primer/octicons-react';
import { Box, FormControl, Hero, Label, Section, TextInput } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/shared/i18n/navigation';

import { NetworkCanvas } from './NetworkCanvas';
import { useHeroContent } from './useHeroContent';

import styles from './HeroSection.module.scss';

const DEFAULT_REPO_URL = 'https://github.com/anthropics/skills';

interface HeroSectionProps {
  isMobile: boolean;
}

export const HeroSection = ({ isMobile }: HeroSectionProps) => {
  const t = useTranslations('HomePage.HeroSection');
  const router = useRouter();
  const { rootRef, variant } = useHeroContent<HTMLDivElement>();
  const [repo, setRepo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 입력한 저장소를 정규화한 뒤 문서 경로로 이동합니다. 입력이 없으면 기본 저장소로 이동합니다.
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const value = (repo.trim() || DEFAULT_REPO_URL).replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');

    const isValidFormat = /^[\w.-]+\/[\w.-]+$/.test(value);

    if (isValidFormat) {
      router.push(`/${value}`);

      return;
    }

    setErrorMessage(t('form.error'));
  };

  return (
    <Section
      as="section"
      backgroundColor="default"
      className={styles.container}
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
      ref={rootRef}
    >
      {variant ? <NetworkCanvas variant={variant} /> : null}
      <div
        aria-hidden
        className={styles.overlay}
      />
      <Box
        className={styles.content}
        paddingInlineEnd={40}
        paddingInlineStart={40}
      >
        <Hero align="center">
          <Label
            color="green-blue-purple"
            data-hero="1"
            size="large"
          >
            Beta
          </Label>
          <Hero.Heading
            data-hero="2"
            letterSpacing="condensed"
            style={{ marginTop: 12 }}
            weight="extrabold"
          >
            {t.rich('title', {
              line: (chunks) => {
                return (
                  <span className={styles.line}>
                    <span data-hero-line="">{chunks}</span>
                  </span>
                );
              },
            })}
          </Hero.Heading>
          <Hero.Description
            data-hero="3"
            size="400"
            variant="muted"
          >
            {t.rich('description', {
              code: (chunks) => {
                return <code>{chunks}</code>;
              },
            })}
          </Hero.Description>
          <Box
            className={styles.form}
            data-hero="4"
            marginBlockStart={32}
            style={{ width: '100%' }}
          >
            <form onSubmit={handleSubmit}>
              <FormControl
                fullWidth
                size={isMobile ? 'medium' : 'large'}
                validationStatus={errorMessage ? 'error' : undefined}
              >
                <FormControl.Label visuallyHidden>{t('form.label')}</FormControl.Label>
                <TextInput
                  fullWidth
                  leadingVisual={<SearchIcon />}
                  placeholder={DEFAULT_REPO_URL}
                  size={isMobile ? 'medium' : 'large'}
                  type="search"
                  value={repo}
                  onChange={(event) => {
                    setRepo(event.target.value);
                    setErrorMessage(null);
                  }}
                />
                {errorMessage ? <FormControl.Validation>{errorMessage}</FormControl.Validation> : null}
              </FormControl>
              <Hero.PrimaryAction
                as="button"
                href="#"
                size={isMobile ? 'medium' : 'large'}
              >
                {t('form.submit')}
              </Hero.PrimaryAction>
            </form>
          </Box>
        </Hero>
      </Box>
    </Section>
  );
};
