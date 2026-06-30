import { App, Octokit } from 'octokit';

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export const getRepoOctokit = async (owner: string, repo: string) => {
  try {
    // App 권한(JWT)으로 해당 저장소에 앱이 설치된 정보를 가져옵니다.
    const { data: installation } = await app.octokit.rest.apps.getRepoInstallation({
      owner,
      repo,
    });

    // 찾아낸 Installation ID를 사용하여 해당 저장소에 접근 가능한 Octokit 인스턴스를 반환합니다.
    return await app.getInstallationOctokit(installation.id);
  } catch (error) {
    // 앱이 설치되지 않은 일반 저장소인 경우 공개 저장소에 접근 가능한 Octokit 인스턴스를 반환합니다.
    if (
      error instanceof Error &&
      'status' in error &&
      (error as { status: number }).status === 404
    ) {
      return octokit;
    }

    throw error;
  }
};

export const githubApp = app;
