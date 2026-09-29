export const PROGRESS_STEP_NAMES = ['tree', 'readme', 'skill', 'render'] as const;

export type ProgressStepName = (typeof PROGRESS_STEP_NAMES)[number];

export interface RepositoryContentPath {
  owner: string;
  path: string;
  repo: string;
}

class ProgressStepStore {
  private completedKeys: ReadonlySet<string> = new Set();
  private readonly listeners = new Set<() => void>();

  /**
   * 단계 키 생성
   *
   * @description
   * 트리 단계는 저장소 단위로 기록해, 같은 저장소 안에서 문서를 이동해도 완료 상태를 유지합니다. 나머지 단계는 문서 경로 단위로 기록합니다.
   */
  private generateStepKey = ({ owner, path, repo }: RepositoryContentPath, step: ProgressStepName): string => {
    if (step === 'tree') {
      return `${step}:${owner}/${repo}`;
    }

    return `${step}:${owner}/${repo}/${path}`;
  };

  complete = (contentPath: RepositoryContentPath, step: ProgressStepName) => {
    const key = this.generateStepKey(contentPath, step);

    if (this.completedKeys.has(key)) {
      return;
    }

    this.completedKeys = new Set(this.completedKeys).add(key);
    this.listeners.forEach((listener) => {
      listener();
    });
  };

  getCurrentStepName = (contentPath: RepositoryContentPath): ProgressStepName => {
    return (
      PROGRESS_STEP_NAMES.find((step) => {
        return !this.completedKeys.has(this.generateStepKey(contentPath, step));
      }) ?? 'render'
    );
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };
}

export default new ProgressStepStore();
