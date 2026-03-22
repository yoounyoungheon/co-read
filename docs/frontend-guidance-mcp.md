# 프론트엔드 에이전트 작업 규약 분리 설계안

## 배경

현재 `web/AGENTS.md`는 에이전트 행동 규칙, 컴포넌트 생성 절차, Storybook 작성 세부 규칙, 스타일 이론, SSE 관련 구현 지식이 한 파일에 함께 들어 있다.

이 구조는 다음 문제를 만든다.

- 에이전트가 반드시 지켜야 할 핵심 규약이 긴 설명 사이에 묻힌다.
- 구현 상세가 실제 코드와 드리프트되면 잘못된 지침을 따를 가능성이 높다.
- 요청 맥락과 무관한 설명까지 항상 읽게 되어 지침 소비 비용이 커진다.

이 문서는 `AGENTS.md`는 짧은 작업 규약만 유지하고, 구현 방법은 MCP를 통해 선택적으로 제공하는 프론트엔드 자동화 시스템 구조를 제안한다.

## 현재 코드베이스에서 확인한 사실

### 1. 레이어 구조는 이미 분리되어 있다

- 재사용 UI는 `web/src/app/shared/ui` 아래에 있다.
- 도메인 UI는 `web/src/app/feature/*/ui` 아래에 있다.
- Story 파일은 컴포넌트와 같은 경로에 함께 두는 패턴이 이미 널리 사용된다.
- SSE 공통 모듈은 `web/src/app/shared/sse` 아래에 분리되어 있다.

즉, 정책/가이드 분리 구조를 설계하기에 레포 구조가 이미 충분히 준비되어 있다.

### 2. 긴 구현 가이드는 이미 `docs`에 존재한다

- `docs/use-sse.md`
- `docs/use-chat.md`
- `docs/stream.md`
- `docs/markdown-viewer.md`

이 파일들은 AGENTS 성격보다는 구현 지식 문서에 가깝다.

### 3. 드리프트 위험이 실제로 존재한다

- `web/AGENTS.md`는 `docs/storybook/components.meta.json`을 기준 경로로 설명한다.
- 하지만 `web/package.json`의 `build-components-docs` 스크립트는 `storybook-static/components.meta.json`을 생성 대상으로 사용한다.
- `docs/stream.md`의 이벤트 설명은 실제 구현인 `web/src/app/api/streaming/chat/route.ts`와 다르다.
  - 문서는 `prepare`, `title`, `sub-title`, `image`, `description` 같은 이벤트를 설명한다.
  - 실제 코드는 기본 `data:` payload에 `START`, `PAIRING`, `FINISH` JSON을 싣고, comment heartbeat를 함께 보낸다.

따라서 상세 구현 지침을 `AGENTS.md`에 계속 넣는 방식은 유지보수 비용이 높고, 에이전트 오작동 위험도 크다.

## 목표

프론트엔드 개발 자동화 시스템을 다음 원칙으로 재구성한다.

- `AGENTS.md`는 짧은 행동 규칙만 담는다.
- 구현 방법은 MCP 가이드로 분리한다.
- 에이전트는 작업 맥락에 맞는 가이드만 선택적으로 읽는다.
- 가이드의 근거는 설명 문서가 아니라 실제 코드 경로와 생성 산출물에 연결한다.

## 핵심 설계 원칙

### 1. AGENTS.md는 정책 문서다

`AGENTS.md`에는 에이전트가 항상 기억해야 하는 전역 규칙만 남긴다.

예:

- Server Component를 기본값으로 사용해야 한다.
- `page.tsx`, `layout.tsx`는 Server Component로 유지해야 한다.
- 재사용 컴포넌트는 `shared/ui`에 위치해야 한다.
- 도메인 컴포넌트는 `feature/*/ui`에 위치해야 한다.
- 컴포넌트를 생성하면 같은 경로에 story를 함께 작성해야 한다.
- 도메인 컴포넌트는 재사용 컴포넌트를 조합해서 작성해야 한다.
- 모바일 우선, 가독성 우선 원칙을 지켜야 한다.

