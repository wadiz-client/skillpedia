import { headers } from 'next/headers';
import { userAgent } from 'next/server';

import { setRequestLocale } from 'next-intl/server';

import { HomePage } from '@/views/(home)/HomePage';
import { getRankedRepositoryMetadataList } from '@/views/(home)/_lib';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// 저장소 메타데이터를 1시간마다 재검증해 GitHub API 호출을 줄입니다.
export const revalidate = 3600;

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const repositoryMetadataList = await getRankedRepositoryMetadataList();

  const headersList = await headers();
  const isPublicDomain = headersList.get('host') === 'skillpedia.vercel.app';
  const { device } = userAgent({ headers: headersList });
  const isMobile = device.type === 'mobile';

  return (
    <HomePage
      isMobile={isMobile}
      isPublicDomain={isPublicDomain}
      repositoryMetadataList={repositoryMetadataList}
    />
  );
}
