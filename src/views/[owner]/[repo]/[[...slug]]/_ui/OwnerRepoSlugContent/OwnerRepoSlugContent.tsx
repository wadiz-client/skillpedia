import type {
  GetRepositoryReadmeMarkdownResponse,
  GetRepositorySkillMarkdownResponse,
} from '@/features/repository-markdown/api';
import { getRepositoryFileMetadata } from '@/features/repository-metadata/api';
import { checkIsPrivateRepository } from '@/shared/api/github';
import { normalizeTitle } from '@/shared/lib';

import { getBreadcrumbs, parseMarkdown } from '../../_lib';
import { Article } from '../Article';
import type { ArticleTab } from '../Article';
import { Empty } from '../Empty';
import { ScrollRestoration } from '../ScrollRestoration';

interface OwnerRepoSlugContentProps {
  owner: string;
  readmePromise: Promise<GetRepositoryReadmeMarkdownResponse | null>;
  repo: string;
  skillPromise: Promise<GetRepositorySkillMarkdownResponse | null>;
  slug: string[];
}

export const OwnerRepoSlugContent = async ({
  owner,
  readmePromise,
  repo,
  skillPromise,
  slug,
}: OwnerRepoSlugContentProps) => {
  const path = slug.join('/');

  const [readmeMarkdownResult, skillMarkdownResult, isPrivateRepositoryResult] = await Promise.allSettled([
    readmePromise,
    skillPromise,
    checkIsPrivateRepository(owner, repo),
  ]);

  const readme = readmeMarkdownResult.status === 'fulfilled' ? readmeMarkdownResult.value : null;
  const skill = skillMarkdownResult.status === 'fulfilled' ? skillMarkdownResult.value : null;

  // 공개 여부를 확인하지 못한 경우 이미지가 깨지지 않도록 비공개로 간주하고 중계 라우트를 사용합니다.
  const isPrivateRepository = isPrivateRepositoryResult.status === 'fulfilled' ? isPrivateRepositoryResult.value : true;

  const readmeMarkdown = readme ? parseMarkdown(readme.content) : null;
  const skillMarkdown = skill ? parseMarkdown(skill.content) : null;

  // 메타데이터는 본문 노출을 막지 않도록 조회를 기다리지 않고 프로미스를 탭에 담아 넘깁니다.
  const readmeMetadataPromise = readme ? getRepositoryFileMetadata({ filePath: readme.filePath, owner, repo }) : null;
  const skillMetadataPromise = skill ? getRepositoryFileMetadata({ filePath: skill.path, owner, repo }) : null;

  const folderName = path ? path.split('/').at(-1)! : repo;
  const breadcrumbs = getBreadcrumbs({ owner, repo, slug });

  // README와 SKILL이 모두 있으면 탭으로 전환할 수 있도록 탭 목록을 만듭니다.
  const tabs: ArticleTab[] = [];

  if (readme && readmeMarkdown) {
    tabs.push({
      content: readmeMarkdown.content,
      filePath: readme.filePath,
      label: 'README',
      metadataPromise: readmeMetadataPromise,
    });
  }

  if (skill && skillMarkdown) {
    tabs.push({
      content: skillMarkdown.content,
      filePath: skill.path,
      label: 'SKILL',
      metadataPromise: skillMetadataPromise,
    });
  }

  // README의 표시 제목은 그대로 쓰고, 슬러그형 SKILL name·폴더명은 정규화합니다.
  const title = normalizeTitle(readmeMarkdown?.frontmatter.title, skillMarkdown?.frontmatter.name ?? folderName);
  const description = readmeMarkdown?.frontmatter.description ?? skillMarkdown?.frontmatter.description;

  return (
    <>
      <ScrollRestoration />

      {tabs.length > 0 ? (
        <Article
          breadcrumbs={breadcrumbs}
          description={description}
          isPrivateRepository={isPrivateRepository}
          owner={owner}
          repo={repo}
          tabs={tabs}
          title={title}
        />
      ) : (
        <Empty
          owner={owner}
          repo={repo}
        />
      )}
    </>
  );
};
