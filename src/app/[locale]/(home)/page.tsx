import { headers } from 'next/headers';
import { userAgent } from 'next/server';

import { setRequestLocale } from 'next-intl/server';

import { HomePage } from '@/views/(home)/HomePage';
import { getRepoGroups } from '@/views/(home)/_lib';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const repoGroups = getRepoGroups();

  const headersList = await headers();
  const isPublicDomain = headersList.get('host') === 'skillpedia.vercel.app';
  const { device } = userAgent({ headers: headersList });
  const isMobile = device.type === 'mobile';

  return (
    <HomePage
      isMobile={isMobile}
      isPublicDomain={isPublicDomain}
      repoGroups={repoGroups}
    />
  );
}
