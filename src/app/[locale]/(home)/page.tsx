import { headers } from 'next/headers';
import { userAgent } from 'next/server';

import { setRequestLocale } from 'next-intl/server';

import { HomePage } from '@/views/(home)/HomePage';
import { getRankedRepositoryMetadataList } from '@/views/(home)/_lib';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// headers()로 기기를 판별하기 때문에 매 요청 시 렌더링합니다.
// 저장소 메타데이터 재사용은 getRepositoryMetadata의 캐시가 담당합니다.
export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const repositoryMetadataList = await getRankedRepositoryMetadataList();

  const headersList = await headers();
  const { device } = userAgent({ headers: headersList });
  const isMobile = device.type === 'mobile';

  return (
    <HomePage
      isMobile={isMobile}
      repositoryMetadataList={repositoryMetadataList}
    />
  );
}
