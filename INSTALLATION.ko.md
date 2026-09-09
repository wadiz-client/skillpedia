<!-- 이 문서는 원본입니다. -->

# 사내 인프라에 설치하기

프라이빗 저장소의 `SKILL.md`를 사내 구성원에게 노출하는 설치 절차를 설명합니다. 로컬 개발 환경 구성은 [README](./README.ko.md)를 참조하세요.

## 사전 준비

설치를 시작하기 전에 다음을 준비합니다.

- `.nvmrc`에 고정한 Node.js 버전과 nvm
- GitHub 조직에서 GitHub App을 만들고 저장소에 설치할 수 있는 권한
- self-hosted 러너를 등록한 사내 서버

## GitHub App 만들기

Skillpedia는 GitHub App 권한으로 저장소의 `SKILL.md`를 읽습니다.

### 앱 생성

앱 생성 화면에서 앱을 만듭니다. 개인 계정은 `https://github.com/settings/apps/new`, 조직 계정은 `https://github.com/organizations/{organization}/settings/apps/new`입니다.

- **GitHub App name**에 조직 안에서 구분할 수 있는 이름을 입력합니다.
- **Homepage URL**에 배포 주소를 입력합니다. 배포 전인 경우 저장소 주소를 입력해도 됩니다.
- **Webhook**의 **Active** 체크를 해제합니다. Skillpedia는 웹훅을 사용하지 않습니다.

### 권한 설정

**Repository permissions**에서 다음 두 권한을 **Read-only**로 지정합니다.

| 권한     | 용도                                 |
| -------- | ------------------------------------ |
| Contents | 저장소의 `SKILL.md`와 문서 파일 조회 |
| Metadata | 저장소 기본 정보와 앱 설치 정보 조회 |

### 개인 키 발급

앱 설정 화면의 **Private keys**에서 **Generate a private key**를 클릭하여 `.pem` 파일을 내려받습니다. 발급한 키는 다시 내려받을 수 없으므로 안전한 곳에 보관하세요.

### 저장소에 앱 설치

**Install App**에서 조직을 선택하고 `SKILL.md`를 수집할 저장소를 지정합니다. 앱을 설치한 저장소만 프라이빗 문서를 조회할 수 있습니다.

## 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 만듭니다.

```shell
cp .env.local.example .env.local
```

```properties
APP_ID=
APP_PRIVATE_KEY=
```

- `APP_ID`에 앱 설정 화면의 **App ID**를 입력합니다.
- `APP_PRIVATE_KEY`에 내려받은 `.pem` 파일의 내용 전체를 큰따옴표로 감싸 입력합니다. 줄 바꿈을 포함한 여러 줄 값입니다.

다음 환경 변수는 필요한 경우에만 추가합니다.

| 환경 변수                   | 설명                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`              | 앱을 설치하지 않은 공개 저장소를 목록에 함께 노출하는 경우 사용                                                                       |
| `GTM_ID`                    | Google 태그 관리자로 데이터를 수집하는 경우 컨테이너 ID를 지정하며, production 모드에서만 적용 ([데이터 수집](./EVENT_TRACKER.ko.md)) |
| `SITE_URL`                  | 자체 호스팅하는 경우 배포 주소를 지정하며, 공유 카드 이미지 주소에 사용                                                               |
| `HTTPS_PROXY`, `HTTP_PROXY` | 프록시로만 외부에 나갈 수 있는 사내망인 경우 프록시 주소를 지정                                                                       |

## 저장소 목록 구성

`repositories.example.yaml` 파일을 복사하여 `repositories.yaml` 파일을 만들고, 수집할 저장소를 `{owner}/{repo}` 형식으로 작성합니다.

```shell
cp repositories.example.yaml repositories.yaml
```

```yaml
- aroundus/skillpedia
- anthropics/skills
```

운영 환경인 경우 같은 YAML 내용을 `REPOSITORIES` 환경 변수로 주입합니다. `REPOSITORIES` 환경 변수를 정의한 경우 `repositories.yaml` 파일을 읽지 않습니다.

## 실행

```shell
nvm install
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 배포

self-hosted 러너를 등록한 사내 서버에 pm2로 배포합니다.

먼저 `.github/workflows/templates/build-and-deploy.yml` 파일을 `.github/workflows` 폴더로 옮깁니다. 다음으로 저장소 설정의 **Secrets and variables**에서 워크플로가 사용하는 값을 등록합니다.

| 종류   | 이름                                                        |
| ------ | ----------------------------------------------------------- |
| 변수   | `APP_ID`, `GTM_ID`, `REPOSITORIES`                          |
| 시크릿 | `APP_PRIVATE_KEY`, `PAT`(공개 저장소 조회용 개인 접근 토큰) |

마지막으로 **Actions** 탭에서 **Build and deploy** 워크플로를 실행합니다. 러너가 `.env` 파일을 만들고 빌드한 다음 pm2로 3000 포트에 서비스를 올립니다.

## 문제 해결

### 저장소 목록을 빈 값으로 표시합니다

- `repositories.yaml` 파일이 저장소 루트에 있는지 확인하세요.
- `REPOSITORIES` 환경 변수를 빈 값으로 정의하지 않았는지 확인하세요. 환경 변수를 정의한 경우 값이 비어 있어도 `repositories.yaml` 파일을 읽지 않습니다.

### 프라이빗 저장소 문서를 404로 응답합니다

- 해당 저장소에 GitHub App을 설치했는지 확인하세요.
- 앱의 **Contents** 권한을 **Read-only**로 지정했는지 확인하세요.

### GitHub API 호출을 실패합니다

- 사내망인 경우 `HTTPS_PROXY` 또는 `HTTP_PROXY` 환경 변수를 설정했는지 확인하세요.
- 프록시 주소에 사용자 인증 정보가 필요한 경우 `http://{user}:{password}@{host}:{port}` 형식으로 입력했는지 확인하세요.

### APP_PRIVATE_KEY 파싱을 실패합니다

- `.pem` 파일의 `-----BEGIN RSA PRIVATE KEY-----`부터 `-----END RSA PRIVATE KEY-----`까지 전체를 입력했는지 확인하세요.
- 값 전체를 큰따옴표로 감쌌는지 확인하세요.
