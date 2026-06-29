'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import type { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';

import { SearchIcon } from '@primer/octicons-react';
import { Box, FormControl, Hero, Section, TextInput } from '@primer/react-brand';

import styles from './HomePage.module.scss';

interface Category {
  icon: ReactNode;
  name: string;
  repos: string[];
}

interface Feature {
  description: string;
  icon: ReactNode;
  title: string;
}

// 인기 저장소 둘러보기 카테고리 목록입니다.
const CATEGORIES: Category[] = [
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <path d="M12 8V4H8" />
        <rect height="12" rx="2" width="16" x="4" y="8" />
        <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
      </svg>
    ),
    name: 'AI 에이전트',
    repos: [
      'anthropics/skills',
      'openai/openai-cookbook',
      'langchain-ai/langchain',
      'microsoft/autogen',
    ],
  },
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
      </svg>
    ),
    name: '프론트엔드',
    repos: ['facebook/react', 'vercel/next.js', 'vuejs/core', 'sveltejs/svelte'],
  },
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <rect height="8" rx="2" width="20" x="2" y="2" />
        <rect height="8" rx="2" width="20" x="2" y="14" />
        <path d="M6 6h.01M6 18h.01" />
      </svg>
    ),
    name: '백엔드 & API',
    repos: ['fastapi/fastapi', 'nestjs/nest', 'expressjs/express'],
  },
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    ),
    name: '데이터 & 스토리지',
    repos: ['prisma/prisma', 'supabase/supabase', 'redis/redis'],
  },
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 12v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    name: 'DevOps & 클라우드',
    repos: ['kubernetes/kubernetes', 'hashicorp/terraform', 'docker/compose'],
  },
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    name: '보안',
    repos: ['aquasecurity/trivy', 'gitleaks/gitleaks', 'ossf/scorecard'],
  },
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
    name: '문서화',
    repos: ['mkdocs/mkdocs', 'shuding/nextra', 'facebook/docusaurus'],
  },
  {
    icon: (
      <svg
        fill="none"
        height="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
        width="22"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    name: '커뮤니티 & 협업',
    repos: ['github/docs', 'primer/react', 'storybookjs/storybook'],
  },
];

// 내부용 안전 운영 방법 목록입니다.
const FEATURES: Feature[] = [
  {
    description:
      'GitHub App을 설치해 Private 저장소를 안전하게 연결하고, 사내 문서만 선택적으로 수집합니다.',
    icon: (
      <svg
        className={styles.featureIcon}
        fill="none"
        height="30"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        width="30"
      >
        <rect height="11" rx="2" width="18" x="3" y="11" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: '비공개 저장소 연결',
  },
  {
    description: 'Vercel Private·Docker로 사내망에 직접 배포해 외부 노출 없이 운영할 수 있습니다.',
    icon: (
      <svg
        className={styles.featureIcon}
        fill="none"
        height="30"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        width="30"
      >
        <rect height="8" rx="2" width="20" x="2" y="2" />
        <rect height="8" rx="2" width="20" x="2" y="14" />
        <path d="M6 6h.01M6 18h.01" />
      </svg>
    ),
    title: '사내 인프라에 셀프 호스팅',
  },
  {
    description: 'SSO·접근 제어를 연동해 인증된 팀원에게만 문서 열람 권한을 부여합니다.',
    icon: (
      <svg
        className={styles.featureIcon}
        fill="none"
        height="30"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        width="30"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: '조직 멤버만 접근',
  },
];

export const HomePage = () => {
  const router = useRouter();
  const [repo, setRepo] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  // 입력한 저장소를 정규화한 뒤 문서 경로로 이동합니다.
  const submitRepo = () => {
    const value = repo
      .trim()
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\/$/, '');

    if (value.length === 0) {
      setStatus('저장소를 owner/repo 형식으로 입력해 주세요.');

      return;
    }

    const isValidFormat = /^[\w.-]+\/[\w.-]+$/.test(value);

    if (isValidFormat) {
      router.push(`/${value}`);

      return;
    }

    setStatus('올바른 형식이 아니에요. 예: anthropics/skills');
  };

  const handleRepoChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setRepo(event.target.value);
    setStatus(null);
  };

  const handleRepoKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      submitRepo();
    }
  };

  const handleSubmitClick: MouseEventHandler<HTMLButtonElement> = () => {
    submitRepo();
  };

  const submitDisabled = repo.trim().length === 0;

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
          <Hero align="center">
            <Hero.Heading letterSpacing="condensed" weight="extrabold">
              흩어진 스킬 문서를 한곳에서, 정확하게
            </Hero.Heading>
            <Hero.Description size="400" variant="muted">
              GitHub 저장소에 흩어져 있는 SKILL.md 문서들을 찾아서 구조화된 형태로 제공합니다.
            </Hero.Description>
            <Box marginBlockStart={32} style={{ width: '100%' }}>
              <FormControl fullWidth size="large" validationStatus={status ? 'error' : undefined}>
                <FormControl.Label>GitHub 저장소 주소</FormControl.Label>
                <TextInput
                  fullWidth
                  leadingVisual={<SearchIcon />}
                  placeholder="https://github.com/skills/introduction-to-github"
                  size="medium"
                  type="search"
                  value={repo}
                  onChange={handleRepoChange}
                  onKeyDown={handleRepoKeyDown}
                />
                {status ? <FormControl.Validation>{status}</FormControl.Validation> : null}
              </FormControl>
            </Box>
            <Hero.PrimaryAction as="button" href="#" size="large">
              문서 보기
            </Hero.PrimaryAction>
            <Hero.Image
              alt=""
              position="inline-end"
              src="/images/hero.svg"
              style={{ height: '100%' }}
            />
          </Hero>
        </Box>
      </Section>

      <main className={styles.categories}>
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.heading}>인기 저장소 둘러보기</h2>
            <Link className={styles.more} href="/">
              전체 보기 →
            </Link>
          </div>

          <div className={styles.grid}>
            {CATEGORIES.map((category) => {
              return (
                <div className={styles.category} key={category.name}>
                  <div className={styles.name}>
                    {category.icon}
                    {category.name}
                  </div>
                  <div className={styles.links}>
                    {category.repos.map((repoPath) => {
                      return (
                        <Link className={styles.link} href={`/${repoPath}`} key={repoPath}>
                          {repoPath}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <section className={styles.internal}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <span className={styles.introLabel}>비공개 · 내부용</span>
            <h2 className={styles.introHeading}>팀 내부에서만 안전하게 사용하기</h2>
            <p className={styles.introDescription}>
              공개 배포 없이 사내 저장소의 스킬 문서만 수집하고, 인증된 팀원에게만 제공할 수
              있습니다. 다음 세 가지 방법으로 안전하게 운영하세요.
            </p>
          </div>

          <div className={styles.features}>
            {FEATURES.map((feature) => {
              return (
                <div className={styles.feature} key={feature.title}>
                  {feature.icon}
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureText}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.inner}>
          <span>Skillpedia · SKILL.md & README 문서 수집 관문</span>
          <span className={styles.nav}>
            <Link className={styles.navLink} href="/">
              GitHub
            </Link>
            <Link className={styles.navLink} href="/">
              소개
            </Link>
            <Link className={styles.navLink} href="/">
              작성 가이드
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
};
