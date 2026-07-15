import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { load } from 'js-yaml';

const getRepositoriesContent = (): string => {
  if (process.env.REPOSITORIES) {
    return process.env.REPOSITORIES;
  }

  const fileNames = ['repositories.json', 'repositories.yaml'];

  for (const fileName of fileNames) {
    const filePath = join(process.cwd(), fileName);

    if (existsSync(filePath)) {
      return readFileSync(filePath, 'utf8');
    }
  }

  return '';
};

export const getRepositories = (): string[] => {
  const content = getRepositoriesContent();

  if (!content) {
    return [];
  }

  return (load(content) || []) as string[];
};
