import { setRequestLocale } from 'next-intl/server';

import { OwnerRepoSlugPage } from '@/views/[owner]/[repo]/[[...slug]]/OwnerRepoSlugPage';

interface PageProps {
  params: Promise<{ locale: string; owner: string; repo: string; slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { locale, owner, repo, slug = [] } = await params;
  setRequestLocale(locale);

  return <OwnerRepoSlugPage owner={owner} repo={repo} slug={slug} />;
}
