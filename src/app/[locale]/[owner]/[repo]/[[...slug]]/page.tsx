import { OwnerRepoSlugPage } from '@/views/[owner]/[repo]/[[...slug]]/OwnerRepoSlugPage';

interface PageProps {
  params: Promise<{ owner: string; repo: string; slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { owner, repo, slug = [] } = await params;

  return <OwnerRepoSlugPage owner={owner} repo={repo} slug={slug} />;
}
