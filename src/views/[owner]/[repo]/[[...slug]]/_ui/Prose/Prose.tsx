'use client';

import { Children } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { LinkIcon } from '@primer/octicons-react';
import { Heading, OrderedList, Text, UnorderedList } from '@primer/react-brand';
import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { resolveMarkdownUrl } from '../../_lib';
import { CodeBlock } from '../CodeBlock';

import styles from './Prose.module.scss';

// heading은 Heading 컴포넌트로 렌더하고, id가 있으면 섹션 앵커 링크를 덧붙입니다.
const renderHeading = (as: 'h2' | 'h3' | 'h4' | 'h5' | 'h6', children: ReactNode, id?: string): ReactElement => {
  return (
    <Heading
      as={as}
      className={styles.heading}
      id={id}
    >
      {children}
      {id ? (
        <a
          aria-label="Link to this section"
          className={styles.anchor}
          href={`#${id}`}
        >
          <LinkIcon size={20} />
        </a>
      ) : null}
    </Heading>
  );
};

// react-markdown 요소 매핑: 코드 펜스는 CodeBlock으로, h1은 상단 제목과 중복되어 제외합니다.
const markdownComponents: Components = {
  h1() {
    return null;
  },
  h2({ children, id }) {
    return renderHeading('h2', children, id);
  },
  h3({ children, id }) {
    return renderHeading('h3', children, id);
  },
  h4({ children, id }) {
    return renderHeading('h4', children, id);
  },
  h5({ children, id }) {
    return renderHeading('h5', children, id);
  },
  h6({ children, id }) {
    return renderHeading('h6', children, id);
  },
  p({ children }) {
    return <Text as="p">{children}</Text>;
  },
  pre({ children }) {
    const codeElement = (Array.isArray(children) ? children[0] : children) as ReactElement<{
      children?: ReactNode;
      className?: string;
    }>;
    const className = codeElement?.props?.className ?? '';
    const match = /language-(\w+)/.exec(className);
    const rawChildren = codeElement?.props?.children;
    const value = (Array.isArray(rawChildren) ? rawChildren.join('') : String(rawChildren ?? '')).replace(/\n$/, '');

    return (
      <CodeBlock
        language={match?.[1]}
        value={value}
      />
    );
  },
  code({ children }) {
    return <code className={styles.inlineCode}>{children}</code>;
  },
  ul({ children }) {
    return <UnorderedList>{children}</UnorderedList>;
  },
  ol({ children }) {
    return <OrderedList>{children}</OrderedList>;
  },
  li({ children, className }) {
    if (className?.includes('task-list-item')) {
      const [checkbox, ...content] = Children.toArray(children);

      return (
        <li className={styles.taskItem}>
          {checkbox}
          <span>{content}</span>
        </li>
      );
    }

    return <UnorderedList.Item>{children}</UnorderedList.Item>;
  },
};

interface ProseProps {
  filePath: string;
  markdown: string;
  owner: string;
  repo: string;
}

export const Prose = ({ filePath, markdown, owner, repo }: ProseProps) => {
  return (
    <div className={styles.prose}>
      <Markdown
        components={markdownComponents}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        remarkPlugins={[remarkGfm]}
        urlTransform={(url, key) => {
          return resolveMarkdownUrl({ filePath, key, owner, repo, url });
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
};
