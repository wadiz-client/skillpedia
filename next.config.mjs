import createNextIntlPlugin from 'next-intl/plugin';

// 요청 설정 파일이 기본 경로(src/i18n)가 아니므로 경로를 지정합니다.
const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @primer/react는 CSS 모듈을 포함해서 트랜스파일 대상에 추가합니다.
  transpilePackages: ['@primer/react'],
  sassOptions: {
    // 모든 SCSS 모듈에서 @use 'variables'로 전역 변수에 접근합니다.
    loadPaths: ['src/shared/styles'],
  },
};

export default withNextIntl(nextConfig);
