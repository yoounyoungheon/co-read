export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

const SSE_BODY = `:heartbeat

{"ok":true}:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":1,"content":"샤또"}}

:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":1,"content":"마고"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"샤또"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"마고는"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"풍부한"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"탄닌과"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"복합적인"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"풍미를"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"가지고"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"있어"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"육즙이"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"풍부한"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"스테이크와"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"잘"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"어울립니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"스테이크의"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"풍미를"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"더욱"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"끌어올리고"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"입안을"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"개운하게"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"만들어주는"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"역할을"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":1,"content":"합니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":1,"content":"스테이크와"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":1,"content":"훌륭한"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":1,"content":"조화를"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":1,"content":"이룹니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":2,"content":"샤또"}}

:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":2,"content":"마고"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"샤또"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"마고는"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"까베르네"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"소비뇽"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"베이스의"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"와인으로,"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"토마토"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"소스나"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"크림"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"소스를"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"베이스로"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"한"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"파스타와도"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"예상외의"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"좋은"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"궁합을"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"보여줄"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"수"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"있습니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"특히"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"풍미가"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"강한"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"파스타"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"요리와"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"함께"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"즐기면"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":2,"content":"좋습니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":2,"content":"파스타와도"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":2,"content":"시도해볼"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":2,"content":"만한"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":2,"content":"선택입니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":3,"content":"르"}}

:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":3,"content":"아모"}}

:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":3,"content":"쇼비뇽"}}

:chat
data:{"type":"PAIRING","data":{"type":"TITLE","rank":3,"content":"블랑"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"이"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"와인은"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"해산물"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"요리의"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"섬세한"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"맛을"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"해치지"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"않으면서도"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"풍미를"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"더해줍니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"특히"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"구운"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"생선이나"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"조개류와"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"함께하면"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"해산물의"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"단맛과"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"와인의"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"과실미가"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"어우러져"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"특별한"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"경험을"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"선사할"}}

:chat
data:{"type":"PAIRING","data":{"type":"REASON","rank":3,"content":"것입니다."}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":3,"content":"해산물과는"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":3,"content":"섬세한"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":3,"content":"조화를"}}

:chat
data:{"type":"PAIRING","data":{"type":"COMMENT","rank":3,"content":"이룹니다."}}

:heartbeat

:heartbeat

:heartbeat
`;

const SSE_EVENTS = SSE_BODY.trimEnd().split("\n\n");

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
            await sleep(20);
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
