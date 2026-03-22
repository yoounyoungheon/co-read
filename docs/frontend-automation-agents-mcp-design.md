# 프론트엔드 자동화를 위한 AGENTS.md / MCP 분리 설계안

## 1. 문제 정의

현재 `web/AGENTS.md`는 에이전트 행동 규칙, 컴포넌트 생성 규칙, 스타일 원칙, Storybook 작성 규칙, 구현 판단 근거까지 한 문서에 함께 담고 있다.

이 구조는 다음 문제를 만든다.

- 에이전트가 문서 전체를 끝까지 읽지 못하거나 일부 규칙을 놓치기 쉽다.
- 규칙과 구현 방법이 한곳에 섞여 있어, 자주 바뀌는 구현 지침이 AGENTS.md를 계속 비대하게 만든다.
- 동일한 정책을 유지하면서도, 재사용 컴포넌트/도메인 컴포넌트/SSE 같은 주제별 구현 방법을 별도로 발전시키기 어렵다.

따라서 이 저장소의 프론트엔드 자동화 시스템은 다음 원칙으로 재설계해야 한다.

- `AGENTS.md`는 짧고 강한 정책 문서로 유지한다.
- 구현 방법, 예시, 검색 절차, 세부 API 사용법은 MCP를 통해 제공한다.
- Storybook 메타데이터와 기존 `docs/*.md`는 MCP가 참조하는 지식 원천으로 사용한다.

## 2. 현재 저장소 기준선

이 설계안은 아래 현재 상태를 전제로 한다.

- `web/AGENTS.md`
  - Server/Client Component 규칙
  - Feature UI 생성 위치와 Story 작성 규칙
  - `components.meta.json`을 지식 베이스로 삼는 원칙
  - 스타일 설계 및 디버깅 원칙
- `web/docs/storybook/components.meta.json`
  - `componentPath`, `storiesPath`, `argTypes`, `originalSources`를 포함한 컴포넌트 메타데이터 제공
  - `Button` 같은 shared UI와 `Feed`, `Profile` 같은 feature UI가 함께 포함됨
- `docs/use-sse.md`, `docs/use-chat.md`, `docs/stream.md`
  - SSE 연결 수명주기, 채팅 컨텍스트 책임, 스트리밍 이벤트 순서를 별도 문서로 설명함
- `docs/css-only-state.md`, `docs/markdown-viewer.md`
  - Server Component 유지, CSS-only 상호작용, SSR 우선 렌더링 같은 구현 판단 기준을 별도 문서로 설명함
- `mcp/src/index.ts`, `mcp/README.md`
  - 현재는 예제 수준의 MCP 서버 골격만 존재함

추가로 현재 문서에는 경로 불일치가 있다.

- `web/AGENTS.md`는 `docs/storybook/components.meta.json`을 기준 경로로 설명한다.
- 실제 메타 파일은 `web/docs/storybook/components.meta.json`에 존재한다.

이 차이는 이번 설계안에서 즉시 수정 대상으로 다루지 않더라도, MCP 설계 시 반드시 흡수해야 하는 현실 제약이다.

## 3. 목표와 비목표

### 목표

- 에이전트가 반드시 지켜야 할 정책을 `AGENTS.md`에서 빠르게 판단할 수 있게 한다.
- 재사용 컴포넌트, 도메인 컴포넌트, Story, SSE 같은 구현 지침을 MCP에서 주제별로 제공한다.
- 정책 문서와 구현 가이드의 변경 주기를 분리한다.
- 기존 `docs/*.md`와 Storybook 메타데이터를 폐기하지 않고 MCP의 지식 소스로 재사용한다.

### 비목표

- 이번 설계안은 shared/ui 구조 자체를 재설계하지 않는다.
- 이번 설계안은 Storybook 생성 시스템을 전면 교체하지 않는다.
- 이번 설계안은 현재 `mcp/`에 완성된 자동화 기능이 이미 존재한다고 가정하지 않는다.

## 4. 핵심 설계 원칙

이 시스템은 프론트엔드 자동화를 위한 정보를 세 층으로 나눈다.

### 4.1 Policy Layer: AGENTS.md

`AGENTS.md`는 에이전트의 행동 규칙만 담는다.

- 무엇을 해야 하는가
- 무엇을 하면 안 되는가
- 어느 레이어에 파일을 생성해야 하는가
- 언제 Server Component를 유지해야 하는가
- 언제 Story를 반드시 함께 만들어야 하는가

즉, `AGENTS.md`는 판단 규칙을 제공하고, 구체적 구현 절차는 설명하지 않는다.

### 4.2 Knowledge Layer: 구조화된 메타데이터

구조화된 지식은 메타데이터 파일이 담당한다.

