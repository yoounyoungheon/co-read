# MCP와 이 프로젝트 온보딩 가이드

이 문서는 이 프로젝트에 처음 들어온 사람이 `MCP 서버가 무엇인지`, `이 저장소에서는 왜 MCP를 쓰는지`, `어떤 흐름으로 프론트엔드 작업을 진행하는지`를 이해할 수 있도록 정리한 학습 문서다.

특히 이 프로젝트에서는 MCP를 단순한 도구 호출 채널이 아니라, 프론트엔드 구현 지식을 선택적으로 읽기 위한 안내 시스템으로 사용한다.

## 1. 먼저 큰 그림부터 이해하기

이 저장소에는 프론트엔드 작업을 위한 두 계층이 있다.

- 전역 정책: `web/AGENTS.md`
- 상세 구현 가이드: `frontend-guidance-mcp`

의도는 단순하다.

- 모든 작업에서 항상 지켜야 하는 규칙은 짧게 유지한다.
- Storybook, Server Component, Client Component, SSE, 스타일링 같은 상세 구현 지식은 필요할 때만 읽는다.
- 필요할 때 읽는 상세 구현 지식을 MCP 서버가 라우팅해준다.

즉, 이 프로젝트에서 MCP는 "AI에게 새로운 능력을 붙이는 범용 서버"라기보다, "프론트엔드 구현 가이드를 상황에 맞게 선택해주는 지식 라우터"에 가깝다.

## 2. MCP가 무엇인가

MCP(Model Context Protocol)는 클라이언트와 외부 도구/서버가 정해진 형식으로 대화할 수 있게 해주는 프로토콜이다.

여기서 중요한 역할 구분은 세 가지다.

- MCP 클라이언트: Codex, Claude Desktop 같은 MCP를 사용할 수 있는 주체
- MCP 서버: 툴을 제공하는 프로세스
- MCP 툴: 서버가 실제로 노출하는 기능

이 프로젝트에 대입하면:

- MCP 서버: `mcp/`의 `frontend-guidance-mcp`
- 노출된 툴: `resolve_guides`, `read_guide`
- MCP 클라이언트: Codex 같은 에이전트나 stdio로 MCP를 실행할 수 있는 다른 클라이언트

즉, Codex를 쓰고 있어도 구조는 똑같다. 클라이언트가 다를 뿐 서버는 같다.

## 3. 이 프로젝트의 MCP 서버는 정확히 무엇을 하나

`mcp/src/index.ts`를 보면 이 서버는 두 개의 툴만 등록한다.

### `resolve_guides`

입력:

- `task`: 작업 설명
- `targetPaths`: 수정하려는 경로 목록

출력:

- 지금 읽어야 할 guide id 목록
- 왜 선택됐는지에 대한 reason
- 우선순위

이 툴은 "이번 작업에 어떤 문서를 읽어야 하는가"를 정한다.

### `read_guide`

입력:

- `id`: guide id

출력:

- guide 본문
- source path 목록
- canonical source path 목록
- source 파일 존재 여부
- 마지막 갱신 기준

이 툴은 "선택된 가이드의 실제 내용을 읽는다"는 역할을 한다.

## 4. 이 서버가 왜 필요한가

프론트엔드 구현 지식은 하나의 문서에 다 몰아넣으면 금방 무거워진다.

예를 들어 다음은 서로 성격이 다르다.

- 재사용 컴포넌트 규칙
- 도메인 컴포넌트 규칙
- Server Component / Client Component 판단 기준
- CSS-only 상태 패턴
- Storybook 작성 규칙
- SSE 스트리밍 처리 규칙
- 스타일 구현/디버깅 규칙

이걸 `AGENTS.md` 하나에 다 넣으면 다음 문제가 생긴다.

- 항상 읽어야 하는 규칙과 상황별 구현 지식이 섞인다.
- 작업과 무관한 정보까지 매번 읽게 된다.
- 구현이 바뀌었는데 문서가 늦게 갱신되면 드리프트가 생긴다.

그래서 이 프로젝트는:

- 정책은 `web/AGENTS.md`에 남기고
- 상세 가이드는 `mcp/guidance/*.md`로 분리하고
- 현재 작업에 맞는 것만 MCP가 선택하게 만들었다.

## 5. stdio 기반 MCP 연결이란 무엇인가

이 프로젝트의 MCP 서버는 `stdio` 방식으로 붙는다.

이 말은 HTTP 서버처럼 포트를 열어두는 방식이 아니라:

1. MCP 클라이언트가 서버 프로세스를 실행하고
2. 그 프로세스의 표준 입력/출력(`stdin` / `stdout`)으로 메시지를 주고받는다는 뜻이다.

이 저장소의 `mcp/README.md`에는 Claude Desktop 예시가 적혀 있지만, 개념상 Claude 전용이 아니다.

핵심은 아래 실행 정보다.

