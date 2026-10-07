// GitHub API 응답을 1시간 동안 재사용해 페이지 진입 시 왕복이 반복되지 않도록 합니다.
export const GITHUB_REVALIDATE_SECONDS = 3600;

// 저장소 단위로 캐시를 무효화할 수 있도록 태그를 만듭니다.
export const getRepositoryCacheTag = (owner: string, repo: string): string => {
  return `repository:${owner}/${repo}`;
};
