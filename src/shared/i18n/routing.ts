import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 지원 로케일 목록입니다.
  locales: ['ko', 'en'],
  // 기본 로케일은 한국어이며, 영어는 번역본으로 제공합니다.
  defaultLocale: 'ko',
  // 모든 로케일에 접두사를 붙입니다. (예: /ko, /en)
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
