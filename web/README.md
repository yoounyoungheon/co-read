# web Architecture

이 문서는 `co-read` 레포 안의 `web` 애플리케이션 구조를 정리합니다.

`web`은 Next.js App Router 기반 프론트엔드이며, 사용자에게 보이는 실제 화면, 공통 UI, feature UI, SSE/RTC 클라이언트 로직, Storybook 기반 컴포넌트 문서화를 함께 포함합니다.

## 개요

현재 `web`의 핵심 설계 원칙은 아래와 같습니다.

- App Router 기반 Server Component 중심 구조
- `shared`와 `feature`를 분리한 UI 레이어
- feature 내부에서 `API model -> domain model -> view model` 경계 분리
- 상위 page/layout은 서버에서 데이터를 준비하고, 하위 Client Component는 상호작용만 담당
- Storybook을 같은 경로에 유지하는 컴포넌트 문서화 패턴

즉 이 애플리케이션은 단순한 페이지 모음이 아니라, **서버 렌더링 중심의 화면 조합 구조 + feature 단위 데이터 경계 + 상호작용 모듈 분리**를 함께 갖춘 프론트엔드입니다.

## 디렉터리 구조

```text
web/
├─ src/
│  └─ app/
│     ├─ (routes)/
│     ├─ api/
│     ├─ feature/
│     ├─ shared/
│     ├─ utils/
│     ├─ layout.tsx
│     └─ page.tsx
├─ public/
├─ .storybook/
├─ scripts/
├─ AGENTS.md
└─ package.json
```

각 영역의 역할은 아래와 같습니다.

- `src/app/(routes)`
  - 실제 라우트 진입점
  - 예: `/project`, `/play-ground`
- `src/app/api`
  - Next.js route handler
  - articles, projects, resume, SSE streaming endpoint 포함
- `src/app/feature`
  - 도메인별 UI와 비즈니스 로직
  - 예: `article`, `profile`, `project`, `resume`, `play-ground`
- `src/app/shared`
  - 여러 feature에서 공통으로 사용하는 UI, SSE, RTC, 유틸리티
- `src/app/page.tsx`
  - 메인 페이지 서버 조합 레이어
- `src/app/layout.tsx`
  - 전체 레이아웃과 공통 프로필 영역 서버 조합 레이어

## 최상위 렌더링 구조

### 1. `layout.tsx`

`layout.tsx`는 Server Component로 유지되며, 공통 프로필 데이터를 서버에서 준비한 뒤 `Profile` UI에 전달합니다.

현재 흐름:

1. `loadProfileForGuestRequest()` 호출
2. `presentProfile()`로 `ProfileViewModel` 생성
3. `Profile` 컴포넌트에 props 전달
4. 하위 `children` 렌더링

즉 공통 헤더/프로필 영역도 UI가 직접 비즈니스 타입을 받지 않고, 서버에서 준비된 view model을 받는 구조입니다.

### 2. `page.tsx`

메인 페이지도 Server Component입니다.

현재 흐름:

1. query param에서 현재 탭 결정
2. 필요한 feature service만 서버에서 호출
3. service가 반환한 domain을 presenter가 view model로 변환
4. `MainShowcasePage`가 최종 UI 조합 수행

즉 메인 페이지의 데이터 흐름은 아래처럼 정리됩니다.

```text
page.tsx
  -> feature service
  -> domain data
  -> feature presenter
  -> view model
  -> MainShowcasePage
```

이 구조 덕분에 page는 서버 데이터 조합 책임을 가지되, 실제 화면 컴포넌트는 domain shape나 raw API shape를 직접 몰라도 됩니다.

## UI 레이어 구조

### `shared`

`shared`는 여러 화면에서 재사용되는 공통 모듈입니다.

예:

- `shared/ui`
  - 공통 atom / molecule / organism 성격의 UI
- `shared/sse`
  - 공통 SSE provider와 hook
- `shared/rtc`
  - 공통 RTC hook

여기에는 **도메인 전용 상태나 문구를 넣지 않는 것**이 원칙입니다.

### `feature`

`feature`는 실제 사용자 기능이나 화면 문맥을 담는 레이어입니다.

예:

- `feature/article`
- `feature/profile`
- `feature/project`
- `feature/resume`
- `feature/play-ground`

각 feature의 UI는 `feature/*/ui`에 두고, 공통 primitive가 필요하면 먼저 `shared/ui` 조합 가능성을 검토합니다.

## Feature 내부 구조

현재 `article`, `profile`, `project`, `resume`은 공통적으로 아래 구조를 따르도록 정리되어 있습니다.

```text
feature/<domain>/
├─ business/
│  ├─ <domain>.api-model.ts
│  ├─ <domain>.domain.ts
│  ├─ <domain>.mapper.ts
│  └─ <domain>.service.ts
├─ presentation/
│  ├─ <domain>.view-model.ts
│  └─ <domain>.presenter.ts
└─ ui/
   └─ ...
```

각 레이어의 책임은 아래와 같습니다.

### 1. `api-model`

