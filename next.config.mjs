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

export default nextConfig;
