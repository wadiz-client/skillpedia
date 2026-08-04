'use client';

import { useEffect, useRef, useState } from 'react';

import { ActionList } from '@primer/react';
import { Text } from '@primer/react-brand';

import type { TocHeading } from '../../_lib';

import styles from './Toc.module.scss';

interface TocProps {
  headings: TocHeading[];
}

// 활성 항목이 목차 영역 경계에 닿기 전에 확보할 여백입니다.
const SCROLL_EDGE_MARGIN = 48;

export const Toc = ({ headings }: TocProps) => {
  const [activeLinkId, setActiveLinkId] = useState<string>('');
  const containerRef = useRef<HTMLElement>(null);

  // 활성 항목이 목차 스크롤 영역을 벗어난 경우에만 목차 컨테이너를 스크롤합니다.
  const scrollActiveLinkIntoView = (linkId: string) => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const activeLink = container.querySelector<HTMLElement>(`a[href="#${CSS.escape(linkId)}"]`);

    if (activeLink === null) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeLinkRect = activeLink.getBoundingClientRect();

    if (activeLinkRect.top < containerRect.top + SCROLL_EDGE_MARGIN) {
      container.scrollTo({
        behavior: 'smooth',
        top: container.scrollTop + activeLinkRect.top - containerRect.top - SCROLL_EDGE_MARGIN,
      });

      return;
    }

    if (activeLinkRect.bottom > containerRect.bottom - SCROLL_EDGE_MARGIN) {
      container.scrollTo({
        behavior: 'smooth',
        top: container.scrollTop + activeLinkRect.bottom - containerRect.bottom + SCROLL_EDGE_MARGIN,
      });
    }
  };

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => {
          return entry.isIntersecting;
        });

        if (visibleEntries.length > 0) {
          // 콜백 인자 순서는 문서 순서를 보장하지 않으므로 화면 최상단 heading을 선택합니다.
          const [firstVisibleEntry] = visibleEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

          setActiveLinkId(firstVisibleEntry.target.id);
        }
      },
      { rootMargin: '-10% 0% -75% 0%' },
    );

    // 파싱 단계에서 부여한 id로 실제 heading 요소를 관찰합니다.
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  useEffect(() => {
    if (!activeLinkId) {
      return;
    }

    scrollActiveLinkIntoView(activeLinkId);
  }, [activeLinkId]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside
      className={styles.container}
      ref={containerRef}
    >
      <nav
        aria-label="On This Page"
        className={styles.nav}
      >
        <Text
          as="p"
          className={styles.title}
          variant="default"
          weight="semibold"
        >
          On This Page
        </Text>

        <ActionList>
          {headings.map((heading) => {
            return (
              <ActionList.LinkItem
                active={activeLinkId === heading.id}
                className={heading.depth < 3 ? undefined : styles.indent}
                href={`#${heading.id}`}
                key={heading.id}
              >
                <Text size="100">{heading.value}</Text>
              </ActionList.LinkItem>
            );
          })}
        </ActionList>
      </nav>
    </aside>
  );
};
