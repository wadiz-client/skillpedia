# Skillpedia

1. [소개](#소개)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [설치 및 실행](#설치-및-실행)
   1. [사전 설치](#사전-설치)
   2. [패키지 설치](#패키지-설치)
   3. [환경 변수 설정](#환경-변수-설정)
   4. [프로젝트 실행](#프로젝트-실행)
5. [빌드 및 배포](#빌드-및-배포)
   1. [빌드](#빌드)
   2. [배포](#배포)

## 소개

Skillpedia(스킬피디아)는 GitHub 저장소에 흩어진 SKILL.md 파일을 수집하여 구조화된 문서를 제공하는 것이 목적입니다. 개발자가 작성한 스킬 문서를 읽고 정확한 사용법을 파악할 수 있도록 합니다.

> "AI 에이전트가 도구를 정확하게 사용하려면 엔지니어가 작성한 검증된 지침서가 필요합니다. Skillpedia는 그 지침서를 가장 효율적으로 전달하는 통로가 됩니다."

## 기술 스택

| 구분            | 기술                                                 |
| --------------- | ---------------------------------------------------- |
| 언어            | TypeScript                                           |
| 프레임워크      | Next.js (App Router)                                 |
| UI 라이브러리   | @primer/react-brand, @primer/react                   |
| 스타일          | CSS Modules (SCSS)                                   |
| API 클라이언트  | Octokit (GitHub App)                                 |
| 마크다운 렌더링 | react-markdown (remark-gfm, rehype-raw, rehype-slug) |
| 프런트매터·목차 | gray-matter, marked, github-slugger                  |
| 코드 하이라이트 | react-syntax-highlighter                             |
| 패키지 관리     | NPM                                                  |

## 프로젝트 구조

Skillpedia는 확장성과 유지보수성을 위해 FSD(Feature-Sliced Design) 아키텍처를 따르며, Next.js App Router와의 충돌을 방지하기 위해 views 레이어를 사용합니다.

각 페이지에서만 쓰는 UI·로직은 해당 view 슬라이스 내부의 `_ui`, `_lib` 폴더에 둡니다.

```text
src/
├── app/        # 앱 설정, 프로바이더, 전역 스타일, 레이아웃, 라우트
├── views/      # 페이지 단위 컴포지션과 페이지 전용 UI·로직
│               #   (HomePage, OwnerRepoSlugPage + _ui: Article·Prose·CodeBlock·Sidebar·Toc, _lib: parseMarkdown 등)
├── widgets/    # 전역 레이아웃 블록 (Layout, Header, Content)
├── features/   # 사용자 상호작용 기능 (repository-markdown, repository-metadata, repository-tree)
└── shared/     # 공통 API 클라이언트·스타일 (github, breakpoint)
```

## 설치 및 실행

### 사전 설치

```shell
nvm install
```

### 패키지 설치

```shell
npm install
```

### 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하고 GitHub App 정보를 입력합니다.

```properties
APP_ID=
APP_PRIVATE_KEY=
```

### 프로젝트 실행

```shell
npm run dev
```

## 빌드 및 배포

### 빌드

```shell
npm run build
```

### 배포

GitHub 저장소의 `main` 브랜치에 변경 사항을 병합하면 Vercel을 통해 자동으로 배포를 진행합니다.

- [Vercel Dashboard](https://vercel.com/dashboard)
