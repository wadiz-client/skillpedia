'use client';

import { useState } from 'react';

import { SearchIcon } from '@primer/octicons-react';
import { Box, FormControl, Hero, Label, Section, TextInput } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/shared/i18n/navigation';

import styles from './HeroSection.module.scss';

const DEFAULT_REPO_URL = 'https://github.com/anthropics/skills';

export const HeroSection = () => {
  const t = useTranslations('HomePage.HeroSection');
  const router = useRouter();
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
      className={styles.section}
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
    >
      <Box
        paddingInlineEnd={40}
        paddingInlineStart={40}
      >
        <Hero>
          <Label
            color="green-blue-purple"
            size="large"
          >
            Beta
          </Label>
          <Hero.Heading
            letterSpacing="condensed"
            style={{ marginTop: 12 }}
            weight="extrabold"
          >
            {t('title')}
          </Hero.Heading>
          <Hero.Description
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
            marginBlockStart={32}
            style={{ width: '100%' }}
          >
            <form onSubmit={handleSubmit}>
              <FormControl
                fullWidth
                size="large"
                validationStatus={errorMessage ? 'error' : undefined}
              >
                <FormControl.Label>{t('form.label')}</FormControl.Label>
                <TextInput
                  fullWidth
                  leadingVisual={<SearchIcon />}
                  placeholder={DEFAULT_REPO_URL}
                  size="medium"
                  type="search"
                  value={repo}
                  onChange={(event) => {
                    setRepo(event.target.value);
                    setErrorMessage(null);
                  }}
                />
                {errorMessage ? <FormControl.Validation>{errorMessage}</FormControl.Validation> : null}
              </FormControl>
              <Box marginBlockStart={16}>
                <Hero.PrimaryAction
                  as="button"
                  href="#"
                  size="large"
                >
                  {t('form.submit')}
                </Hero.PrimaryAction>
              </Box>
            </form>
          </Box>
          <Hero.Image
            alt=""
            position="inline-end"
            src="/images/hero.svg"
          />
        </Hero>
      </Box>
    </Section>
  );
};
