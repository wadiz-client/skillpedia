'use client';

import { useSyncExternalStore } from 'react';

import type { TocHeading } from './Toc';

class TocStore {
  private headings: TocHeading[] = [];
  private readonly listeners = new Set<() => void>();

  setHeadings = (headings: TocHeading[]) => {
    this.headings = headings;
    this.listeners.forEach((listener) => {
      listener();
    });
  };

  getHeadings = (): TocHeading[] => {
    return this.headings;
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };
}

const tocStore = new TocStore();

export const useTocHeadings = (): TocHeading[] => {
  return useSyncExternalStore(tocStore.subscribe, tocStore.getHeadings, tocStore.getHeadings);
};

export default tocStore;