- Storybook 컴포넌트 목록
- 컴포넌트 경로
- stories 경로
- props 시그니처
- 기존 사용 패턴

이 저장소에서는 `web/docs/storybook/components.meta.json`이 여기에 해당한다.

### 4.3 Guidance Layer: MCP 제공 구현 가이드

MCP는 에이전트가 특정 작업을 수행할 때 필요한 상세 지침을 반환한다.

- 재사용 컴포넌트 구현 지침
- 도메인 컴포넌트 구현 지침
- Story 작성 지침
- SSE 모듈 사용 지침
- CSS-only 상태 패턴 사용 지침
- Markdown Viewer 같은 SSR 우선 모듈 사용 지침

즉, 정책은 AGENTS.md에서 읽고, 실제 구현 방법은 MCP에서 조회하는 구조다.

## 5. AGENTS.md에 남길 내용

`AGENTS.md`에는 아래처럼 짧은 must/should/should not 중심 규칙만 남겨야 한다.

### 5.1 컴포넌트 실행 환경 규칙

- 모든 컴포넌트는 기본적으로 Server Component로 작성해야 한다.
- 상호작용이 필요한 경우에만 Client Component로 분리해야 한다.
- `page.tsx`, `layout.tsx`는 반드시 Server Component로 유지해야 한다.
- 넓은 범위의 `"use client"` 전환은 지양해야 한다.

### 5.2 컴포넌트 레이어 규칙

- 재사용 컴포넌트는 `shared/ui`에 위치해야 한다.
- 도메인 컴포넌트는 `feature/*/ui`에 위치해야 한다.
- 도메인 컴포넌트는 가능한 한 재사용 컴포넌트를 조합해 구현해야 한다.
- shared/ui 확장이 필요하면 feature 레이어에서 TODO로 필요 사항을 명시해야 한다.

### 5.3 Story 규칙

- 컴포넌트를 구현할 경우 반드시 같은 경로에 Story를 함께 작성해야 한다.
- Default Story는 반드시 포함해야 한다.
- 주요 상태 Story를 포함해야 한다.

### 5.4 금지 규칙

- 메타데이터에 없는 디자인 시스템 primitive를 임의로 가정하면 안 된다.
- shared/ui 구현 파일을 직접 수정하면 안 된다.
- Story 없이 컴포넌트를 생성하면 안 된다.
- 미완성 상태를 TODO 없이 숨기면 안 된다.

### 5.5 AGENTS.md 작성 원칙

- 한 항목은 1~3줄 이내의 짧은 규칙으로 유지한다.
- 설명보다 판단 문장을 우선한다.
- 예시는 최소화하고, 필요한 경우 MCP 문서 이름만 연결한다.
- 특정 API 사용법, props 예시, 세부 절차는 넣지 않는다.

## 6. MCP로 이동할 내용

구현 방법은 모두 MCP에서 주제별 문서 또는 도구 응답으로 제공한다.

### 6.1 재사용 컴포넌트 구현 지침

예: `재사용 컴포넌트 구현 지침.docs`

포함 내용:

- `shared/ui/atom`, `shared/ui/molecule` 구분 기준
- `components.meta.json` 조회 방법
- `argTypes`, `originalSources` 해석 방법
- Storybook 메타 작성 예시
- primitive를 새로 만들지 못하는 경우의 대응 방식

### 6.2 도메인 컴포넌트 구현 지침

예: `도메인 컴포넌트 구현 지침.docs`

포함 내용:

- `feature/*/ui` 배치 규칙의 실제 적용 예시
- shared UI를 조합해 feature props로 재설계하는 방법
- TODO가 필요한 경우의 작성 형식
- `Feed`, `Profile`, `ProjectReview`, `ChatUI` 같은 실제 패턴 참조

### 6.3 Story 작성 지침

포함 내용:

- `Meta`, `StoryObj` 작성 템플릿
- `args`, `argTypes`, `render` 구성 예시
- wrapper 사용 기준
- 도메인 Story와 shared Story의 차이

### 6.4 SSE 모듈 사용 지침

예: `sse 모듈 사용 지침.docs`

포함 내용:

- `docs/use-sse.md` 기반의 `open()`, `close()` 규칙
- 단일 연결 모델과 중복 `open()` 금지
- 종료 이벤트 처리 방식
- `docs/stream.md` 기반의 스트리밍 이벤트 순서

### 6.5 채팅/스트리밍 조합 지침

포함 내용:

- `useChat()`과 `useSSE()`의 책임 분리
- 공통 상태와 화면 전용 상태의 분리
- `receiveMessage()`와 `updateChat()` 사용 순서

### 6.6 CSS-only 상태 패턴 지침

