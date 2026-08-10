import { Fab } from '@/widgets/fab/ui';
import { Layout } from '@/widgets/layout/ui';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Layout.Header />
      {children}
      <Fab.Container>
        <Fab.ScrollToTopButton />
      </Fab.Container>
    </>
  );
}
