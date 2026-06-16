'use client';

import { useEffect, useState } from 'react';

import { CheckIcon, CopyIcon } from '@primer/octicons-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    const root = document.documentElement;

    const readColorMode = () => {
      setColorMode(root.getAttribute('data-color-mode') === 'dark' ? 'dark' : 'light');
    };

    readColorMode();

    const observer = new MutationObserver(readColorMode);
    observer.observe(root, { attributeFilter: ['data-color-mode'], attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.language}>{language ?? 'text'}</span>
        <button
          aria-label={copied ? 'Copied' : 'Copy'}
          className={styles.copy}
          title={copied ? 'Copied' : 'Copy'}
          type="button"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        codeTagProps={{ style: { fontFamily: 'inherit', fontSize: 'inherit' } }}
        customStyle={{
          margin: 0,
          padding: 'var(--base-size-20) var(--base-size-24)',
          background: 'transparent',
          fontSize: 'var(--brand-text-size-100)',
          fontFamily: 'var(--brand-fontStack-monospace)',
        }}
        language={language}
        showLineNumbers
        style={colorMode === 'dark' ? atomOneDark : github}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};
