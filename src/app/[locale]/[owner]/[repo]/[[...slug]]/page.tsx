import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Metadata } from 'next';

import { load } from 'js-yaml';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getRepositoryReadmeMarkdown, getRepositorySkillMarkdown } from '@/features/repository-markdown/api';
import { normalizeTitle } from '@/shared/lib';
import { OwnerRepoSlugPage } from '@/views/[owner]/[repo]/[[...slug]]/OwnerRepoSlugPage';
import { parseMarkdown } from '@/views/[owner]/[repo]/[[...slug]]/_lib';

interface PageProps {
  params: Promise<{ locale: string; owner: string; repo: string; slug?: string[] }>;
}

// 렌더링 결과를 1시간마다 재검증해 마크다운 파싱까지 재사용합니다.
export const revalidate = 3600;

const getRepositories = (): string[] => {
  const filePath = join(process.cwd(), 'repositories.yaml');
  const content = process.env.REPOSITORIES ?? (existsSync(filePath) ? readFileSync(filePath, 'utf8') : '');

  if (!content) {
    return [];
  }

  return (load(content) || []) as string[];
};

export function generateStaticParams() {
  return getRepositories().map((repositoryPath) => {
    const [owner, repo] = repositoryPath.split('/');

    return { owner, repo, slug: [] };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, owner, repo, slug = [] } = await params;
  const path = slug.join('/');
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const [readmeResult, skillResult] = await Promise.allSettled([
    getRepositoryReadmeMarkdown({ owner, path, repo }),
    getRepositorySkillMarkdown({ owner, path, repo }),
  ]);

  const readme = readmeResult.status === 'fulfilled' ? readmeResult.value : null;
  const skill = skillResult.status === 'fulfilled' ? skillResult.value : null;
  const readmeMarkdown = readme ? parseMarkdown(readme.content) : null;
  const skillMarkdown = skill ? parseMarkdown(skill.content) : null;

  const folderName = path ? path.split('/').at(-1)! : repo;
  const title = normalizeTitle(readmeMarkdown?.frontmatter.title, skillMarkdown?.frontmatter.name ?? folderName);
  const description =
    readmeMarkdown?.frontmatter.description ?? skillMarkdown?.frontmatter.description ?? t('description');
  const metadataTitle = `${title} | ${t('title')}`;

  return {
    description,
    icons: {
      icon: [
        { media: '(prefers-color-scheme: light)', type: 'image/svg+xml', url: '/favicon_dark.svg' },
        { media: '(prefers-color-scheme: dark)', type: 'image/svg+xml', url: '/favicon_light.svg' },
      ],
    },
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    openGraph: {
      description,
      images: [{ alt: title, height: 1280, url: '/images/hero_light.jpg', width: 2560 }],
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      siteName: t('title'),
      title: metadataTitle,
      type: 'article',
      url: `/${locale}/${owner}/${repo}${path ? `/${path}` : ''}`,
    },
    title: metadataTitle,
    twitter: {
      card: 'summary_large_image',
      description,
      images: ['/images/hero_light.jpg'],
      title: metadataTitle,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, owner, repo, slug = [] } = await params;
  setRequestLocale(locale);

  return (
    <OwnerRepoSlugPage
      owner={owner}
      repo={repo}
      slug={slug}
    />
  );
}
