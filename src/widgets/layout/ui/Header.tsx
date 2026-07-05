'use client';

import Link from 'next/link';

import { MoonIcon, SunIcon } from '@primer/octicons-react';

import { useColorMode } from '@/app/providers';

import styles from './Header.module.scss';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link className={styles.logo} href="/">
            <svg aria-hidden fill="currentColor" height="24" viewBox="0 0 512 512" width="24">
              <g transform="translate(256, 256)">
                <rect height="88" width="176" x="-220" y="-176" />
                <circle cx="132" cy="-132" r="88" />
                <circle cx="-132" cy="132" r="88" />
                <rect height="88" width="176" x="44" y="88" />
              </g>
            </svg>
            <span className={styles.title}>Skillpedia</span>
          </Link>
        </div>

        <button
          aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className={styles.themeToggle}
          type="button"
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
      </div>
    </header>
  );
};
