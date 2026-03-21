import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "co-read-local-mcp",
  version: "0.1.0",
});

server.registerTool(
  "ping",
  {
    title: "Ping",
    description: "MCP 서버가 정상 동작 중인지 확인합니다.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text", text: "pong" }],
  }),
);

server.registerTool(
  "echo",
  {
    title: "Echo",
    description: "입력한 문자열을 그대로 반환합니다.",
    inputSchema: {
      message: z.string().min(1).describe("반환할 메시지"),
    },
  },
  async ({ message }) => ({
    content: [{ type: "text", text: message }],
  }),
);

server.registerTool(
  "get_current_time",
  {
    title: "Current Time",
    description: "현재 로컬 시간을 ISO 문자열로 반환합니다.",
    inputSchema: {
      timezone: z
        .string()
        .optional()
        .describe("예: Asia/Seoul. 비어 있으면 시스템 기본 시간대를 사용합니다."),
    },
  },
  async ({ timezone }) => {
    const date = new Date();

    const formatted = timezone
      ? new Intl.DateTimeFormat("ko-KR", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: timezone,
        }).format(date)
      : date.toString();

    return {
      content: [
        {
          type: "text",
          text: formatted,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
