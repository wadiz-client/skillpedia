'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { SearchIcon } from '@primer/octicons-react';
import { Box, FormControl, Hero, Label, Section, TextInput } from '@primer/react-brand';

import { Layout } from '@/widgets/layout/ui';

import type { RepoGroup } from './_lib';
import { PrivateRepoSection, RepoSection } from './_ui';

import styles from './HomePage.module.scss';

interface HomePageProps {
  isPublicDomain: boolean;
  repoGroups: RepoGroup[];
}

const DEFAULT_REPO_URL = 'https://github.com/anthropics/skills';

export const HomePage = ({ isPublicDomain, repoGroups }: HomePageProps) => {
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

    setErrorMessage('owner/repo 형식으로 작성해 주세요. 예: anthropics/skills');
  };

  return (
    <div className={styles.container}>
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
              흩어진 스킬 문서를 한곳에서, 정확하게
            </Hero.Heading>
            <Hero.Description
              size="400"
              variant="muted"
            >
              GitHub 저장소에 흩어져 있는 SKILL.md 문서들을 찾아서 구조화된 형태로 제공합니다.
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
                  <FormControl.Label>GitHub 저장소 주소</FormControl.Label>
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
                    문서 보기
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

      <RepoSection repoGroups={repoGroups} />

      {isPublicDomain && <PrivateRepoSection />}

      <Layout.Footer />
    </div>
  );
};