즉, AGENTS에는 must/should/should not 중심의 짧은 판단 규칙만 있어야 한다.

### 2. MCP는 구현 지식 제공 계층이다

MCP는 작업 종류에 따라 상세 구현 가이드를 선택해 제공한다.

예:

- 재사용 컴포넌트 구현 지침
- 도메인 컴포넌트 구현 지침
- SSE 모듈 사용 지침
- Story 작성 지침
- 스타일 디버깅 지침

즉, AGENTS가 "무엇을 지켜야 하는가"를 말한다면, MCP는 "어떻게 구현하는가"를 문맥별로 제공한다.

### 3. 가이드는 항상 선택적으로 읽혀야 한다

모든 작업에서 모든 가이드를 읽게 하면 다시 현재 문제로 돌아간다.

따라서 에이전트는 다음 순서를 따른다.

1. 먼저 `AGENTS.md`를 읽는다.
2. 작업 경로와 키워드를 기준으로 필요한 가이드를 찾는다.
3. 필요한 가이드만 MCP에서 불러온다.
4. 구현 후 관련 검증 절차를 수행한다.

## 문서 책임 분리안

### AGENTS.md에 남길 내용

아래처럼 짧은 규약만 유지한다.

#### 공통 컴포넌트 규약

- 재사용 컴포넌트는 `shared/ui`에 둬야 한다. (MUST)
- 재사용 컴포넌트는 아토믹 디자인 분류를 따라야 한다. (SHOULD)
- 재사용 컴포넌트 생성 또는 수정 시 story를 같은 경로에 유지해야 한다. (MUST)
- 재사용 컴포넌트에 도메인 전용 상태와 문구를 넣으면 안 된다. (MUST NOT)

#### 도메인 컴포넌트 규약

- 도메인 컴포넌트는 `feature/*/ui`에 둬야 한다. (MUST)
- 도메인 컴포넌트는 가능한 한 `shared/ui` 컴포넌트를 조합해서 작성해야 한다. (SHOULD)
- 도메인 컴포넌트 생성 시 story를 같은 경로에 함께 작성해야 한다. (MUST)
- 필요한 primitive가 없다고 해서 `shared/ui`를 임의로 확장하면 안 된다. (MUST NOT)

#### 렌더링 규약

- 기본은 Server Component여야 한다. (MUST)
- 상호작용이 필요한 최소 범위만 Client Component로 분리해야 한다. (SHOULD)
- `page.tsx`, `layout.tsx`는 Server Component로 유지해야 한다. (MUST)

#### 스타일 규약

- 모바일 우선으로 구현해야 한다. (MUST)
- 장식보다 가독성을 우선해야 한다. (MUST)
- 레이아웃 문제는 width/flow 관점으로 먼저 판단해야 한다. (SHOULD)

### MCP로 이동할 내용

아래 내용은 AGENTS에서 제거하고 MCP 가이드로 제공한다.

- `components.meta.json`의 필드 구조와 해석 방법
- Storybook 메타/argTypes/render 함수의 세부 작성법
- `originalSources` 활용법
- 스타일 이론 설명과 참고 링크
- SSE 연결 lifecycle 상세
- `useChat`와 `useSSE` 조합 방식
- 스트리밍 payload 포맷과 이벤트 예시

## 제안 아키텍처

### 1. 구성 요소

- `web/AGENTS.md`
  - 짧은 전역 정책 문서
- `docs/*.md`
  - 사람이 읽는 설계/설명 문서
- `mcp`
  - 에이전트가 작업 시점에 호출하는 가이드 제공 계층
- 생성 산출물
  - Storybook index
  - components metadata
  - 필요 시 guide registry metadata

### 2. MCP의 최소 역할

현재 `mcp/src/index.ts`는 예제 툴만 있으므로, 첫 단계에서는 아래 두 도구만 추가하면 된다.

#### `resolve_guides`

입력:

