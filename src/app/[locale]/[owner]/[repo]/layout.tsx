import { setRequestLocale } from 'next-intl/server';

import { getRepositoryTreeNodes } from '@/features/repository-tree/api';
import { Layout } from '@/widgets/layout/ui';

interface RepoLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; owner: string; repo: string }>;
}

export default async function RepoLayout({ children, params }: RepoLayoutProps) {
  const { locale, owner, repo } = await params;
  setRequestLocale(locale);

  // 헤더가 트리 조회를 기다리지 않도록 프로미스를 그대로 넘겨 SidePanel에서 Suspense로 처리합니다.
  // 페이지의 Sidebar와 같은 트리를 사용하며, 조회 결과는 저장소 단위로 캐시됩니다.
  const treeNodesPromise = getRepositoryTreeNodes({ owner, repo });

  return (
    <Layout
      owner={owner}
      repo={repo}
    >
      <Layout.Header
        owner={owner}
        repo={repo}
        treeNodesPromise={treeNodesPromise}
      />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
