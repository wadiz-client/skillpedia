'use client';

import { useEffect, useState } from 'react';

import { ActionList } from '@primer/react';
import { Text } from '@primer/react-brand';

import type { TocHeading } from '../../_lib';

import styles from './Toc.module.scss';

interface TocProps {
  headings: TocHeading[];
}

export const Toc = ({ headings }: TocProps) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => {
          return entry.isIntersecting;
        });

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
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

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className={styles.container}>
      <nav aria-label="On This Page" className={styles.nav}>
        <Text as="p" className={styles.title} variant="muted">
          On This Page
        </Text>

        <ActionList>
          {headings.map((heading) => {
            return (
              <ActionList.LinkItem
                active={activeId === heading.id}
                className={heading.depth < 3 ? undefined : styles.indent}
                href={`#${heading.id}`}
                key={heading.id}
              >
                <Text size="100" variant="muted">
                  {heading.value}
                </Text>
              </ActionList.LinkItem>
            );
          })}
        </ActionList>
      </nav>
    </aside>
  );
};
