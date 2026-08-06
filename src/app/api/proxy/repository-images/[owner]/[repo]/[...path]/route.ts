import { getRepositoryOctokit } from '@/shared/api/github';

const CONTENT_TYPES: Record<string, string | undefined> = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

const CACHE_CONTROL = 'public, max-age=3600';

interface RouteContext {
  params: Promise<{ owner: string; path: string[]; repo: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { owner, path, repo } = await params;
  const filePath = path.join('/');
  const extension = filePath.split('.').at(-1)?.toLowerCase() ?? '';
  const contentType = CONTENT_TYPES[extension];

  if (contentType === undefined) {
    return new Response(null, { status: 404 });
  }

  try {
    const octokit = await getRepositoryOctokit(owner, repo);

    // 본문을 문자열로 해석하면 이진 이미지가 깨지므로 해석을 끄고 스트림 그대로 받습니다.
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      headers: { accept: 'application/vnd.github.raw' },
      owner,
      path: filePath,
      repo,
      request: { parseSuccessResponseBody: false },
    });

    // 이 옵션은 실행 시점 반환 값만 스트림으로 바꾸고 선언된 타입은 그대로 두어 변환이 필요합니다.
    return new Response(data as unknown as ReadableStream, {
      headers: { 'Cache-Control': CACHE_CONTROL, 'Content-Type': contentType },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
