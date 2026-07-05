import { headers } from 'next/headers';

import { HomePage } from '@/views/(home)/HomePage';
import { getRepoGroups } from '@/views/(home)/_lib';

export default async function Page() {
  const repoGroups = getRepoGroups();

  const headersList = await headers();
  const isPublicDomain = headersList.get('host') === 'skillpedia.vercel.app';

  return <HomePage isPublicDomain={isPublicDomain} repoGroups={repoGroups} />;
}
