export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

type CodeGenStep =
  | "sql"
  | "modeling"
  | "controller"
  | "service"
  | "data"
  | "test"
  | "config"
  | "validation";

type CodeGenResult = "PENDING" | "SUCCESS" | "FAIL";

type ProcessingPayload = {
  id: number;
  type: CodeGenStep;
  class: string;
  method: string;
  message: string;
  result: CodeGenResult;
};

type EndPayload = {
  result: "SUCCESS" | "FAIL";
  git: string;
  artifact: string;
};

const STREAM_DELAY_MS = 500;
const RETRY_DELAY_MS = 1000 * 60 * 60;
const END_FLUSH_INTERVAL_MS = 200;
const END_FLUSH_COUNT = 4;

const buildDefaultTaskEvents = (
  id: number,
  type: CodeGenStep,
  className: string,
  method: string,
  messages: [string, string, string, string],
): ProcessingPayload[] => [
  {
    id,
    type,
    class: className,
    method,
    message: messages[0],
    result: "PENDING",
  },
  {
    id,
    type,
    class: className,
    method,
    message: messages[1],
    result: "PENDING",
  },
  {
    id,
    type,
    class: className,
    method,
    message: messages[2],
    result: "PENDING",
  },
  {
    id,
    type,
    class: className,
    method,
    message: messages[3],
    result: "SUCCESS",
  },
];

const buildRecoveryTaskEvents = (
  id: number,
  type: CodeGenStep,
  className: string,
  method: string,
  messages: [string, string, string, string, string],
): ProcessingPayload[] => [
  {
    id,
    type,
    class: className,
    method,
    message: messages[0],
    result: "PENDING",
  },
  { id, type, class: className, method, message: messages[1], result: "FAIL" },
  {
    id,
    type,
    class: className,
    method,
    message: messages[2],
    result: "PENDING",
  },
  {
    id,
    type,
    class: className,
    method,
    message: messages[3],
    result: "PENDING",
  },
  {
    id,
    type,
    class: className,
    method,
    message: messages[4],
    result: "SUCCESS",
  },
];

const sqlEvents = buildRecoveryTaskEvents(
  1,
  "sql",
  "SchemaGenerator",
  "generate",
  [
    "데이터베이스 스키마 초안을 만들고 있어요.",
    "외래 키 타입이 맞지 않아 스키마 검증에 실패했어요.",
    "스키마 타입과 인덱스를 다시 정리하고 있어요.",
    "제약 조건과 기본값을 다시 점검하고 있어요.",
    "데이터베이스 스키마 설계가 완료됐어요.",
  ],
);

const modelingEvents = buildDefaultTaskEvents(
  2,
  "modeling",
  "DomainModeler",
  "defineEntities",
  [
    "도메인 엔티티와 관계를 모델링하고 있어요.",
    "역할, 상태값, 주요 속성을 정리하고 있어요.",
    "애그리거트 경계와 전이 규칙을 검토하고 있어요.",
    "도메인 모델링이 완료됐어요.",
  ],
);

const controllerEvents = buildDefaultTaskEvents(
  3,
  "controller",
  "ControllerGenerator",
  "generateControllers",
  [
    "API 컨트롤러를 생성하고 있어요.",
    "요청/응답 DTO와 라우팅을 정리하고 있어요.",
    "상태 코드와 에러 응답 스펙을 검토하고 있어요.",
    "API 컨트롤러 생성이 완료됐어요.",
  ],
);

const serviceEvents = buildRecoveryTaskEvents(
  4,
  "service",
  "ServiceGenerator",
  "generateServices",
  [
    "서비스 유즈케이스를 구성하고 있어요.",
    "정원 검증 규칙이 누락되어 서비스 검증에 실패했어요.",
    "비즈니스 규칙과 예외 처리를 보강하고 있어요.",
    "트랜잭션 경계와 응답 조립을 다시 점검하고 있어요.",
    "서비스 구성 생성이 완료됐어요.",
  ],
);

const dataEvents = buildDefaultTaskEvents(
  5,
  "data",
  "RepositoryGenerator",
  "generateRepositories",
  [
    "리포지토리 쿼리를 생성하고 있어요.",
    "검색 조건과 영속성 매핑을 정리하고 있어요.",
    "정렬, 페이지네이션, flush 시점을 검토하고 있어요.",
    "리포지토리 생성이 완료됐어요.",
  ],
);

const testEvents = buildRecoveryTaskEvents(
  6,
  "test",
  "TestGenerator",
  "generateTests",
  [
    "테스트 코드를 생성하고 있어요.",
    "fixture 정렬 순서가 달라 테스트 실행에 실패했어요.",
    "fixture와 mock 응답을 다시 정리하고 있어요.",
    "assertion과 예외 케이스를 다시 점검하고 있어요.",
    "테스트 생성이 완료됐어요.",
  ],
);

const configEvents = buildDefaultTaskEvents(
  7,
  "config",
  "ConfigGenerator",
  "generateConfig",
  [
    "환경 설정과 보안 구성을 생성하고 있어요.",
    "데이터소스와 인증 경로를 정리하고 있어요.",
    "클라이언트 타임아웃과 연결 설정을 검토하고 있어요.",
    "환경 설정 구성이 완료됐어요.",
  ],
);

const validationEvents = buildRecoveryTaskEvents(
  8,
  "validation",
  "BuildValidator",
  "validateBuild",
  [
    "생성된 코드를 검증하고 있어요.",
    "타입 불일치가 발견되어 빌드 검증에 실패했어요.",
    "타입 정의와 import를 다시 정리하고 있어요.",
    "리포지토리 시그니처와 직렬화 결과를 다시 점검하고 있어요.",
    "코드 생성 검증이 완료됐어요.",
  ],
);

const PROCESSING_EVENTS: ProcessingPayload[] = [
  ...sqlEvents,
  ...modelingEvents,
  ...controllerEvents,
  ...serviceEvents,
  ...dataEvents,
  ...testEvents,
  ...configEvents,
  ...validationEvents,
];

const END_PAYLOAD: EndPayload = {
  result: "SUCCESS",
  git: "https://github.com/openlabs/generated-book-community-backend",
  artifact: "s3://openlabs-poc/book-community-backend-20260329.zip",
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const toSSEEvent = (eventName: string, data: object | null) =>
  `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
const toSSERetry = (retryMs: number) => `retry: ${retryMs}\n\n`;
const toSSEComment = (comment: string) => `:${comment}\n\n`;

export async function GET(request: Request) {
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (payload: string) => {
        if (closed) return;
        controller.enqueue(encoder.encode(payload));
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
          send(toSSERetry(RETRY_DELAY_MS));
          send(toSSEEvent("start", null));
          await sleep(STREAM_DELAY_MS);

          for (let index = 0; index < PROCESSING_EVENTS.length; index += 1) {
            const event = PROCESSING_EVENTS[index];

            if (!event) {
              continue;
            }

            send(toSSEEvent("processing", event));
            await sleep(STREAM_DELAY_MS);
          }

          send(toSSEEvent("end", END_PAYLOAD));

          for (let index = 0; index < END_FLUSH_COUNT; index += 1) {
            await sleep(END_FLUSH_INTERVAL_MS);
            send(toSSEComment("end-flush"));
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