서버 응답 계약 타입을 정의합니다.

- API payload shape를 표현
- UI에서 직접 사용하지 않음
- domain으로 변환되기 전의 외부 계약 레이어

### 2. `domain`

비즈니스 의미를 가진 내부 모델입니다.

- 화면과 무관한 데이터 의미를 표현
- 서비스 내부에서 사용하는 안정된 모델
- raw API 응답보다 내부 표현에 가깝게 유지

### 3. `mapper`

API model을 domain으로 변환합니다.

예:

- article raw JSON -> `Article`
- project 상세 응답 -> `Project`
- resume JSON -> `Resume`

### 4. `service`

fetch + 응답 상태 처리 + `api model -> domain` 변환을 담당합니다.

중요한 점은 service가 **UI props를 직접 만들지 않는다**는 것입니다.

즉 service의 책임은 여기까지입니다.

```text
fetch -> response status check -> api model -> domain
```

### 5. `view-model`

특정 UI가 바로 사용할 shape를 정의합니다.

예:

- `ArticleCardViewModel`
- `ProjectCardViewModel`
- `ProjectReviewViewModel`
- `ResumeTimeLineItemViewModel`
- `ProfileViewModel`

이는 domain과 같을 수도 있지만, 항상 같은 것은 아닙니다. UI에서 필요한 필드만 포함하고, 화면 친화적인 값으로 가공될 수 있습니다.

### 6. `presenter`

domain을 view model로 변환합니다.

즉 presenter는 다음 책임을 가집니다.

- UI에 필요한 필드만 추출
- UI 친화적인 형태로 가공
- domain 타입이 직접 UI로 새는 것을 막음

현재 메인 페이지와 프로젝트 상세 페이지는 이 presenter 레이어를 통해 UI용 데이터를 준비합니다.

### 7. `ui`

최종 렌더링 레이어입니다.

- 가능한 한 view model만 props로 받음
- fetch를 하지 않음
- API model을 모름
- domain을 직접 몰라도 되도록 유지

즉 UI는 데이터의 출처보다 **지금 화면에 무엇을 어떻게 보여줄지**에 집중하는 레이어입니다.

## 현재 주요 feature 구조

### `article`

- service가 article API를 호출
- mapper가 `ArticleApiModel[]`을 `Article[]`로 변환
- presenter가 `Article[]`을 `ArticleCardViewModel[]`로 변환
- `ArticleList`, `ArticleCard`는 view model만 렌더링

### `project`

- list / detail 모두 service에서 domain 반환
- presenter가 카드용 / 상세용 view model 생성
- `FeedGrid`, `FeedCard`, `ProjectReview`, `ProjectImageList`, `ProjectImageDetailDialog`는 view model 기반으로 렌더링

특히 상세 페이지는 아래 흐름을 따릅니다.

```text
(routes)/project/page.tsx
  -> loadProjectForGuestRequest()
  -> Project domain
  -> presentProjectReview()
  -> ProjectReview
```

### `resume`

- service가 resume API를 호출하고 `Resume` domain 생성
- presenter가 `ResumeTimeLineItemViewModel[]` 생성
- `TimeLine`은 이제 UI 내부 타입이 아니라 presentation view model을 사용

이 구조로 바뀌면서 기존의 `business -> ui` 역참조가 제거되었습니다.

### `profile`

- layout 서버 조합 레이어에서 service 호출
- presenter가 프로필 view model 생성
- `Profile` UI는 view model만 받음

### `play-ground`

`play-ground`는 다른 feature보다 상호작용성이 강한 실험/데모 성격의 영역입니다.

하위 서브도메인 예:

- `chat`
- `log`
- `code-gen`
- `rtc`
- `css-only`

이 영역은 일반 feature와 완전히 동일한 구조는 아니지만, 최소한 아래 원칙은 유지합니다.

- transport/event payload는 가능하면 UI 밖 타입 파일로 분리
- 공통 SSE lifecycle은 `shared/sse`에서 관리
- feature 전용 렌더링 상태는 feature 내부에 둠
- RTC처럼 `MediaStream` 중심 상태는 UI 인접 레이어에 유지 가능

현재 예:

- `play-ground/chat/types/model.ts`
  - 채팅 SSE 이벤트 타입
- `play-ground/log/types/model.ts`
  - 로그 스트리밍 이벤트 타입
- `ChatUI`
  - 채팅 전용 조합과 렌더링 상태 담당
- `BuildUI`
  - 로그 스트리밍 UI 담당

즉 `play-ground`는 **실험형 상호작용 feature 모음**이고, 일반 CRUD형 feature보다 UI 인접 상태가 더 많이 남아 있는 예외 레이어입니다.

## Server Component / Client Component 규칙

이 프로젝트는 Server Component를 기본값으로 봅니다.

### Server Component

다음 책임은 서버에 둡니다.

- 초기 데이터 조회
- 페이지 초기 렌더링
- layout 조합
- presenter 호출 전의 서버 데이터 준비

특히 아래 파일은 Server Component로 유지하는 것이 기본 원칙입니다.

