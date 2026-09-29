'use client';

import { useSyncExternalStore } from 'react';

import ProgressStepStore from './ProgressStepStore';
import type { ProgressStepName, RepositoryContentPath } from './ProgressStepStore';

export const useCurrentProgressStepName = (contentPath: RepositoryContentPath): ProgressStepName => {
  const getSnapshot = () => {
    return ProgressStepStore.getCurrentStepName(contentPath);
  };

  return useSyncExternalStore(ProgressStepStore.subscribe, getSnapshot, getSnapshot);
};
