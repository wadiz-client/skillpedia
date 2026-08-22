'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

// 문서 이동에도 유지되도록 모듈 스코프에 두고, 로딩 화면과 본문이 같은 이동을 이어서 판단하도록 경로를 기억합니다.
let currentPathname = typeof window === 'undefined' ? '' : window.location.pathname;

// 첫 로드의 경우 브라우저 복원·해시 위치를 덮어쓰지 않도록 초기화하지 않습니다.
let shouldReset = false;

// 뒤로/앞으로 이동의 경우 브라우저 복원을 덮어쓰지 않도록 초기화하지 않습니다.
let isHistoryNavigation = false;

const handlePopState = () => {
  isHistoryNavigation = true;
};

/**
 * 문서 이동 스크롤 복원 처리
 *
 * @description
 * Next 라우터가 문서 이동에서 창 스크롤을 조정하지 않아, 로딩 화면과 본문 마운트 시점에 스크롤을 맨 위로 초기화합니다.
 * 첫 로드와 뒤로/앞으로 이동은 브라우저 복원에 맡깁니다.
 */
export const ScrollRestoration = () => {
  // StrictMode의 이펙트 재실행에서 판정이 중복되지 않도록 방지합니다.
  const hasHandledMountRef = useRef(false);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 이전 오프셋이 한 프레임 노출되지 않도록 페인트 전에 초기화합니다.
  useLayoutEffect(() => {
    if (hasHandledMountRef.current) {
      return;
    }

    hasHandledMountRef.current = true;

    // 경로가 바뀐 첫 마운트에서 이동 유형을 판정하고, 같은 이동의 나머지 마운트는 판정을 재사용합니다.
    if (window.location.pathname !== currentPathname) {
      currentPathname = window.location.pathname;
      shouldReset = !isHistoryNavigation;
      isHistoryNavigation = false;
    }

    if (!shouldReset) {
      return;
    }

    window.scrollTo({ behavior: 'instant', top: 0 });
  }, []);

  return null;
};