```json
{
  "mcpServers": {
    "frontend-guidance-mcp": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/Users/yun-yeongheon/dev/co-read/mcp"
    }
  }
}
```

의미는 다음과 같다.

- `command`: 어떤 명령으로 서버를 띄울지
- `args`: 그 명령에 어떤 인자를 줄지
- `cwd`: 어디서 실행할지

즉 MCP 클라이언트가 이 정보를 이용해 `mcp` 서버를 실행하고, 그 뒤 `resolve_guides`, `read_guide`를 호출하게 된다.

## 6. 이 프로젝트에서 실제 작업 흐름은 어떻게 되나

실제 권장 흐름은 `web/AGENTS.md`와 `mcp/GUIDE_MCP_USAGE.md`에 이미 정의돼 있다.

### Step 1. 전역 정책을 읽는다

먼저 `web/AGENTS.md`를 읽는다.

여기서 확인하는 건 예를 들어 이런 것들이다.

- 재사용 컴포넌트는 어디에 둬야 하는가
- 도메인 컴포넌트는 어디에 둬야 하는가
- Server Component를 기본으로 유지해야 하는가
- 스타일 구현에서 무엇을 우선해야 하는가

### Step 2. 필요한 가이드를 찾는다

다음으로 `resolve_guides`를 호출한다.

예를 들어:

```json
{
  "task": "Server Component를 유지하면서 peer-checked로 탭 상태를 구현한다",
  "targetPaths": ["web/src/app/home/ui/TabSection.tsx"]
}
```

이런 입력이 들어오면 현재 서버는 예를 들어 아래 같은 guide를 추천할 수 있다.

- `css-only-state`
- `style-implementation`
- `rsc-rendering`

### Step 3. 필요한 가이드만 읽는다

그다음 `read_guide`로 필요한 id만 읽는다.

예를 들어:

- `read_guide("css-only-state")`
- `read_guide("rsc-rendering")`

이렇게 하면 해당 guide의 요약만 오는 것이 아니라, 원문 markdown과 source path 정보도 함께 확인할 수 있다.

### Step 4. 실제 source path를 근거로 구현한다

이 프로젝트의 중요한 원칙은 "문서를 읽고 끝내지 않는다"는 점이다.

`read_guide`는 관련 source path를 같이 주기 때문에, 구현 단계에서는 반드시 실제 코드나 생성 산출물을 다시 확인해야 한다.

즉 흐름은:

```text
정책 읽기
-> guide 선택
-> guide 읽기
-> 실제 source path 읽기
-> 구현
-> 검증
```

## 7. guides.ts는 어떻게 동작하나

핵심 로직은 `mcp/src/guides.ts`에 있다.

각 guide는 대략 아래 구조를 가진다.

- `id`: guide 이름
- `summary`: 짧은 요약
- `triggers.paths`: 어떤 경로 작업에서 relevant한지
- `triggers.keywords`: 어떤 키워드가 들어오면 relevant한지
- `sources`: 관련 문서와 코드 경로
- `canonicalSources`: freshness 판단의 기준이 되는 핵심 경로
- `guideFiles`: 실제 markdown 원문 파일
- `body`: 짧은 inline 설명

현재 등록된 주요 가이드는 다음과 같다.

- `reusable-components`
- `domain-components`
- `rsc-rendering`
- `rcc-rendering`
- `css-only-state`
- `sse-chat-streaming`
- `storybook-authoring`
- `style-implementation`

이 구조를 이해하면, 새 가이드를 추가하거나 왜 특정 guide가 추천됐는지 읽는 것이 쉬워진다.

## 8. 이 프로젝트에서 "studio"는 무엇으로 이해하면 되나

이 저장소 안에는 `studio`라는 이름의 별도 디렉터리나 툴은 명시적으로 보이지 않는다.

대신 온보딩 관점에서 가장 가까운 개념은 Storybook 기반의 컴포넌트 문서화/데모 환경이다. 근거는 `web/package.json`에 있다.

- `storybook`: `storybook dev -p 6006`
- `storybook:index`: `storybook index -o ./docs/storybook/index.json -c ./.storybook`
- `build-storybook`
- `build-components-docs`

즉, 만약 당신이 말한 `studio`가 "컴포넌트를 보고 조작하고 문서화하는 UI 환경"을 뜻했다면, 이 프로젝트에서는 사실상 Storybook을 먼저 이해하면 된다.

온보딩 시에는 아래 정도를 알면 충분하다.

- Storybook은 컴포넌트를 앱 전체 문맥 없이 독립적으로 확인하는 환경이다.
- shared UI와 feature UI 모두 story를 유지하는 규칙이 있다.
- `storybook-authoring` 가이드는 Storybook 파일 작성 규칙을 설명한다.
- `web/docs/storybook/index.json`과 `web/docs/storybook/components.meta.json`은 가이드 근거로도 사용된다.

