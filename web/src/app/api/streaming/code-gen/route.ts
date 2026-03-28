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

const STREAM_DELAY_MS = 100;
const STATUS_TRANSITION_DELAY_MS = 100;
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
  { id, type, class: className, method, message: messages[0], result: "PENDING" },
  { id, type, class: className, method, message: messages[1], result: "PENDING" },
  { id, type, class: className, method, message: messages[2], result: "PENDING" },
  { id, type, class: className, method, message: messages[3], result: "SUCCESS" },
];

const buildRecoveryTaskEvents = (
  id: number,
  type: CodeGenStep,
  className: string,
  method: string,
  messages: [string, string, string, string, string],
): ProcessingPayload[] => [
  { id, type, class: className, method, message: messages[0], result: "PENDING" },
  { id, type, class: className, method, message: messages[1], result: "FAIL" },
  { id, type, class: className, method, message: messages[2], result: "PENDING" },
  { id, type, class: className, method, message: messages[3], result: "PENDING" },
  { id, type, class: className, method, message: messages[4], result: "SUCCESS" },
];

const sqlEvents = [
  ...buildDefaultTaskEvents(1, "sql", "UserSchema", "createUsersTable", [
    "users 테이블 스키마 초안을 만들고 있어요.",
    "기본 키와 인덱스를 정리하고 있어요.",
    "연관 제약 조건과 기본값을 검토하고 있어요.",
    "users 테이블 스키마 설계가 완료됐어요.",
  ]),
  ...buildRecoveryTaskEvents(2, "sql", "BookSchema", "createBooksTable", [
    "books 테이블 스키마 초안을 만들고 있어요.",
    "출판사 외래 키 타입이 맞지 않아 스키마 생성에 실패했어요.",
    "외래 키 타입을 정리하고 다시 스키마를 생성하고 있어요.",
    "검색 인덱스를 포함해 books 테이블을 다시 점검하고 있어요.",
    "books 테이블 스키마 설계가 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(3, "sql", "BookClubSchema", "createBookClubsTable", [
    "book_clubs 테이블 스키마 초안을 만들고 있어요.",
    "모임 상태값과 참여 인원 제한을 정리하고 있어요.",
    "생성/수정 시간 컬럼과 인덱스를 검토하고 있어요.",
    "book_clubs 테이블 스키마 설계가 완료됐어요.",
  ]),
];

const modelingEvents = [
  ...buildDefaultTaskEvents(4, "modeling", "User", "defineEntity", [
    "User 엔티티 속성을 모델링하고 있어요.",
    "역할과 프로필 구조를 정리하고 있어요.",
    "연관 관계와 상태값을 검토하고 있어요.",
    "User 엔티티 모델링이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(5, "modeling", "Book", "defineEntity", [
    "Book 엔티티 속성을 모델링하고 있어요.",
    "저자, 카테고리, 메타데이터 구조를 정리하고 있어요.",
    "검색용 필드와 정렬 기준을 검토하고 있어요.",
    "Book 엔티티 모델링이 완료됐어요.",
  ]),
  ...buildRecoveryTaskEvents(6, "modeling", "BookClub", "defineAggregate", [
    "BookClub 애그리거트 초안을 만들고 있어요.",
    "모임 상태 전이가 누락되어 모델 검증에 실패했어요.",
    "상태 전이 규칙을 보강하고 있어요.",
    "참여자 정책과 종료 조건을 다시 검토하고 있어요.",
    "BookClub 애그리거트 모델링이 완료됐어요.",
  ]),
];

const controllerEvents = [
  ...buildDefaultTaskEvents(7, "controller", "UserController", "getProfile", [
    "사용자 프로필 조회 API를 생성하고 있어요.",
    "요청/응답 DTO를 정리하고 있어요.",
    "응답 필드 매핑과 상태 코드를 검토하고 있어요.",
    "사용자 프로필 조회 API 생성이 완료됐어요.",
  ]),
  ...buildRecoveryTaskEvents(8, "controller", "BookController", "searchBooks", [
    "도서 검색 API를 생성하고 있어요.",
    "검색 조건 DTO import가 누락되어 컴파일에 실패했어요.",
    "누락된 import를 보강하고 있어요.",
    "검색 조건 파라미터와 페이지네이션을 다시 점검하고 있어요.",
    "도서 검색 API 생성이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(9, "controller", "BookClubController", "createBookClub", [
    "독서 모임 생성 API를 생성하고 있어요.",
    "요청 검증 규칙을 연결하고 있어요.",
    "에러 응답 스펙과 상태 코드를 검토하고 있어요.",
    "독서 모임 생성 API 생성이 완료됐어요.",
  ]),
];

