import { Layout } from '@/widgets/layout/ui';

interface RepoLayoutProps {
  children: React.ReactNode;
  params: Promise<{ owner: string; repo: string }>;
}

export default async function RepoLayout({ children, params }: RepoLayoutProps) {
  const { owner, repo } = await params;

  return (
    <Layout owner={owner} repo={repo}>
      <Layout.Header />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
