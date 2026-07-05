'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { SearchIcon } from '@primer/octicons-react';
import { Box, FormControl, Hero, Label, MinimalFooter, Section, Text, TextInput } from '@primer/react-brand';

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

      <MinimalFooter
        copyrightStatement={`© ${new Date().getFullYear()} Skillpedia · 오픈소스 스킬 문서 사전`}
        logoHref="https://github.com/aroundus/skillpedia"
        socialLinks={false}
      >
        <MinimalFooter.Footnotes>
          <Text>
            <strong>
              Skillpedia(스킬피디아)는 GitHub의 공식 페이지가 아니며, 개인이 운영하는 비공식 프로젝트입니다.
            </strong>{' '}
            GitHub 저장소에 흩어진 SKILL.md 파일을 수집하여 구조화된 문서를 제공하는 것이 목적입니다. 개발자가 작성한
            스킬 문서를 읽고 정확한 사용법을 파악할 수 있도록 합니다. AI 에이전트가 도구를 정확하게 사용하려면
            엔지니어가 작성한 검증된 지침서가 필요합니다. Skillpedia는 그 지침서를 가장 효율적으로 전달하는 통로가
            됩니다.
          </Text>
        </MinimalFooter.Footnotes>
        <MinimalFooter.Link href="/">소개</MinimalFooter.Link>
        <MinimalFooter.Link href="/">작성 가이드</MinimalFooter.Link>
      </MinimalFooter>
    </div>
  );
};
