# Frontend Agent Policy

이 문서는 프론트엔드 작업에서 항상 지켜야 하는 전역 정책만 정의한다.
구현 상세는 `mcp`의 guide를 통해 선택적으로 읽는다.

## 작업 순서

1. 먼저 `web/AGENTS.md`를 읽는다.
2. 작업 설명과 수정 경로를 기준으로 MCP `resolve_guides`를 반드시 호출한다.
3. 필요한 guide id만 MCP `read_guide`로 읽는다.
4. guide가 가리키는 실제 source path를 근거로 구현하고 검증한다.

## MCP 필수 준수 사항

- 프론트엔드 작업은 예외 없이 구현 전에 반드시 MCP를 먼저 확인해야 한다. (MUST)
- 로컬 코드만으로 충분해 보여도 `resolve_guides` 호출을 생략하면 안 된다. (MUST NOT)
- `resolve_guides` 또는 필요한 `read_guide`를 수행하지 않았다면 구현, 수정, 리뷰, 리팩터링, 스토리 작성, 검증을 진행하면 안 된다. (MUST NOT)
- 사용자가 명시적으로 MCP 생략을 허용한 경우에만 예외를 둘 수 있다. (MUST)
- MCP 서버 실행 여부만으로 호출 가능하다고 간주하면 안 된다. 현재 세션에서 해당 MCP 도구가 실제로 노출되어 있고 호출 가능한지 기준으로 판단해야 한다. (MUST)
- 현재 세션에서 MCP 도구가 실제로 노출되어 있지 않거나 호출할 수 없다면 작업을 즉시 중단하고, MCP 호출이 불가능한 상태라는 사실을 사용자에게 먼저 알려야 한다. (MUST)
- 작업 시작 메시지 또는 최종 보고에는 아래 둘 중 하나를 반드시 남겨야 한다. (MUST)
  - 확인한 guide id 목록
  - 관련 guide가 없었다는 사실

## MCP 호출 정보

- MCP 서버: `frontend-guidance-mcp`
- `resolve_guides` 입력:
  - `task`: 사용자 작업 설명
  - `targetPaths`: 현재 수정하려는 경로 목록
- `read_guide` 입력:
  - `id`: 읽을 guide id

## 데이터 흐름 규약

- `business`, `presentation`, `page.tsx`, `layout.tsx`를 수정하거나 api-model, domain, service, presenter, view-model, UI props 경계를 건드리는 작업이면 `data-flow-layering` guide를 반드시 확인해야 한다. (MUST)
- service는 domain까지만 반환하고, presenter가 UI용 view model을 준비해야 한다. (MUST)
- business 레이어가 `feature/*/ui` 타입을 직접 import 하면 안 된다. (MUST NOT)
- UI 컴포넌트가 raw API 응답 타입을 직접 props로 받으면 안 된다. (MUST NOT)

## 공통 컴포넌트 규약

- 재사용 컴포넌트는 `src/app/shared/ui`에 둬야 한다. (MUST)
- 재사용 컴포넌트는 아토믹 디자인 분류를 따르는 편이 좋다. (SHOULD)
- 재사용 컴포넌트를 생성하거나 수정하면 같은 경로에 story를 유지해야 한다. (MUST)
- 재사용 컴포넌트에 도메인 전용 상태나 문구를 넣으면 안 된다. (MUST NOT)

## 도메인 컴포넌트 규약

- 도메인 컴포넌트는 `src/app/feature/*/ui`에 둬야 한다. (MUST)
- 도메인 컴포넌트는 가능한 한 `shared/ui` 컴포넌트를 조합해서 작성해야 한다. (SHOULD)
- 도메인 컴포넌트를 생성하면 같은 경로에 story를 함께 작성해야 한다. (MUST)
- 필요한 primitive가 없다고 해서 `shared/ui`를 임의로 확장하면 안 된다. (MUST NOT)

## 렌더링 규약

- 기본은 Server Component여야 한다. (MUST)
- 상호작용이 필요한 최소 범위만 Client Component로 분리해야 한다. (SHOULD)
- `page.tsx`, `layout.tsx`는 Server Component로 유지해야 한다. (MUST)
- 페이지 전체를 `"use client"`로 전환해서 문제를 해결하지 않는다. (SHOULD NOT)

## 스타일 규약

- 모바일 우선으로 구현해야 한다. (MUST)
- 장식보다 가독성을 우선해야 한다. (MUST)
- 레이아웃 문제는 width/flow 관점으로 먼저 판단해야 한다. (SHOULD)

## 금지 사항

- 작업과 무관한 모든 guide를 한 번에 읽지 않는다.
- 상세 Storybook 작성법, `components.meta.json` 해석법, SSE lifecycle 상세, 스트리밍 payload 예시를 이 문서에 다시 적지 않는다.
- 설명 문서만 근거로 구현하지 않는다. guide가 가리키는 실제 코드와 생성 산출물을 함께 확인해야 한다.
