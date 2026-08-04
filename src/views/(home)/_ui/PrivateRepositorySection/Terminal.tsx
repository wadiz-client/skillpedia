'use client';

import classNames from 'classnames';

import styles from './Terminal.module.scss';

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface TerminalChildrenProps {
  children: React.ReactNode;
}

const InternalTerminal = ({ children, className, style }: TerminalProps) => {
  return (
    <div
      className={classNames(styles.container, className)}
      style={style}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
};

const Group = ({ children }: TerminalChildrenProps) => {
  return <div className={styles.group}>{children}</div>;
};

const Command = ({ children }: TerminalChildrenProps) => {
  return (
    <div>
      <span className={styles.prompt}>$ </span>
      <span className={styles.command}>{children}</span>
    </div>
  );
};

const Comment = ({ children }: TerminalChildrenProps) => {
  return <div className={styles.comment}>{children}</div>;
};

export const Terminal = Object.assign(InternalTerminal, {
  Command,
  Comment,
  Group,
});
