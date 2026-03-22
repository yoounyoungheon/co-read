# frontend-guidance-mcp

로컬에서 사용할 수 있는 `Node.js + MCP SDK` 기반 프론트엔드 지침 전용 MCP 서버입니다.

권장 사용 순서는 `web/AGENTS.md`로 전역 정책을 먼저 확인한 뒤, 이 MCP에서 작업 맥락에 맞는 guide만 선택적으로 읽는 방식입니다.

## 시작

```bash
cd mcp
npm install
npm run dev
```

빌드 후 실행:

```bash
npm run build
npm run start
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
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/Users/yun-yeongheon/dev/co-read/mcp"
    }
  }
}
```

개발 중에는 `start` 대신 `dev`를 써도 되지만, 클라이언트 연동은 보통 빌드된 `start`가 더 안정적입니다.
