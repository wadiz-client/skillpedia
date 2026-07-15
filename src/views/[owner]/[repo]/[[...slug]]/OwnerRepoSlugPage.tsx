import { getRepositoryReadmeMarkdown, getRepositorySkillMarkdown } from '@/features/repository-markdown/api';
import { getRepositoryTreeNodes } from '@/features/repository-tree/api';

import { getBreadcrumbs, normalizeTitle, parseMarkdown } from './_lib';
import { Article } from './_ui/Article';
import type { ArticleTab } from './_ui/Article';
import { Empty } from './_ui/Empty';
import { Sidebar } from './_ui/Sidebar';

import styles from './OwnerRepoSlugPage.module.scss';

interface OwnerRepoSlugPageProps {
  owner: string;
  repo: string;
  slug: string[];
}

export const OwnerRepoSlugPage = async ({ owner, repo, slug }: OwnerRepoSlugPageProps) => {
  // 시스템 및 브라우저 예약어 제외 (favicon, .well-known 등)
  if (owner.startsWith('.') || owner === 'favicon.ico') {
    return null;
  }

  const navItems = await getRepositoryTreeNodes({ owner, repo });
  const path = slug.join('/');

  const [readmeMarkdownResult, skillMarkdownResult] = await Promise.allSettled([
    getRepositoryReadmeMarkdown({ owner, path, repo }),
    getRepositorySkillMarkdown({ owner, path, repo }),
  ]);

  const readmeMarkdown =
    readmeMarkdownResult.status === 'fulfilled'
      ? parseMarkdown(readmeMarkdownResult.value.content)
      : null;
  const skillMarkdown =
    skillMarkdownResult.status === 'fulfilled' && skillMarkdownResult.value
      ? parseMarkdown(skillMarkdownResult.value.content)
      : null;

  const folderName = path ? path.split('/').at(-1)! : repo;
  const breadcrumbs = getBreadcrumbs({ owner, repo, slug });

  // README와 SKILL이 모두 있으면 탭으로 전환할 수 있도록 탭 목록을 만듭니다.
  const tabs: ArticleTab[] = [];

  if (readmeMarkdown) {
    tabs.push({ content: readmeMarkdown.content, label: 'README' });
  }

  if (skillMarkdown) {
    tabs.push({ content: skillMarkdown.content, label: 'SKILL' });
  }

  // README의 표시 제목은 그대로 쓰고, 슬러그형 SKILL name·폴더명은 정규화합니다.
  const title = normalizeTitle(
    readmeMarkdown?.frontmatter.title,
    skillMarkdown?.frontmatter.name ?? folderName,
  );
  const description =
    readmeMarkdown?.frontmatter.description ?? skillMarkdown?.frontmatter.description;

  return (
    <div className={styles.container}>
      <Sidebar owner={owner} repo={repo} treeNodes={navItems} />

      {tabs.length > 0 ? (
        <Article breadcrumbs={breadcrumbs} description={description} tabs={tabs} title={title} />
      ) : (
        <Empty owner={owner} repo={repo} />
      )}
    </div>
  );
};