const serviceEvents = [
  ...buildDefaultTaskEvents(10, "service", "UserService", "getProfile", [
    "사용자 프로필 조회 유즈케이스를 구성하고 있어요.",
    "프로필 조합 로직과 권한 검증을 정리하고 있어요.",
    "예외 처리와 응답 조립을 검토하고 있어요.",
    "사용자 프로필 조회 서비스 구성이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(11, "service", "BookService", "searchBooks", [
    "도서 검색 서비스 로직을 생성하고 있어요.",
    "검색 조건 해석과 정렬 옵션을 정리하고 있어요.",
    "검색 결과 매핑과 페이지 계산을 검토하고 있어요.",
    "도서 검색 서비스 생성이 완료됐어요.",
  ]),
  ...buildRecoveryTaskEvents(12, "service", "BookClubService", "createBookClub", [
    "독서 모임 생성 유즈케이스를 구성하고 있어요.",
    "모임 정원 검증 규칙이 누락되어 테스트에 실패했어요.",
    "정원 검증 규칙을 보강하고 있어요.",
    "모임 생성 트랜잭션과 이벤트 발행을 다시 점검하고 있어요.",
    "독서 모임 생성 서비스 구성이 완료됐어요.",
  ]),
];

const dataEvents = [
  ...buildRecoveryTaskEvents(13, "data", "UserRepository", "findProfileById", [
    "사용자 프로필 조회 쿼리를 생성하고 있어요.",
    "projection alias가 잘못되어 쿼리 생성에 실패했어요.",
    "alias를 수정하고 쿼리를 다시 생성하고 있어요.",
    "join 전략과 정렬 조건을 다시 검토하고 있어요.",
    "사용자 프로필 조회 쿼리 생성이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(14, "data", "BookRepository", "searchBooks", [
    "도서 검색용 리포지토리 쿼리를 생성하고 있어요.",
    "검색 인덱스와 where 조건을 정리하고 있어요.",
    "페이지네이션과 정렬 조건을 검토하고 있어요.",
    "도서 검색용 리포지토리 쿼리 생성이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(15, "data", "BookClubRepository", "save", [
    "독서 모임 저장 리포지토리를 생성하고 있어요.",
    "영속성 매핑과 연관 엔티티 저장 순서를 정리하고 있어요.",
    "트랜잭션 경계와 flush 시점을 검토하고 있어요.",
    "독서 모임 저장 리포지토리 생성이 완료됐어요.",
  ]),
];

const testEvents = [
  ...buildDefaultTaskEvents(16, "test", "UserServiceTest", "getProfile", [
    "사용자 프로필 조회 테스트를 생성하고 있어요.",
    "기본 시나리오와 예외 케이스를 정리하고 있어요.",
    "fixture와 mock 응답을 검토하고 있어요.",
    "사용자 프로필 조회 테스트 생성이 완료됐어요.",
  ]),
  ...buildRecoveryTaskEvents(17, "test", "BookServiceTest", "searchBooks", [
    "도서 검색 테스트를 생성하고 있어요.",
    "검색 fixture 정렬 순서가 달라 테스트가 실패했어요.",
    "fixture 정렬 기준을 수정하고 있어요.",
    "검색 결과 assertion과 mock 응답을 다시 점검하고 있어요.",
    "도서 검색 테스트 생성이 완료됐어요.",
  ]),
  ...buildRecoveryTaskEvents(18, "test", "BookClubServiceTest", "createBookClub", [
    "독서 모임 생성 테스트를 만들고 있어요.",
    "mock repository 반환값이 누락되어 테스트 실행이 실패했어요.",
    "누락된 mock 응답을 보강하고 있어요.",
    "fixture와 assertion을 다시 점검하고 있어요.",
    "독서 모임 생성 테스트가 다시 실행되어 통과했어요.",
  ]),
];

const configEvents = [
  ...buildRecoveryTaskEvents(19, "config", "SecurityConfig", "configureAuth", [
    "인증/인가 설정을 구성하고 있어요.",
    "CORS allow credentials 설정이 누락되어 검증에 실패했어요.",
    "보안 설정과 허용 경로를 다시 조정하고 있어요.",
    "인증 필터 체인과 permitAll 경로를 점검하고 있어요.",
    "인증/인가 설정 구성이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(20, "config", "JpaConfig", "configureDataSource", [
    "JPA와 데이터소스 설정을 구성하고 있어요.",
    "프로파일별 datasource와 ddl 설정을 정리하고 있어요.",
    "커넥션 풀과 트랜잭션 설정을 검토하고 있어요.",
    "JPA와 데이터소스 설정 구성이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(21, "config", "OpenSearchConfig", "registerClient", [
    "검색 엔진 클라이언트 설정을 구성하고 있어요.",
    "클라이언트 타임아웃과 인덱스 설정을 정리하고 있어요.",
    "연결 재시도와 직렬화 설정을 검토하고 있어요.",
    "검색 엔진 클라이언트 설정 구성이 완료됐어요.",
  ]),
];

