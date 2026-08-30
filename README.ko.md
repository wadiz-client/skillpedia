<!-- 이 문서는 원본입니다. -->

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/images/hero_dark.jpg" />
  <img alt="Skillpedia 히어로" src="./public/images/hero_light.jpg" width="100%" />
</picture>

# Skillpedia

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vercel 배포](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

</div>

## 소개

Skillpedia(스킬피디아)는 개발자가 작성한 스킬 문서를 읽어, 사람과 AI 에이전트 모두가 도구의 정확하고 검증된 사용법을 파악할 수 있도록 합니다. 선별한 GitHub 저장소 목록에서 GitHub App API로 `SKILL.md` 파일을 수집하여 구조화된 페이지로 렌더링합니다.

> "AI 에이전트가 도구를 정확하게 사용하려면 엔지니어가 작성한 검증된 지침서가 필요합니다. Skillpedia는 그 지침서를 가장 효율적으로 전달하는 통로가 됩니다."

## 기술 스택

| 구분           | 기술                 |
| -------------- | -------------------- |
| 언어           | TypeScript           |
| 프레임워크     | Next.js (App Router) |
| UI 라이브러리  | GitHub Primer        |
| 스타일         | CSS Modules (SCSS)   |
| 다국어         | next-intl            |
| API 클라이언트 | Octokit (GitHub App) |

## 프로젝트 구조

Skillpedia는 확장성과 유지보수성을 위해 FSD(Feature-Sliced Design) 아키텍처를 따릅니다. Next.js App Router와 충돌하지 않도록 views 레이어를 사용합니다.

각 페이지에서만 쓰는 UI·로직은 해당 view 슬라이스 내부의 `_ui`, `_lib` 폴더에 둡니다.

```text
src/
├── app/        # 앱 설정, 프로바이더, 전역 스타일, 레이아웃, 라우트
├── views/      # 페이지 단위 컴포지션과 페이지 전용 UI·로직
│               #   (HomePage, OwnerRepoSlugPage + _ui: Article·Prose·CodeBlock·Sidebar·Toc, _lib: parseMarkdown 등)
├── widgets/    # 전역 레이아웃 블록 (Layout, Header, Content)
├── features/   # 사용자 상호작용 기능 (repository-markdown, repository-metadata, repository-tree)
└── shared/     # 공통 API 클라이언트·스타일·다국어 (github, breakpoint)
```

수집 대상 저장소 목록은 `repositories.yaml`에 정의합니다. 운영 환경인 경우 `REPOSITORIES` GitHub Actions 변수로 목록을 주입합니다.

## 설치 및 실행

자세한 내용은 [사내 인프라에 설치하기](./INSTALLATION.ko.md)를 참조하세요.

### 사전 설치

`.nvmrc`에 고정한 Node.js 버전을 설치합니다.

```shell
nvm install
```

### 패키지 설치

```shell
npm install
```

### 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 만들고 GitHub App 정보를 입력합니다.

```properties
APP_ID=
APP_PRIVATE_KEY=
```

### 프로젝트 실행

```shell
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 빌드

```shell
npm run build
```
