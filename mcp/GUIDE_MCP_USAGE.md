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
npm run dev
```

빌드 후 실행:

```bash
cd mcp
npm run build
npm run start
```

## stdio 기반 MCP 클라이언트 연결 예시

이 서버는 특정 AI agent나 특정 클라이언트 전용이 아닙니다. `stdio` 방식으로 MCP 서버를 실행할 수 있는 클라이언트라면 같은 방식으로 연결할 수 있습니다.

### Claude Desktop 예시

아래는 Claude Desktop에서 많이 쓰는 `mcpServers` 형식의 예시입니다.

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

개발 중 연결 확인만 빠르게 하려면 `start` 대신 `dev`를 쓸 수 있지만, 안정적인 연동은 빌드 후 `start`가 더 적합합니다.

### Codex에서 사용하려면

Codex CLI에서 이 MCP를 사용하려면 사용자 설정 파일 `~/.codex/config.toml`에 서버를 등록해야 합니다.

```toml
[mcp_servers.frontend-guidance-mcp]
command = "npm"
args = ["run", "start"]
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
      "command": ["npm", "run", "start"],
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
        "cd /Users/yun-yeongheon/dev/co-read/mcp && npm run start"
      ],
      "enabled": true
    }
  }
}
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
