import { setRequestLocale } from 'next-intl/server';

import { Layout } from '@/widgets/layout/ui';

interface RepoLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; owner: string; repo: string }>;
}

export default async function RepoLayout({ children, params }: RepoLayoutProps) {
  const { locale, owner, repo } = await params;
  setRequestLocale(locale);

  return (
    <Layout owner={owner} repo={repo}>
      <Layout.Header />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