- `task`: 사용자의 작업 설명
- `targetPaths`: 현재 수정하려는 경로 목록

출력:

- 읽어야 할 guide id 목록
- 선택 이유
- 우선순위

예:

```json
{
  "guides": [
    {
      "id": "reusable-components",
      "reason": "target path is under shared/ui",
      "priority": "high"
    }
  ]
}
```

#### `read_guide`

입력:

- `id`

출력:

- 가이드 본문
- source path 목록
- 마지막 갱신 기준

이 두 도구만 있어도 "짧은 정책 + 선택형 구현 가이드" 구조를 시작할 수 있다.

### 3. Guide Registry 구조

MCP 내부에는 가이드 레지스트리를 둔다.

예시 필드:

```json
{
  "id": "sse-chat-streaming",
  "title": "SSE chat streaming guide",
  "triggers": {
    "paths": [
      "web/src/app/shared/sse/**",
      "web/src/app/feature/play-ground/chat/**",
      "web/src/app/api/streaming/chat/**"
    ],
    "keywords": ["sse", "useSSE", "EventSource", "stream", "chat"]
  },
  "sources": [
    "docs/use-sse.md",
    "docs/use-chat.md",
    "web/src/app/shared/sse/business/context/sseContext.tsx",
    "web/src/app/api/streaming/chat/route.ts"
  ]
}
```

중요한 점은 guide의 근거를 항상 source path로 함께 보관하는 것이다.
이렇게 해야 문서 설명이 아니라 실제 코드 기준으로 가이드를 검증할 수 있다.

## 1차 가이드 분리 제안

### 1. `reusable-components`

대상:

- `web/src/app/shared/ui/**/*.stories.tsx`
- `components.meta.json`

포함 내용:

- shared UI 분류 원칙
- atom/molecule 조합 방식
- public props 설계 방식
- story에서 확인해야 하는 상태
- `originalSources` 기반 팀 패턴 해석법

### 2. `domain-components`

대상:

- `web/src/app/feature/*/ui/**/*.tsx`
- `web/src/app/feature/*/ui/**/*.stories.tsx`

포함 내용:

- feature UI의 props 설계 원칙
- shared UI 조합 우선 원칙
- wrapper/render 패턴
- story에 도메인 상태를 드러내는 방법
- 미완성 상태를 TODO로 남기는 기준

초기에는 범용 `domain-components`로 시작하고, feature 규칙이 늘어나면 `domain-chat`, `domain-profile`, `domain-project`처럼 분리한다.

### 3. `sse-chat-streaming`

대상:

- `docs/use-sse.md`
- `docs/use-chat.md`
- `web/src/app/shared/sse/business/context/sseContext.tsx`
- `web/src/app/shared/sse/business/hook/useSSE.tsx`
- `web/src/app/api/streaming/chat/route.ts`

포함 내용:

- `useSSE`의 lifecycle
- `open`/`close` 호출 규칙
- `useChat`과 `infoPanel` 책임 분리
- 스트리밍 payload 처리 패턴
- `FINISH` 시 정리 규칙

주의:

이 가이드는 `docs/stream.md`만 단독 기준으로 만들면 안 된다. 반드시 실제 라우트 구현을 source에 포함해야 한다.

### 4. `storybook-authoring`

대상:

- shared/feature 전반의 `*.stories.tsx`
- `web/docs/storybook/index.json`

포함 내용:

- `Meta`, `StoryObj` 패턴
- `Default` 필수 규칙
- 주요 상태 스토리 구성 방식
- wrapper render 최소화 원칙

## 에이전트 동작 프로토콜

### Step 1. 전역 규약 확인

에이전트는 항상 `AGENTS.md`를 먼저 읽는다.

### Step 2. 작업 컨텍스트 분석

다음 정보를 추출한다.

- 사용자가 원하는 작업 종류
- 수정 대상 경로
- 관련 키워드

### Step 3. MCP 가이드 선택

에이전트는 `resolve_guides`를 호출해 필요한 guide id를 얻는다.

예:

