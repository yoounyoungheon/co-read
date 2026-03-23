export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const STREAM_DELAY_MS = 50;

type PairingChunkType = "TITLE" | "REASON" | "COMMENT";

type PairingPayload = {
  type: "PAIRING";
  data: {
    type: PairingChunkType;
    rank: number;
    content: string;
  };
};

type StartPayload = {
  type: "START";
  data: {
    type: "MESSAGE";
    message: string;
  };
};

const HEARTBEAT_EVENT = ":heartbeat";
const READY_EVENT = `data:${JSON.stringify({ ok: true })}`;
const FINISH_EVENT = `:chat\ndata:${JSON.stringify({ type: "FINISH", data: null })}`;

const START_EVENTS: StartPayload[] = [
  { type: "START", data: { type: "MESSAGE", message: "네," } },
  { type: "START", data: { type: "MESSAGE", message: "알겠" } },
  { type: "START", data: { type: "MESSAGE", message: "습" } },
  { type: "START", data: { type: "MESSAGE", message: "니다." } },
  { type: "START", data: { type: "MESSAGE", message: "와인" } },
  { type: "START", data: { type: "MESSAGE", message: "추" } },
  { type: "START", data: { type: "MESSAGE", message: "천" } },
  { type: "START", data: { type: "MESSAGE", message: "해" } },
  { type: "START", data: { type: "MESSAGE", message: "드" } },
  { type: "START", data: { type: "MESSAGE", message: "릴" } },
  { type: "START", data: { type: "MESSAGE", message: "게" } },
  { type: "START", data: { type: "MESSAGE", message: "요!" } },
];

const PAIRING_EVENTS: PairingPayload[] = [
  { type: "PAIRING", data: { type: "TITLE", rank: 1, content: "샤또" } },
  { type: "PAIRING", data: { type: "TITLE", rank: 1, content: "마고" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "샤또" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "마고는" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "풍부한" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "탄닌과" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "복합적인" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "풍미를" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "가지고" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "있어" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "육즙이" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "풍부한" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "스테이크와" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "잘" } },
  {
    type: "PAIRING",
    data: { type: "REASON", rank: 1, content: "어울립니다." },
  },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "스테이크의" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "풍미를" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "더욱" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "끌어올리고" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "입안을" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "개운하게" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "만들어주는" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "역할을" } },
  { type: "PAIRING", data: { type: "REASON", rank: 1, content: "합니다." } },
  {
    type: "PAIRING",
    data: { type: "COMMENT", rank: 1, content: "스테이크와" },
  },
  { type: "PAIRING", data: { type: "COMMENT", rank: 1, content: "훌륭한" } },
  { type: "PAIRING", data: { type: "COMMENT", rank: 1, content: "조화를" } },
  { type: "PAIRING", data: { type: "COMMENT", rank: 1, content: "이룹니다." } },
  { type: "PAIRING", data: { type: "TITLE", rank: 2, content: "샤또" } },
  { type: "PAIRING", data: { type: "TITLE", rank: 2, content: "마고" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "샤또" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "마고는" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "까베르네" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "소비뇽" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "베이스의" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "와인으로," } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "토마토" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "소스나" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "크림" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "소스를" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "베이스로" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "한" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "파스타와도" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "예상외의" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "좋은" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "궁합을" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "보여줄" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "수" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "있습니다." } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "특히" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "풍미가" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "강한" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "파스타" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "요리와" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "함께" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "즐기면" } },
  { type: "PAIRING", data: { type: "REASON", rank: 2, content: "좋습니다." } },
  {
    type: "PAIRING",
    data: { type: "COMMENT", rank: 2, content: "파스타와도" },
  },
  { type: "PAIRING", data: { type: "COMMENT", rank: 2, content: "시도해볼" } },
  { type: "PAIRING", data: { type: "COMMENT", rank: 2, content: "만한" } },
  {
    type: "PAIRING",
    data: { type: "COMMENT", rank: 2, content: "선택입니다." },
  },
  { type: "PAIRING", data: { type: "TITLE", rank: 3, content: "르" } },
  { type: "PAIRING", data: { type: "TITLE", rank: 3, content: "아모" } },
  { type: "PAIRING", data: { type: "TITLE", rank: 3, content: "쇼비뇽" } },
  { type: "PAIRING", data: { type: "TITLE", rank: 3, content: "블랑" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "이" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "와인은" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "해산물" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "요리의" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "섬세한" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "맛을" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "해치지" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "않으면서도" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "풍미를" } },
  {
    type: "PAIRING",
    data: { type: "REASON", rank: 3, content: "더해줍니다." },
  },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "특히" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "구운" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "생선이나" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "조개류와" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "함께하면" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "해산물의" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "단맛과" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "와인의" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "과실미가" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "어우러져" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "특별한" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "경험을" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "선사할" } },
  { type: "PAIRING", data: { type: "REASON", rank: 3, content: "것입니다." } },
  {
    type: "PAIRING",
    data: { type: "COMMENT", rank: 3, content: "해산물과는" },
  },
  { type: "PAIRING", data: { type: "COMMENT", rank: 3, content: "섬세한" } },
  { type: "PAIRING", data: { type: "COMMENT", rank: 3, content: "조화를" } },
  { type: "PAIRING", data: { type: "COMMENT", rank: 3, content: "이룹니다." } },
];

const SSE_EVENTS = [
  HEARTBEAT_EVENT,
  READY_EVENT,
  ...START_EVENTS.map((payload) => `:chat\ndata:${JSON.stringify(payload)}`),
  ...PAIRING_EVENTS.map((payload) => `:chat\ndata:${JSON.stringify(payload)}`),
  FINISH_EVENT,
  HEARTBEAT_EVENT,
  HEARTBEAT_EVENT,
  HEARTBEAT_EVENT,
];

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`${event}\n\n`));
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
          for (const event of SSE_EVENTS) {
            send(event);
            await sleep(STREAM_DELAY_MS);
          }
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
