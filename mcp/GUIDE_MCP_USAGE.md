# frontend-guidance-mcp Usage

`frontend-guidance-mcp` 패키지는 프론트엔드 작업용 지침 전용 MCP 서버입니다.

이 서버의 목적은 `web/AGENTS.md`에 남겨둘 짧은 정책과 분리해서, 작업 맥락에 맞는 구현 가이드만 선택적으로 읽게 만드는 것입니다.

## 포함된 툴

- `resolve_guides`
  - 입력: `task`, `targetPaths`
  - 출력: 지금 읽어야 할 guide id 목록, 선택 이유, 우선순위
- `read_guide`
  - 입력: `id`
  - 출력: 가이드 본문, source path 목록, source 존재 여부, 마지막 갱신 기준

현재 등록된 guide id:

- `reusable-components`
- `domain-components`
- `rsc-rendering`
- `rcc-rendering`
- `css-only-state`
- `sse-chat-streaming`
- `rtc-signaling`
- `storybook-authoring`
- `style-implementation`

## 동작 원리

1. 호출 주체는 먼저 `web/AGENTS.md`를 읽어 전역 정책을 확인합니다.
2. 작업 설명과 수정 경로를 준비합니다.
3. `resolve_guides`로 필요한 guide id를 고릅니다.
4. 선택된 id만 `read_guide`로 읽습니다.
5. 구현과 검증은 guide가 가리키는 실제 source path를 근거로 수행합니다.

이 서버는 모든 가이드를 한 번에 주지 않습니다. 경로 매칭과 키워드 매칭을 같이 사용해서 필요한 가이드만 고르도록 설계되어 있습니다.

`targetPaths`는 `web/...` 같은 레포 상대 경로를 넣어도 되고, 워크스페이스 절대 경로를 넣어도 됩니다. 서버 내부에서 레포 상대 경로로 정규화한 뒤 guide trigger와 비교합니다.

## 실행 방법

```bash
cd mcp
npm install
npm run build
node dist/index.js
```

직접 `node`로 실행할 때는 엔트리 파일이 `dist/index.js`이므로, 먼저 빌드가 필요합니다.

개발 중에도 `npm run start` 대신 아래처럼 직접 실행할 수 있습니다.

```bash
cd mcp
npm run build
node dist/index.js
```

## stdio 기반 MCP 클라이언트 연결 예시

이 서버는 특정 AI agent나 특정 클라이언트 전용이 아닙니다. `stdio` 방식으로 MCP 서버를 실행할 수 있는 클라이언트라면 같은 방식으로 연결할 수 있습니다.

### Claude Desktop 예시

아래는 Claude Desktop에서 많이 쓰는 `mcpServers` 형식의 예시입니다.

```json
{
  "mcpServers": {
    "frontend-guidance-mcp": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/Users/yun-yeongheon/dev/co-read/mcp"
    }
  }
}
```

이 패키지의 소스 엔트리는 TypeScript(`src/index.ts`)이므로, `node`로 직접 실행할 때는 빌드 후 `dist/index.js`를 실행하는 방식이 가장 안전합니다.

### Codex에서 사용하려면

Codex CLI에서 이 MCP를 사용하려면 사용자 설정 파일 `~/.codex/config.toml`에 서버를 등록해야 합니다.

```toml
[mcp_servers.frontend-guidance-mcp]
command = "node"
args = ["dist/index.js"]
cwd = "/Users/yun-yeongheon/dev/co-read/mcp"
```

설정을 추가한 뒤에는 Codex를 다시 시작해야 새 세션에서 MCP가 연결됩니다.

### OpenCode 예시

OpenCode에서는 `opencode.json` 또는 `~/.config/opencode/opencode.json`의 `mcp` 필드에 로컬 MCP 서버를 등록합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "frontend-guidance-mcp": {
      "type": "local",
      "command": ["node", "dist/index.js"],
      "enabled": true,
      "environment": {
        "PWD": "/Users/yun-yeongheon/dev/co-read/mcp"
      }
    }
  }
}
```

다만 이 서버는 `cwd`가 필요하므로, OpenCode에서 실행 디렉터리를 별도로 지정할 수 없다면 아래처럼 절대 경로로 시작 커맨드를 감싼 런처 스크립트를 두는 편이 안전합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "frontend-guidance-mcp": {
      "type": "local",
      "command": [
        "zsh",
        "-lc",
        "cd /Users/yun-yeongheon/dev/co-read/mcp && node dist/index.js"
      ],
      "enabled": true
    }
  }
}
```

### OpenCode 작업 지시문에 함께 넣을 운영 규칙

OpenCode가 이 MCP를 더 적극적으로 활용하게 하려면, 세션 프롬프트나 작업 지시문에 아래 운영 규칙을 함께 넣는 편이 좋습니다.

#### Search mode

```text
[search-mode]
MAXIMIZE SEARCH EFFORT. Launch multiple background agents IN PARALLEL:
- explore agents (codebase patterns, file structures, ast-grep)
- librarian agents (remote repos, official docs, GitHub examples)
Plus direct tools: Grep, ripgrep (rg), ast-grep (sg)
NEVER stop at first result - be exhaustive.
```

