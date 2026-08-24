import type { Metadata } from 'next';

import { headers } from 'next/headers';
import { userAgent } from 'next/server';

import { getTranslations, setRequestLocale } from 'next-intl/server';

import { HomePage } from '@/views/(home)/HomePage';
import { getRankedRepositoryMetadataList } from '@/views/(home)/_lib';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// headers()로 기기를 판별하기 때문에 매 요청 시 렌더링합니다.
// 저장소 메타데이터 재사용은 getRepositoryMetadata의 캐시가 담당합니다.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    description: t('description'),
    icons: {
      icon: [
        { media: '(prefers-color-scheme: light)', type: 'image/svg+xml', url: '/favicon_dark.svg' },
        { media: '(prefers-color-scheme: dark)', type: 'image/svg+xml', url: '/favicon_light.svg' },
      ],
    },
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    openGraph: {
      description: t('description'),
      images: [{ alt: t('title'), height: 1280, url: '/images/hero_light.jpg', width: 2560 }],
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      siteName: t('title'),
      title: t('title'),
      type: 'website',
      url: `/${locale}`,
    },
    title: t('title'),
    twitter: {
      card: 'summary_large_image',
      description: t('description'),
      images: ['/images/hero_light.jpg'],
      title: t('title'),
    },
  };
}

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
