import styles from './HomePage.module.scss';

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <p className={styles.badge}>Documentation</p>
        <h1 className={styles.title}>Skillpedia</h1>
        <p className={styles.description}>
          GitHub 저장소에 흩어진 스킬 문서를 수집하여<br />
          구조화된 형태로 제공합니다.
        </p>
        <p className={styles.hint}>
          <code>/{'{owner}/{repo}'}</code> 경로로 저장소 문서를 확인하세요.
        </p>
      </main>
    </div>
  );
};