의도:

- 내부 코드베이스 탐색과 외부 레퍼런스 수집을 동시에 강제합니다.
- 첫 검색 결과만 보고 멈추지 않도록 해서, 가이드 선택이나 구현 근거를 더 넓게 확보하게 합니다.

#### Analyze mode

```text
[analyze-mode]
ANALYSIS MODE. Gather context before diving deep:
CONTEXT GATHERING (parallel):
- 1-2 explore agents (codebase patterns, implementations)
- 1-2 librarian agents (if external library involved)
- Direct tools: Grep, AST-grep, LSP for targeted searches

IF COMPLEX - DO NOT STRUGGLE ALONE. Consult specialists:
- **Oracle**: Conventional problems (architecture, debugging, complex logic)
- **Artistry**: Non-conventional problems (different approach needed)

SYNTHESIZE findings before proceeding.
```

의도:

- 바로 수정에 들어가지 않고 먼저 맥락을 수집하게 만듭니다.
- 외부 라이브러리, 구조 변경, 복잡한 디버깅처럼 혼자 판단하면 위험한 상황에서 추가 전문 에이전트 사용을 유도합니다.

#### delegate_task 호출 규칙

```text
MANDATORY delegate_task params: ALWAYS include load_skills=[] and run_in_background when calling delegate_task.
Example: delegate_task(subagent_type="explore", prompt="...", run_in_background=true, load_skills=[])
```

의도:

- 위임 호출 시 필수 파라미터 누락을 방지합니다.
- 특히 백그라운드 탐색 작업을 병렬화할 때 호출 형식을 일관되게 유지하는 데 도움이 됩니다.

#### 함께 붙여 넣는 예시

아래처럼 OpenCode에 작업을 줄 때 MCP 사용 설명과 운영 규칙을 한 번에 넣을 수 있습니다.

```text
Use frontend-guidance-mcp when the task touches frontend implementation guidance.
First resolve relevant guides from the task and target paths, then read only the selected guides.

[search-mode]
MAXIMIZE SEARCH EFFORT. Launch multiple background agents IN PARALLEL:
- explore agents (codebase patterns, file structures, ast-grep)
- librarian agents (remote repos, official docs, GitHub examples)
Plus direct tools: Grep, ripgrep (rg), ast-grep (sg)
NEVER stop at first result - be exhaustive.

[analyze-mode]
ANALYSIS MODE. Gather context before diving deep:
CONTEXT GATHERING (parallel):
- 1-2 explore agents (codebase patterns, implementations)
- 1-2 librarian agents (if external library involved)
- Direct tools: Grep, AST-grep, LSP for targeted searches

IF COMPLEX - DO NOT STRUGGLE ALONE. Consult specialists:
- **Oracle**: Conventional problems (architecture, debugging, complex logic)
- **Artistry**: Non-conventional problems (different approach needed)

SYNTHESIZE findings before proceeding.

MANDATORY delegate_task params: ALWAYS include load_skills=[] and run_in_background when calling delegate_task.
Example: delegate_task(subagent_type="explore", prompt="...", run_in_background=true, load_skills=[])
```

## 사용 예시

### 1. shared UI 수정

입력:

```json
{
  "task": "shared/ui button story와 구현을 수정한다",
  "targetPaths": [
    "web/src/app/shared/ui/atom/button.tsx",
    "web/src/app/shared/ui/atom/button.stories.tsx"
  ]
}
```

예상 결과:

- `reusable-components`
- `storybook-authoring`

### 2. 채팅 SSE 수정

입력:

```json
{
  "task": "chat streaming SSE payload 처리 버그를 수정한다",
  "targetPaths": [
    "web/src/app/feature/play-ground/chat/ui/ChatUI.tsx",
    "web/src/app/api/streaming/chat/route.ts"
  ]
}
```

예상 결과:

- `sse-chat-streaming`
- `domain-components`

## 가이드 데이터 원칙

- 각 guide는 `id`, `triggers`, `sources`, `body`를 가집니다.
- source path는 문서만이 아니라 실제 코드와 생성 산출물을 함께 가리켜야 합니다.
- `read_guide`는 source 파일 존재 여부와 최신 수정 시각 기준을 같이 반환합니다.
- `read_guide`의 `lastUpdated`는 전체 source가 아니라 canonical source 집합 기준으로 계산됩니다.
- 생성 산출물 경로가 아직 없을 수 있으므로, 존재하지 않는 source도 의도적으로 레지스트리에 남길 수 있습니다.

## 가이드 추가 방법

새 guide를 추가할 때는 `mcp/src/guides.ts`에서 아래를 같이 정의합니다.

1. 고유한 `id`
2. 경로/키워드 기반 `triggers`
3. 실제 코드와 문서를 함께 포함한 `sources`
4. 짧고 실행 가능한 `body`

권장 원칙:

- AGENTS에 남길 정책은 넣지 않습니다.
- 바뀌기 쉬운 구현 상세는 반드시 실제 source path를 같이 둡니다.
- 가능한 한 "언제 읽는가 / 지금 레포에서 무엇이 사실인가 / 무엇을 조심해야 하는가" 순서로 씁니다.