포함 내용:

- 언제 CSS-only 패턴을 우선 검토해야 하는가
- 언제 Client Component로 승격해야 하는가
- `radio`, `checkbox`, `peer-checked` 예시

### 6.7 SSR 우선 모듈 지침

포함 내용:

- `docs/markdown-viewer.md` 같은 SSR 우선 구현 패턴
- `dangerouslySetInnerHTML` 회피 기준
- 조회 전용 UI에서 Client 전환을 최소화하는 판단 기준

## 7. 프론트엔드 자동화 시스템 동작 방식

에이전트는 아래 순서로 동작해야 한다.

### 7.1 1단계: AGENTS.md로 정책 판단

에이전트는 먼저 다음만 빠르게 판단한다.

- 이 작업이 shared/ui 대상인가, feature/ui 대상인가
- Server Component를 유지해야 하는가
- Story를 반드시 같이 생성해야 하는가
- 금지 규칙에 걸리는가

여기까지는 `AGENTS.md`만으로 결정한다.

### 7.2 2단계: 메타데이터 조회

그 다음 에이전트는 `components.meta.json`에서 다음 정보를 조회한다.

- 사용할 수 있는 컴포넌트 목록
- 실제 구현 경로
- stories 경로
- props 구조
- 기존 사용 패턴

### 7.3 3단계: MCP 가이드 조회

정책 판단과 메타데이터 조회가 끝나면, 작업 종류에 맞는 MCP 가이드를 가져온다.

- shared/ui 작업이면 재사용 컴포넌트 구현 지침 조회
- feature/ui 작업이면 도메인 컴포넌트 구현 지침 조회
- 스트리밍 작업이면 SSE/채팅 지침 조회
- 간단한 상호작용이면 CSS-only 상태 지침 조회

### 7.4 4단계: 구현 및 검증

에이전트는 MCP 가이드에 따라 구현한 뒤, 최소한 다음을 검증한다.

- 경로 규칙을 지켰는가
- Story를 함께 만들었는가
- shared/ui를 임의 수정하지 않았는가
- Server/Client 경계를 어기지 않았는가

## 8. 작업 유형별 예시

### 8.1 재사용 컴포넌트 작업

예: 버튼이나 입력 primitive를 찾아 조합해야 하는 경우

1. AGENTS.md에서 shared/ui 수정 가능 여부와 금지 규칙 확인
2. `components.meta.json`에서 `Button`, `TextInput`, `TextArea` 같은 primitive 확인
3. MCP의 재사용 컴포넌트 지침으로 Story 패턴과 `argTypes` 해석 방법 조회
4. 구현 또는 조합 가능 여부 판단

### 8.2 도메인 컴포넌트 작업

예: `feature/profile/ui` 또는 `feature/project/ui`에 새 UI를 추가하는 경우

1. AGENTS.md에서 생성 위치와 Story 의무 확인
2. 메타데이터에서 사용할 shared UI 조합 확인
3. MCP의 도메인 컴포넌트 지침으로 props 재설계 방식 조회
4. 같은 경로에 컴포넌트와 Story를 함께 구현

### 8.3 스트리밍 기능 작업

예: SSE 기반 채팅 또는 추천 UI를 만드는 경우

1. AGENTS.md에서 Client 전환이 필요한 최소 범위 판단
2. MCP의 SSE 모듈 사용 지침과 채팅 조합 지침 조회
3. `useSSE`, `useChat`, `/api/streaming/chat` 역할을 분리해서 구현
4. 종료 이벤트와 close 처리까지 검증

### 8.4 단순 상호작용 작업

예: 선택 카드, 토글, 아코디언 수준의 UI를 만드는 경우

1. AGENTS.md에서 Client Component가 반드시 필요한지 먼저 판단
2. MCP의 CSS-only 상태 지침 조회
3. CSS-only로 가능한 경우 Server Component 유지
4. 복잡한 상태 동기화가 필요할 때만 Client Component로 승격

## 9. MCP 인터페이스 설계 방향

현재 `mcp/src/index.ts`는 예제 도구만 등록한 골격이다.

프론트엔드 자동화 시스템으로 확장할 때는 아래 방향이 적절하다.

### 9.1 문서 조회형 도구

- `get_component_guideline`
- `get_feature_ui_guideline`
- `get_story_guideline`
- `get_sse_guideline`
- `get_css_only_state_guideline`

이 도구들은 짧은 정책이 아니라, 작업에 필요한 상세 구현 지침을 반환해야 한다.

### 9.2 메타 조회형 도구

- `search_components_meta`
- `get_component_examples`

이 도구들은 `web/docs/storybook/components.meta.json`을 읽고, 이름/경로/argTypes/originalSources를 조건별로 반환해야 한다.

