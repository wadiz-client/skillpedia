import styles from './SidebarSkeleton.module.scss';

// 사이드바 항목 자리표시자의 너비를 정의합니다.
const ITEM_WIDTHS = ['70%', '55%', '80%', '45%', '65%', '60%', '75%', '50%'];

export const SidebarSkeleton = () => {
  return (
    <aside className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.title} />

        {ITEM_WIDTHS.map((width, index) => {
          return <div className={styles.item} key={index} style={{ width }} />;
        })}
      </div>
    </aside>
  );
};
