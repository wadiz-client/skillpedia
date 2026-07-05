import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// 로케일을 인식하는 내비게이션 유틸리티입니다.
export const { getPathname, Link, redirect, usePathname, useRouter } = createNavigation(routing);
