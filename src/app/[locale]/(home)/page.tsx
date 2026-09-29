import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/shared/i18n/routing';
import { HomePage } from '@/views/(home)/HomePage';
import { getRankedRepositoryMetadataList } from '@/views/(home)/_lib';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// 렌더링 결과를 1시간마다 재검증해 저장소 순위 계산까지 재사용합니다.
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    description: t('description'),
    icons: {
      icon: [
        { media: '(prefers-color-scheme: light)', type: 'image/svg+xml', url: '/favicon-dark.svg' },
        { media: '(prefers-color-scheme: dark)', type: 'image/svg+xml', url: '/favicon-light.svg' },
      ],
    },
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    openGraph: {
      description: t('description'),
      images: [{ alt: t('title'), height: 1280, url: '/images/hero-light.jpg', width: 2560 }],
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
      images: ['/images/hero-light.jpg'],
      title: t('title'),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // 레이아웃과 페이지를 함께 렌더링하므로 레이아웃의 notFound()만으로는 저장소 메타데이터 조회를 막지 못합니다.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const repositoryMetadataList = await getRankedRepositoryMetadataList();

  return <HomePage repositoryMetadataList={repositoryMetadataList} />;
}
