import { Layout } from '@/widgets/layout/ui';

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Layout.Header />
      {children}
    </>
  );
}
