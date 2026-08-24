import { Suspense } from 'react';

import { setRequestLocale } from 'next-intl/server';

import { getRepositoryTreeNodes } from '@/features/repository-tree/api';
import { Fab } from '@/widgets/fab/ui';
import { Layout, Sidebar, SidebarSkeleton } from '@/widgets/layout/ui';

import styles from './layout.module.scss';

interface OwnerRepoLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; owner: string; repo: string }>;
}

export default async function OwnerRepoLayout({ children, params }: OwnerRepoLayoutProps) {
  const { locale, owner, repo } = await params;
  setRequestLocale(locale);

  // 헤더와 본문이 트리 조회를 기다리지 않도록 프로미스를 그대로 넘겨 Suspense로 처리합니다.
  // Sidebar와 SidePanel이 같은 프로미스를 공유하며, 조회 결과는 저장소 단위로 캐시됩니다.
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
        <Layout.Content>
          <div className={styles.container}>
            <div className={styles.content}>
              <Suspense fallback={<SidebarSkeleton />}>
                <Sidebar
                  owner={owner}
                  repo={repo}
                  treeNodesPromise={treeNodesPromise}
                />
              </Suspense>

              {children}
            </div>

            <Layout.Footer />
          </div>
        </Layout.Content>
        <Fab.Container>
          <Fab.ScrollToTopButton />
        </Fab.Container>
    </Layout>
  );
}
