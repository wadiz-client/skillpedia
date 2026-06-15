import { getRepoReadmeMarkdown, getRepoSkillMarkdown } from '@/features/repo-markdown';
import { getRepoTreeNodes } from '@/features/repo-tree';

import { getBreadcrumbs, normalizeTitle, parseMarkdown } from './_lib';

import { Article } from './_ui/Article';
import type { ArticleTab } from './_ui/Article';
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

  const navItems = await getRepoTreeNodes({ owner, repo });
  const path = slug.join('/');

  const [readmeMarkdownResult, skillMarkdownResult] = await Promise.allSettled([
    getRepoReadmeMarkdown({ owner, path, repo }),
    getRepoSkillMarkdown({ owner, path, repo }),
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

  const title = normalizeTitle(
    skillMarkdown?.frontmatter.name ?? readmeMarkdown?.frontmatter.title,
    folderName,
  );
  const description =
    readmeMarkdown?.frontmatter.description ?? skillMarkdown?.frontmatter.description;

  return (
    <div className={styles.container}>
      <Sidebar owner={owner} repo={repo} treeNodes={navItems} />

      {tabs.length > 0 ? (
        <Article breadcrumbs={breadcrumbs} description={description} tabs={tabs} title={title} />
      ) : (
        <div className={styles.error}>
          <h1>문서를 불러올 수 없습니다.</h1>
          <p>
            {owner}/{repo} 저장소에서 스킬 문서를 찾을 수 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};
