import type { ProgressStepName, RepositoryContentPath } from './ProgressStepStore';

interface GetProgressStepPropsParams extends RepositoryContentPath {
  promise: Promise<unknown>;
  step: ProgressStepName;
}

export const getProgressStepProps = ({ promise, ...params }: GetProgressStepPropsParams) => {
  const settle = () => {
    return undefined;
  };

  return {
    ...params,
    promise: promise.then(settle, settle),
  };
};
