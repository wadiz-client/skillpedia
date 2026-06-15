export interface Breadcrumb {
  href: string;
  label: string;
}

interface GetBreadcrumbsParams {
  owner: string;
  repo: string;
  slug: string[];
}

/**
 * slug 경로의 각 세그먼트로 브레드크럼 목록을 생성합니다.
 */
export const getBreadcrumbs = ({ owner, repo, slug }: GetBreadcrumbsParams): Breadcrumb[] => {
  const breadcrumbs: Breadcrumb[] = [];

  let path = '';

  for (const segment of slug) {
    path = path ? `${path}/${segment}` : segment;

    breadcrumbs.push({
      href: `/${owner}/${repo}/${path}`,
      label: segment.replace(/_/g, ' '),
    });
  }

  return breadcrumbs;
};