- `page.tsx`
- `layout.tsx`

### Client Component

Client Component는 예외적으로만 사용합니다.

필요한 경우:

- `useState`, `useEffect`, `useRef` 등 hook 필요
- 브라우저 API 접근 필요
- 이벤트 처리 필요
- 모달, 폼, 스트리밍 UI, RTC 같은 상호작용 UI

현재 대표 Client Component 예:

- `feature/play-ground/chat/ui/ChatUI.tsx`
- `feature/play-ground/log/ui/BuildUI.tsx`
- `feature/project/ui/ProjectImageList.tsx`
- `feature/project/ui/ProjectImageDetailDialog.tsx`

핵심 원칙은 **서버에서 준비할 수 있는 것은 서버에서 준비하고, 상호작용이 필요한 최소 범위만 client로 내린다**는 것입니다.

## 공통 인프라 모듈

### `shared/sse`

공통 SSE 연결 lifecycle을 담당합니다.

핵심 역할:

- `EventSource` 인스턴스 관리
- `open`, `close`, `sseState`, `errorMessage` 제공
- handler 등록/해제와 safe cleanup 처리

이 레이어는 도메인 상태 저장소가 아니라 **연결 수명주기 인프라**입니다.

### `shared/rtc`

RTC 연결과 signaling 통신을 담당합니다.

핵심 역할:

- local / remote stream 관리
- peer connection lifecycle 관리
- SockJS + STOMP signaling 연동
- ICE candidate queue / flush 처리
- 화면 공유 시 `replaceTrack()` 처리

즉 `useRtc`는 일반적인 데이터 fetch 레이어가 아니라, 브라우저 미디어와 signaling 상태를 함께 다루는 특수한 클라이언트 인프라입니다.

## API / 스트리밍 경로

`src/app/api` 아래에는 브라우저가 직접 호출하는 route handler가 있습니다.

예:

- `/api/articles`
- `/api/projects`
- `/api/resume`
- `/api/streaming/chat`
- `/api/streaming/log`
- `/api/streaming/code-gen`

일반 데이터 API는 feature service의 입력이 되고, 스트리밍 API는 SSE 기반 Client Component의 이벤트 소스가 됩니다.

## Storybook과 문서화

이 프로젝트는 컴포넌트와 같은 경로에 story를 유지하는 패턴을 사용합니다.

예:

- `ui/Foo.tsx`
- `ui/Foo.stories.tsx`

관련 스크립트:

- `npm run storybook`
- `npm run build-storybook`
- `npm run storybook:index`
- `npm run build-components-docs`

즉 Storybook은 단순 시각 확인 도구가 아니라, feature/shared 컴포넌트의 문서화와 검증 흐름 일부로 사용됩니다.

## AGENTS.md와 MCP 관계

`web`은 사람만 읽는 코드베이스가 아니라, 에이전트 작업 규약도 함께 포함합니다.

핵심 구조:

- `web/AGENTS.md`
  - 항상 지켜야 할 짧은 전역 규칙
- `mcp/guidance/*`
  - 긴 구현 가이드
- `frontend-guidance-mcp`
  - 현재 작업에 필요한 guide만 선택해서 읽게 하는 계층

즉 이 프로젝트는 프론트엔드 구조뿐 아니라 **에이전트가 안전하게 작업할 수 있도록 문서 책임까지 분리한 구조**를 가지고 있습니다.

## 요청 흐름 예시

### 메인 페이지

```text
User Request
  -> page.tsx (Server)
  -> article/project/resume service
  -> domain data
  -> presenter
  -> MainShowcasePage
  -> feature UI
```

### 프로젝트 상세 페이지

```text
/project
  -> (routes)/project/page.tsx
  -> project.service
  -> Project domain
  -> project.presenter
  -> ProjectReview
```

### 채팅 스트리밍 플레이그라운드

```text
ChatUI (Client)
  -> useSSE open()
  -> /api/streaming/chat
  -> SSE event payload
  -> feature-local state update
  -> ChatLog / pairing cards render
```

### RTC 플레이그라운드

```text
RtcRoom (Client)
  -> useRtc()
  -> signaling server
  -> offer / answer / ICE exchange
  -> remoteStreams render
```

## 정리

현재 `web`의 핵심 아키텍처는 아래처럼 요약할 수 있습니다.

- App Router 기반 Server Component 중심 프론트엔드
- `shared`와 `feature`를 분리한 UI 구조
- feature 내부에서 `API model -> domain -> view model` 경계를 분리
- `page/layout`은 서버 조합, `ui`는 view model 렌더링에 집중
- SSE / RTC 같은 상호작용 인프라는 공통 모듈과 feature UI가 함께 책임 분담
- Storybook과 MCP 기반 가이드 체계까지 포함한 운영 가능한 프론트엔드 구조

즉 `web`은 단순히 화면을 그리는 프로젝트가 아니라, **서버 렌더링, 도메인 경계, 상호작용 인프라, 문서화 규약**이 함께 정리된 프론트엔드 작업 공간입니다.