- `shared/ui/button` 수정 -> `reusable-components`, `storybook-authoring`
- `feature/play-ground/chat/ui` 구현 -> `domain-components`, `storybook-authoring`, `sse-chat-streaming`
- SSE 버그 수정 -> `sse-chat-streaming`

### Step 4. 가이드 본문 로드

에이전트는 `read_guide`로 선택된 가이드만 읽는다.

### Step 5. 구현 및 검증

에이전트는 가이드를 그대로 복붙하는 것이 아니라, source file을 근거로 구현과 검증을 수행한다.

## 드리프트 방지 설계

이 설계에서 가장 중요한 부분은 "문서 분리"가 아니라 "문서와 코드의 동기화"다.

### 1. canonical source를 문서가 아니라 source path로 둔다

가이드는 설명 문서 자체만 바라보지 않고, 반드시 실제 구현 파일을 함께 source로 가진다.

예:

- SSE 가이드의 canonical source는 `web/src/app/api/streaming/chat/route.ts`와 `web/src/app/shared/sse/**`다.
- 컴포넌트 가이드의 canonical source는 Storybook 산출물과 실제 `*.stories.tsx`다.

### 2. 경로 불일치를 MCP에서 흡수한다

현재 `components.meta.json` 경로는 설명과 생성 스크립트 사이에 불일치가 있다.

- 설명: `docs/storybook/components.meta.json`
- 실제 빌드 스크립트 출력: `storybook-static/components.meta.json`

이 문제는 AGENTS에 경로를 하드코딩하지 말고, MCP registry가 실제 canonical source를 알고 있도록 설계하면 완화된다.

### 3. 상세 이벤트 포맷은 AGENTS에 넣지 않는다

SSE payload 형식처럼 바뀌기 쉬운 정보는 AGENTS에 두면 안 된다.
이 정보는 MCP guide 또는 코드 introspection 결과로 제공해야 한다.

## 권장 마이그레이션 순서

### Phase 1. AGENTS 축약

- `web/AGENTS.md`를 1~2 screen 분량의 짧은 규약으로 줄인다.
- 구현 절차, 스타일 이론, 세부 Storybook 규칙은 제거한다.

### Phase 2. Guide Registry 추가

- `mcp`에 `resolve_guides`, `read_guide`를 추가한다.
- guide metadata에 `id`, `triggers`, `sources`를 정의한다.

### Phase 3. 가이드 1차 이관

- `reusable-components`
- `domain-components`
- `sse-chat-streaming`
- `storybook-authoring`

### Phase 4. 드리프트 검증 자동화

가능하면 아래 검증을 추가한다.

- registry의 source path가 실제 존재하는지 검사
- components metadata 산출 경로 일관성 검사
- SSE 가이드가 참조하는 payload 예시가 현재 route 구현과 일치하는지 검사

## 기대 효과

- 에이전트가 핵심 규약을 놓칠 가능성이 줄어든다.
- 작업과 무관한 긴 설명을 읽지 않아도 된다.
- 구현 지침이 경로/도메인 기반으로 선택되어 정확도가 올라간다.
- 코드 변경으로 인한 문서 드리프트를 통제하기 쉬워진다.
- shared UI, feature UI, SSE 같은 현재 레포 구조와 자연스럽게 맞물린다.

## 결론

이 레포에서는 `AGENTS.md = 짧은 행동 규칙`, `MCP = 선택형 구현 지식` 구조가 가장 적합하다.

핵심은 AGENTS를 더 잘 쓰는 것이 아니라, AGENTS가 반드시 기억해야 할 규칙만 남기고 나머지는 경로/키워드 기반으로 필요한 순간에만 읽게 만드는 것이다.

즉, 앞으로의 기준은 다음과 같다.

- 정책은 `AGENTS.md`에 둔다.
- 구현 방법은 MCP guide로 둔다.
- guide는 항상 실제 source path를 근거로 제공한다.
- 에이전트는 작업 시작 시 필요한 guide만 선택해서 읽는다.
