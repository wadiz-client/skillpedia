import { App, Octokit } from 'octokit';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

// 사내망처럼 프록시로만 외부에 나갈 수 있는 환경에서, 프록시가 지정되면 전역 디스패처로 설정합니다.
const proxyUrl = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;

if (proxyUrl) {
  setGlobalDispatcher(new ProxyAgent(proxyUrl));
}

let app: App | undefined;
let octokit: Octokit | undefined;

export const getRepositoryOctokit = async (owner: string, repo: string) => {
  // 빌드 시점 모듈 평가 오류를 방지할 수 있도록 런타임 시점에 인스턴스를 생성합니다.
  app ??= new App({
    appId: process.env.APP_ID!,
    privateKey: process.env.APP_PRIVATE_KEY!,
  });

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
    if (error instanceof Error && 'status' in error && (error as { status: number }).status === 404) {
      octokit ??= new Octokit({ auth: process.env.GITHUB_TOKEN });

      return octokit;
    }

    throw error;
  }
};
