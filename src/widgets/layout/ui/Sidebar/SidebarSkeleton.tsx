import { SkeletonText } from '@primer/react/experimental';

import styles from './SidebarSkeleton.module.scss';

// 사이드바 항목 자리표시자의 너비를 정의합니다.
const ITEM_WIDTHS = ['70%', '55%', '80%', '45%', '65%', '60%', '75%', '50%'];

export const SidebarSkeleton = () => {
  return (
    <aside className={styles.container}>
      <div className={styles.inner}>
        <SkeletonText maxWidth="60%" size="titleMedium" />

        {ITEM_WIDTHS.map((width, index) => {
          return <SkeletonText key={index} maxWidth={width} />;
        })}
      </div>
    </aside>
  );
};