### 9.3 작업 맥락 기반 라우팅

에이전트는 작업 종류에 따라 필요한 가이드만 요청해야 한다.

- 컴포넌트 생성 -> component/story guideline
- feature UI 생성 -> feature UI guideline
- 스트리밍 구현 -> SSE/chat guideline
- 단순 인터랙션 -> CSS-only guideline

핵심은 모든 지침을 한 번에 주입하지 않고, 작업 맥락에 맞는 가이드만 선택적으로 가져오는 것이다.

## 10. 단계적 적용 방안

### 10.1 1단계

- `AGENTS.md`를 정책 문서로 축약한다.
- 각 항목을 must/should/should not 형태의 짧은 규칙으로 재작성한다.

### 10.2 2단계

- 기존 `docs/use-sse.md`, `docs/use-chat.md`, `docs/stream.md`, `docs/css-only-state.md`, `docs/markdown-viewer.md`를 MCP 가이드 원천 문서로 분류한다.
- 주제별 문서 이름과 조회 기준을 정리한다.

### 10.3 3단계

- `mcp/`에 문서 조회 도구와 메타 조회 도구를 추가한다.
- 에이전트가 작업 시작 시 정책 -> 메타 -> MCP 가이드 순서로 조회하도록 연결한다.

### 10.4 4단계

- 실제 프론트엔드 자동화 작업에서 재사용 컴포넌트, 도메인 컴포넌트, SSE 작업 각각에 대해 누락률을 검증한다.
- AGENTS.md 누락이 줄고, 구현 가이드 조회가 일관되게 이루어지는지 확인한다.

## 11. 리스크와 대응

### 11.1 AGENTS.md와 MCP의 중복

정책과 가이드가 다시 중복되면 분리 효과가 사라진다.

대응:

- AGENTS.md는 판단 규칙만 유지한다.
- 절차, 예시, API 설명은 MCP로만 제공한다.

### 11.2 MCP가 최신 문서를 보지 못하는 문제

MCP가 오래된 문서를 참조하면 잘못된 구현을 유도할 수 있다.

대응:

- 문서 원천 경로를 명확히 관리한다.
- `components.meta.json`처럼 자동 생성되는 산출물은 조회 시점의 최신 파일을 읽게 한다.

### 11.3 메타데이터와 실제 구조의 차이

현재처럼 문서상 경로와 실제 경로가 다르면 에이전트 판단이 흔들릴 수 있다.

대응:

- MCP가 경로 alias 또는 실제 파일 위치를 흡수하도록 설계한다.
- 정책 문서에는 논리적 역할을 쓰고, 실제 파일 탐색은 MCP가 담당한다.

### 11.4 문서가 다시 서술적으로 비대해지는 문제

MCP 문서도 장기적으로 다시 길고 모호해질 수 있다.

대응:

- 문서 단위를 주제별로 분리한다.
- 각 가이드는 작업 유형 하나만 책임지게 한다.
- 절차형 체크리스트와 예시 중심으로 유지한다.

## 12. 수용 기준

이 설계가 적용되면 아래 조건을 만족해야 한다.

- 에이전트는 `AGENTS.md`만 읽고도 생성 위치, Story 의무, Server/Client 경계, 금지 규칙을 빠르게 판단할 수 있다.
- 재사용 컴포넌트, 도메인 컴포넌트, Story, SSE 관련 상세 구현법은 `AGENTS.md`가 아니라 MCP 조회 결과에서 얻는다.
- `components.meta.json`은 디자인 시스템과 기존 사용 패턴의 구조화된 지식 원천으로 유지된다.
- 기존 `docs/*.md`는 폐기되지 않고 MCP 가이드의 근거 문서로 재사용된다.
- 프론트엔드 자동화 작업에서 모든 지침을 한 번에 넣지 않고, 작업 맥락에 맞는 가이드만 선택적으로 조회한다.

## 13. 최종 제안

이 저장소에서 가장 적절한 구조는 다음과 같다.

- `AGENTS.md = 짧은 정책 문서`
- `components.meta.json = 구조화된 지식 베이스`
- `docs/*.md = MCP가 참조하는 구현 가이드 원천`
- `mcp/ = 작업 맥락별 가이드를 제공하는 전달 계층`

즉, AGENTS.md는 에이전트의 행동을 통제하고, MCP는 실제 구현 방법을 공급하는 구조로 역할을 분리해야 한다.

이 분리가 이루어져야 에이전트는 긴 작업 규약을 통째로 기억하려 하지 않고, 현재 작업에 필요한 구현 지침만 선택적으로 가져와 안정적으로 프론트엔드 자동화를 수행할 수 있다.
