import createMiddleware from 'next-intl/middleware';

import { routing } from '@/shared/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 부정형 전방 탐색으로 api·_next·_vercel로 시작하는 경로를 제외합니다.
  // .*\..*는 점이 포함된 경로로, 확장자를 가진 정적 파일 요청을 의미합니다.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
