# frontend-guidance-mcp

로컬에서 사용할 수 있는 `Node.js + MCP SDK` 기반 프론트엔드 지침 전용 MCP 서버입니다.

권장 사용 순서는 `web/AGENTS.md`로 전역 정책을 먼저 확인한 뒤, 이 MCP에서 작업 맥락에 맞는 guide만 선택적으로 읽는 방식입니다.

## 시작

```bash
cd mcp
npm install
npm run build
node dist/index.js
```

직접 `node`로 실행할 때는 먼저 빌드가 필요합니다. 엔트리 파일은 `dist/index.js`입니다.

다시 실행할 때도 아래처럼 사용하면 됩니다.

```bash
cd mcp
npm run build
node dist/index.js
```

## 현재 포함된 툴

- `resolve_guides`: 작업 설명과 경로를 바탕으로 읽어야 할 guide id를 반환
- `read_guide`: guide 본문과 source path 상태를 반환

상세 사용법은 이 디렉터리의 `GUIDE_MCP_USAGE.md`를 참고하세요.

## Claude Desktop 예시

`stdio` 기반으로 붙일 때는 Claude Desktop 설정에 아래처럼 등록하면 됩니다.

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

이 패키지의 소스 엔트리는 TypeScript(`src/index.ts`)라서, 클라이언트 연동은 빌드된 `dist/index.js`를 `node`로 직접 실행하는 방식이 가장 안정적입니다.