const validationEvents = [
  ...buildDefaultTaskEvents(22, "validation", "BuildValidator", "fixMissingImport", [
    "누락된 import를 점검하고 있어요.",
    "컴파일 로그 기준으로 import 후보를 수집하고 있어요.",
    "사용하지 않는 import까지 함께 정리하고 있어요.",
    "누락된 import 수정이 완료됐어요.",
  ]),
  ...buildRecoveryTaskEvents(23, "validation", "BuildValidator", "fixTypeMismatch", [
    "DTO와 엔티티 사이 타입 불일치를 점검하고 있어요.",
    "nullable 필드 타입이 달라 검증 단계에서 실패했어요.",
    "타입 정의와 매퍼 코드를 다시 정리하고 있어요.",
    "런타임 직렬화 결과까지 다시 점검하고 있어요.",
    "타입 불일치 수정이 완료됐어요.",
  ]),
  ...buildDefaultTaskEvents(24, "validation", "BuildValidator", "fixRepositoryMethod", [
    "리포지토리 메서드 시그니처를 점검하고 있어요.",
    "존재하지 않는 메서드 호출과 반환 타입을 정리하고 있어요.",
    "빌드 로그 기준으로 호출 지점을 다시 검토하고 있어요.",
    "리포지토리 메서드 검증이 완료됐어요.",
  ]),
];

const sqlPhaseEvents = sqlEvents.slice(0, 9);
const modelingPhaseEvents = modelingEvents.slice(0, 8);
const controllerPhaseEvents = controllerEvents.slice(0, 9);
const servicePhaseEvents = serviceEvents.slice(0, 8);
const dataPhaseEvents = dataEvents.slice(0, 9);
const testPhaseEvents = testEvents.slice(0, 9);
const configPhaseEvents = configEvents.slice(0, 9);
const validationPhaseEvents = validationEvents.slice(0, 9);

const PROCESSING_EVENTS: ProcessingPayload[] = [
  ...sqlPhaseEvents,
  ...modelingPhaseEvents,
  controllerPhaseEvents[0],
  servicePhaseEvents[0],
  dataPhaseEvents[0],
  testPhaseEvents[0],
  configPhaseEvents[0],
  controllerPhaseEvents[1],
  servicePhaseEvents[1],
  dataPhaseEvents[1],
  testPhaseEvents[1],
  configPhaseEvents[1],
  controllerPhaseEvents[2],
  servicePhaseEvents[2],
  dataPhaseEvents[2],
  testPhaseEvents[2],
  configPhaseEvents[2],
  controllerPhaseEvents[3],
  servicePhaseEvents[3],
  dataPhaseEvents[3],
  testPhaseEvents[3],
  configPhaseEvents[3],
  controllerPhaseEvents[4],
  servicePhaseEvents[4],
  dataPhaseEvents[4],
  testPhaseEvents[4],
  configPhaseEvents[4],
  controllerPhaseEvents[5],
  servicePhaseEvents[5],
  dataPhaseEvents[5],
  testPhaseEvents[5],
  configPhaseEvents[5],
  controllerPhaseEvents[6],
  servicePhaseEvents[6],
  dataPhaseEvents[6],
  testPhaseEvents[6],
  configPhaseEvents[6],
  controllerPhaseEvents[7],
  servicePhaseEvents[7],
  dataPhaseEvents[7],
  testPhaseEvents[7],
  configPhaseEvents[7],
  controllerPhaseEvents[8],
  servicePhaseEvents[8],
  dataPhaseEvents[8],
  testPhaseEvents[8],
  configPhaseEvents[8],
  ...validationPhaseEvents,
].filter((event): event is ProcessingPayload => Boolean(event));

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
            const previousEvent =
              index > 0 ? PROCESSING_EVENTS[index - 1] : undefined;

            if (!event) {
              continue;
            }

            if (
              previousEvent &&
              previousEvent.id === event.id &&
              previousEvent.result === "PENDING" &&
              event.result === "SUCCESS"
            ) {
              await sleep(STATUS_TRANSITION_DELAY_MS);
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
