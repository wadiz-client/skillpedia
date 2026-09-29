import { Suspense } from 'react';

import { getRepositoryReadmeMarkdown, getRepositorySkillMarkdown } from '@/features/repository-markdown/api';

import { OwnerRepoSlugLoadingPage } from './OwnerRepoSlugLoadingPage';
import { getProgressStepProps, ProgressStep } from './_ui';
import { OwnerRepoSlugContent } from './_ui/OwnerRepoSlugContent';

interface OwnerRepoSlugPageProps {
  owner: string;
  repo: string;
  slug: string[];
}

export const OwnerRepoSlugPage = ({ owner, repo, slug }: OwnerRepoSlugPageProps) => {
  // 시스템 및 브라우저 예약어 제외 (favicon, .well-known 등)
  if (owner.startsWith('.') || owner === 'favicon.ico') {
    return null;
  }

  const path = slug.join('/');
  const readmePromise = getRepositoryReadmeMarkdown({ owner, path, repo });
  const skillPromise = getRepositorySkillMarkdown({ owner, path, repo });

  return (
    <>
      <Suspense fallback={null}>
        <ProgressStep {...getProgressStepProps({ owner, path, promise: readmePromise, repo, step: 'readme' })} />
      </Suspense>

      <Suspense fallback={null}>
        <ProgressStep {...getProgressStepProps({ owner, path, promise: skillPromise, repo, step: 'skill' })} />
      </Suspense>

      <Suspense fallback={<OwnerRepoSlugLoadingPage />}>
        <OwnerRepoSlugContent
          owner={owner}
          readmePromise={readmePromise}
          repo={repo}
          skillPromise={skillPromise}
          slug={slug}
        />
      </Suspense>
    </>
  );
};
