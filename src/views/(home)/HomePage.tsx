'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { SearchIcon } from '@primer/octicons-react';
import { ActionList } from '@primer/react';
import {
  Box,
  FormControl,
  Grid,
  Heading,
  Hero,
  Label,
  MinimalFooter,
  Section,
  SectionIntro,
  Text,
  TextInput,
} from '@primer/react-brand';

import type { RepoGroup } from './_lib';

import styles from './HomePage.module.scss';

interface HomePageProps {
  repoGroups: RepoGroup[];
}

const DEFAULT_REPO_URL = 'https://github.com/anthropics/skills';

export const HomePage = ({ repoGroups }: HomePageProps) => {
  const router = useRouter();
  const [repo, setRepo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 입력한 저장소를 정규화한 뒤 문서 경로로 이동합니다. 입력이 없으면 기본 저장소로 이동합니다.
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const value = (repo.trim() || DEFAULT_REPO_URL)
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\/$/, '');

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
        <Box paddingInlineEnd={40} paddingInlineStart={40}>
          <Hero>
            <Label color="green-blue-purple" size="large">
              Beta
            </Label>
            <Hero.Heading letterSpacing="condensed" style={{ marginTop: 12 }} weight="extrabold">
              흩어진 스킬 문서를 한곳에서, 정확하게
            </Hero.Heading>
            <Hero.Description size="400" variant="muted">
              GitHub 저장소에 흩어져 있는 SKILL.md 문서들을 찾아서 구조화된 형태로 제공합니다.
            </Hero.Description>
            <Box marginBlockStart={32} style={{ width: '100%' }}>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth size="large" validationStatus={errorMessage ? 'error' : undefined}>
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
                  <Hero.PrimaryAction as="button" href="#" size="large">
                    문서 보기
                  </Hero.PrimaryAction>
                </Box>
              </form>
            </Box>
            <Hero.Image
              alt=""
              position="inline-end"
              src="/images/hero.svg"
              style={{ height: '100%' }}
            />
          </Hero>
        </Box>
      </Section>

      <Section
        as="section"
        className={styles.section}
        paddingBlockEnd="spacious"
        paddingBlockStart="spacious"
      >
        <Box paddingInlineEnd={40} paddingInlineStart={40}>
          <Heading as="h2" size="5" weight="bold">
            저장소 둘러보기
          </Heading>

          <Grid style={{ marginTop: 40 }}>
            {repoGroups.map((group) => {
              return (
                <Grid.Column key={group.name} span={{ xsmall: 12, small: 6, medium: 4, large: 3 }}>
                  <ActionList>
                    <ActionList.Group>
                      <ActionList.GroupHeading as="h3">{group.name}</ActionList.GroupHeading>
                      {group.repos.map((repo) => {
                        return (
                          <ActionList.LinkItem as={Link} href={`/${repo}`} key={repo}>
                            <Text size="200">{repo}</Text>
                          </ActionList.LinkItem>
                        );
                      })}
                    </ActionList.Group>
                  </ActionList>
                </Grid.Column>
              );
            })}
          </Grid>
        </Box>
      </Section>

      <Section as="section" backgroundColor="subtle" data-color-mode="dark">
        <Box
          paddingBlockEnd={80}
          paddingBlockStart={80}
          paddingInlineEnd={40}
          paddingInlineStart={40}
        >
          <SectionIntro>
            <SectionIntro.Label>Private</SectionIntro.Label>
            <SectionIntro.Heading size="2" weight="extrabold">
              사내 저장소 스킬을
              <br />팀 안에서 안전하게
            </SectionIntro.Heading>
            <SectionIntro.Description>
              사내 인프라에 직접 설치해서 운영해 보세요. 외부에 공개하지 않고 사내 저장소의 스킬
              문서를 안전하게 구조화할 수 있습니다.
            </SectionIntro.Description>
            <SectionIntro.Link href="#">가이드 보러 가기</SectionIntro.Link>
          </SectionIntro>
        </Box>
      </Section>

      <MinimalFooter
        copyrightStatement={`© ${new Date().getFullYear()} Skillpedia · 오픈소스 스킬 문서 사전`}
        logoHref="https://github.com/aroundus/skillpedia"
        socialLinks={false}
      >
        <MinimalFooter.Footnotes>
          <Text>
            <strong>
              Skillpedia(스킬피디아)는 GitHub의 공식 페이지가 아니며, 개인이 운영하는 비공식
              프로젝트입니다.
            </strong>{' '}
            GitHub 저장소에 흩어진 SKILL.md 파일을 수집하여 구조화된 문서를 제공하는 것이
            목적입니다. 개발자가 작성한 스킬 문서를 읽고 정확한 사용법을 파악할 수 있도록 합니다. AI
            에이전트가 도구를 정확하게 사용하려면 엔지니어가 작성한 검증된 지침서가 필요합니다.
            Skillpedia는 그 지침서를 가장 효율적으로 전달하는 통로가 됩니다.
          </Text>
        </MinimalFooter.Footnotes>
        <MinimalFooter.Link href="/">소개</MinimalFooter.Link>
        <MinimalFooter.Link href="/">작성 가이드</MinimalFooter.Link>
      </MinimalFooter>
    </div>
  );
};
