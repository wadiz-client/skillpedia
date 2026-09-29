'use client';

import { use, useEffect } from 'react';

import ProgressStepStore from './ProgressStepStore';
import type { ProgressStepName, RepositoryContentPath } from './ProgressStepStore';

interface ProgressStepProps extends RepositoryContentPath {
  promise: Promise<void>;
  step: ProgressStepName;
}

export const ProgressStep = ({ owner, path, promise, repo, step }: ProgressStepProps) => {
  use(promise);

  useEffect(() => {
    ProgressStepStore.complete({ owner, path, repo }, step);
  }, [owner, path, repo, step]);

  return null;
};
