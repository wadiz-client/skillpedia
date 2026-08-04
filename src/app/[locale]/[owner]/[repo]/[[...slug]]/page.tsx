import { setRequestLocale } from 'next-intl/server';

import { OwnerRepoSlugPage } from '@/views/[owner]/[repo]/[[...slug]]/OwnerRepoSlugPage';

interface PageProps {
  params: Promise<{ locale: string; owner: string; repo: string; slug?: string[] }>;
}

// 렌더링 결과를 1시간마다 재검증해 마크다운 파싱까지 재사용합니다.
export const revalidate = 3600;

export default async function Page({ params }: PageProps) {
  const { locale, owner, repo, slug = [] } = await params;
  setRequestLocale(locale);

  return <OwnerRepoSlugPage owner={owner} repo={repo} slug={slug} />;
}
