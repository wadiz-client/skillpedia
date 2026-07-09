import { useTranslations } from 'next-intl';

import styles from './OwnerRepoSlugLoadingPage.module.scss';

// 사이드바 항목과 본문 문단 자리표시자의 개수와 너비를 정의합니다.
const SIDEBAR_ITEM_WIDTHS = ['70%', '55%', '80%', '45%', '65%', '60%', '75%', '50%'];
const PARAGRAPH_WIDTHS = ['100%', '96%', '88%', '100%', '92%', '70%', '100%', '84%', '60%'];

/**
 * 저장소 페이지의 데이터 수집이 끝나기 전까지 표시하는 스켈레톤입니다.
 * 실제 사이드바·본문 레이아웃을 모방해 화면 이동 직후의 빈 화면을 방지합니다.
 */
export const OwnerRepoSlugLoadingPage = () => {
  const t = useTranslations('OwnerRepoSlugLoadingPage');

  return (
    <div aria-busy="true" aria-label={t('ariaLabel')} className={styles.container} role="status">
      <aside className={styles.sidebar}>
        <div className={styles.inner}>
          <div className={styles.sidebarTitle} />

          {SIDEBAR_ITEM_WIDTHS.map((width, index) => {
            return <div className={styles.sidebarItem} key={index} style={{ width }} />;
          })}
        </div>
      </aside>

      <main className={styles.article}>
        <div className={styles.breadcrumb} />
        <div className={styles.title} />
        <div className={styles.description} />

        {PARAGRAPH_WIDTHS.map((width, index) => {
          return <div className={styles.paragraph} key={index} style={{ width }} />;
        })}
      </main>
    </div>
  );
};