## 9. 처음 배우는 사람이 꼭 이해해야 할 개념 묶음

이 프로젝트를 빠르게 온보딩하려면 아래 순서로 학습하는 것이 좋다.

### 1단계. MCP 기본 개념

- MCP 클라이언트 / 서버 / 툴의 구분
- stdio 연결 방식
- `resolve_guides`와 `read_guide`의 역할 차이

### 2단계. 이 프로젝트의 프론트엔드 정책

- `web/AGENTS.md`
- shared UI와 feature UI 구분
- Server Component 우선 원칙
- 스타일 구현 기본 원칙

### 3단계. 상세 가이드 체계

- `mcp/guidance/RSC-guide.md`
- `mcp/guidance/RCC-guide.md`
- `mcp/guidance/css-only-state.md`
- `mcp/guidance/story-guide.md`
- `mcp/guidance/style-guide.md`
- `mcp/guidance/use-sse.md`
- `mcp/guidance/use-chat.md`
- `mcp/guidance/stream.md`

### 4단계. Storybook과 문서 산출물

- `web/package.json`의 Storybook scripts
- `web/docs/storybook/index.json`
- `web/docs/storybook/components.meta.json`

### 5단계. 실제 코드 근거 읽기

- `mcp/src/index.ts`
- `mcp/src/guides.ts`
- `web/src/app/shared/ui/**`
- `web/src/app/feature/*/ui/**`
- `web/src/app/shared/sse/**`
- `web/src/app/api/streaming/chat/route.ts`

## 10. 바로 실습해볼 수 있는 추천 순서

### 실습 A. MCP 서버 실행

```bash
cd mcp
npm install
npm run build
npm run start
```

목표:

- MCP 서버가 어떤 방식으로 실행되는지 감 잡기

### 실습 B. 가이드 선택 시나리오 생각해보기

예시 작업:

- "shared/ui button story를 수정한다"
- "page.tsx는 Server Component로 유지하면서 탭 UI를 만든다"
- "채팅 SSE payload 처리 버그를 수정한다"

목표:

- 어떤 guide id가 선택될지 예측해보기

### 실습 C. Storybook 실행

```bash
cd web
npm install
npm run storybook
```

목표:

- 이 프로젝트에서 컴포넌트 문서화 환경이 어떻게 쓰이는지 이해하기

### 실습 D. guide와 실제 소스 연결해보기

예를 들어 `sse-chat-streaming`을 읽었다면 아래도 같이 본다.

- `mcp/guidance/use-sse.md`
- `mcp/guidance/use-chat.md`
- `web/src/app/shared/sse/business/hook/useSSE.tsx`
- `web/src/app/api/streaming/chat/route.ts`

목표:

- 문서와 실제 구현이 어떻게 연결되는지 이해하기

## 11. 자주 헷갈리는 포인트

### 1. MCP 서버가 곧 AI는 아니다

MCP 서버는 가이드와 툴을 제공하는 프로세스다. 생각하고 판단하는 주체는 MCP 클라이언트 쪽 에이전트다.

### 2. `AGENTS.md`가 모든 걸 설명하지 않는다

이 프로젝트는 의도적으로 `AGENTS.md`를 짧게 유지한다. 구현 상세는 `mcp/guidance/*.md`와 실제 코드에 있다.

### 3. `read_guide` 결과가 끝이 아니다

가이드를 읽고 바로 구현하지 말고, 응답에 포함된 source path를 다시 읽어야 한다.

### 4. Storybook은 단순 데모가 아니라 근거 데이터이기도 하다

이 프로젝트에서는 Storybook story와 index/meta 산출물이 가이드의 근거 경로로도 사용된다.

## 12. 추천 학습 체크리스트

이 문서를 다 읽은 뒤 아래 질문에 답할 수 있으면 온보딩 1차는 끝난 것이다.

- MCP 클라이언트와 MCP 서버의 차이를 설명할 수 있는가?
- 왜 `web/AGENTS.md`와 `mcp/guidance/*.md`를 분리했는지 설명할 수 있는가?
- `resolve_guides`와 `read_guide`의 차이를 설명할 수 있는가?
- 왜 guide를 읽은 뒤 실제 source path를 다시 봐야 하는지 설명할 수 있는가?
- Server Component, Client Component, CSS-only state, Storybook guide가 각각 어떤 역할인지 구분할 수 있는가?
- 이 프로젝트에서 "studio"에 가까운 개념이 Storybook이라는 점을 이해했는가?

## 13. 최소 읽기 순서 요약

정말 빠르게 시작하려면 아래 순서만 읽어도 된다.

1. `web/AGENTS.md`
2. `mcp/README.md`
3. `mcp/GUIDE_MCP_USAGE.md`
4. `mcp/src/index.ts`
5. `mcp/src/guides.ts`
6. 필요한 `mcp/guidance/*.md`

그다음부터는 현재 작업에 맞는 guide만 읽으면 된다.
