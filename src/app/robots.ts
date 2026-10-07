import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { MetadataRoute } from 'next';

import { load } from 'js-yaml';

import { routing } from '@/shared/i18n/routing';

const getRepositories = (): string[] => {
  const filePath = join(process.cwd(), 'repositories.yaml');
  const content = process.env.REPOSITORIES ?? (existsSync(filePath) ? readFileSync(filePath, 'utf8') : '');

  if (content === '') {
    return [];
  }

  return (load(content) || []) as string[];
};

export default function robots(): MetadataRoute.Robots {
  const repositories = getRepositories();

  const allow = [
    '/$',
    ...routing.locales.flatMap((locale) => {
      return [
        `/${locale}$`,
        ...repositories.flatMap((repository) => {
          return [`/${locale}/${repository}$`, `/${locale}/${repository}/`];
        }),
      ];
    }),
  ];

  return {
    rules: {
      allow,
      disallow: '/',
      userAgent: '*',
    },
  };
}
