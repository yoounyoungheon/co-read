const encoder = new TextEncoder();

const DESCRIPTION_MESSAGE = `소비뇨 블랑은 보통 산도 높고 허브, 시트러스, 풀향이 있어서 가볍고 신선한 음식
이랑 잘 맞습니다.

잘 어울리는 대표 조합:

- 해산물: 굴, 조개, 새우, 흰살생선
- 샐러드: 허브 들어간 그린샐러드, 시트러스 드레싱 샐러드
- 염소치즈: 특히 아주 잘 맞는 편
- 닭고기 요리: 레몬이나 허브를 곁들인 구운 닭
- 아스파라거스, 완두, 허브 채소 요리
- 스시,세비체 같은 깔끔한 생선 요리`;

const INITIAL_MESSAGES = [
  "stream 연결을 시작합니다.",
  "추천 데이터를 준비하고 있습니다.",
  "첫 번째 추천 카드를 불러오는 중입니다.",
  "추천 설명을 순차적으로 전송합니다.",
  "곧 상세 이벤트가 시작됩니다.",
];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const normalizeChunk = (value: string) => value.replace(/\n/g, " ");

const toChunks = (value: string, chunkCount: number) => {
  const chunks: string[] = [];
  const chars = Array.from(value);
  const baseSize = Math.floor(chars.length / chunkCount);
  let remainder = chars.length % chunkCount;
  let start = 0;

  for (let index = 0; index < chunkCount; index += 1) {
    const extra = remainder > 0 ? 1 : 0;
    const size = baseSize + extra;
    const end = start + size;

    chunks.push(normalizeChunk(chars.slice(start, end).join("")));
    start = end;
    remainder -= extra;
  }

  return chunks.filter(Boolean);
};

const formatSSE = (data: string, event?: string) => {
  const lines: string[] = [];

  if (event) {
    lines.push(`event: ${event}`);
  }

  const normalized = data.length > 0 ? data.split("\n") : [""];
  for (const line of normalized) {
    lines.push(`data: ${line}`);
  }

  return `${lines.join("\n")}\n\n`;
};

export async function GET(request: Request) {
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (data: string, event?: string) => {
        if (closed) return;
        controller.enqueue(encoder.encode(formatSSE(data, event)));
      };

      const close = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      const abort = () => {
        closed = true;
        try {
          controller.close();
        } catch {
          // Ignore close races after client disconnects.
        }
      };

      request.signal.addEventListener("abort", abort);

      void (async () => {
        try {
          for (const message of INITIAL_MESSAGES) {
            send(message, "prepare");
            await sleep(200);
          }

          for (const chunk of toChunks("이 음식에는 이런 와인이 잘 어울려요!", 6)) {
            send(chunk, "title");
            await sleep(150);
          }

          for (const chunk of toChunks(
            "와인 종류를 눌러보면 추천 메뉴를 볼 수 있어요.",
            6
          )) {
            send(chunk, "sub-title");
            await sleep(150);
          }

          send("/sample/carrot1.png", "image");

          for (const chunk of toChunks(DESCRIPTION_MESSAGE, 15)) {
            send(chunk, "description");
            await sleep(500);
          }

          send("", "next");
          await sleep(150);

          send("/sample/carrot4.jpeg", "image");

          for (const chunk of toChunks(DESCRIPTION_MESSAGE, 15)) {
            send(chunk, "description");
            await sleep(500);
          }

          send("", "false");
        } finally {
          request.signal.removeEventListener("abort", abort);
          close();
        }
      })();
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
