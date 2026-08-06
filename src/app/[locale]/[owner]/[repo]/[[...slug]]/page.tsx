import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { load } from 'js-yaml';
import { setRequestLocale } from 'next-intl/server';

import { OwnerRepoSlugPage } from '@/views/[owner]/[repo]/[[...slug]]/OwnerRepoSlugPage';

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
