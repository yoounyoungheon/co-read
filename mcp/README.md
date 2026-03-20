# co-read MCP

로컬에서 사용할 수 있는 `Node.js + MCP SDK` 기반 MCP 서버 골격입니다.

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

## 현재 포함된 예제 툴

- `ping`: 서버 상태 확인
- `echo`: 문자열 그대로 반환
- `get_current_time`: 현재 시간 문자열 반환

## Claude Desktop 예시

`stdio` 기반으로 붙일 때는 Claude Desktop 설정에 아래처럼 등록하면 됩니다.

```json
{
  "mcpServers": {
    "co-read": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/Users/yun-yeongheon/dev/co-read/mcp"
    }
  }
}
```

개발 중에는 `start` 대신 `dev`를 써도 되지만, 클라이언트 연동은 보통 빌드된 `start`가 더 안정적입니다.
