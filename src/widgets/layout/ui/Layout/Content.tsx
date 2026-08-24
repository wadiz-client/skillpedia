import styles from './Content.module.scss';

interface ContentProps {
  children: React.ReactNode;
}

export const Content = ({ children }: ContentProps) => {
  return <div className={styles.container}>{children}</div>;
};
