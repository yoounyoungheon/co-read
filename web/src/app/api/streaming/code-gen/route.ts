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

const DEFAULT_STREAM_DELAY_MS = 1000;
const DEFAULT_STATUS_TRANSITION_DELAY_MS = 2200;
const PRODUCTION_STREAM_DELAY_MS = 200;
const PRODUCTION_STATUS_TRANSITION_DELAY_MS = 200;
const RETRY_DELAY_MS = 1000 * 60 * 60;
const END_FLUSH_INTERVAL_MS = 200;
const END_FLUSH_COUNT = 4;

const PROCESSING_EVENTS: ProcessingPayload[] = [
  {
    id: 1,
    type: "sql",
    class: "BookSchema",
    method: "createUsersTable",
    message: "users 테이블 생성 SQL을 작성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 1,
    type: "sql",
    class: "BookSchema",
    method: "createUsersTable",
    message: "users 테이블 생성 SQL 작성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 2,
    type: "sql",
    class: "BookSchema",
    method: "createBooksTable",
    message: "books 테이블 생성 SQL을 작성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 2,
    type: "sql",
    class: "BookSchema",
    method: "createBooksTable",
    message: "books 테이블 생성 SQL 작성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 3,
    type: "sql",
    class: "BookSchema",
    method: "createBookClubsTable",
    message: "book_clubs 테이블 생성 SQL을 작성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 3,
    type: "sql",
    class: "BookSchema",
    method: "createBookClubsTable",
    message: "book_clubs 테이블 생성 SQL 작성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 4,
    type: "sql",
    class: "BookSchema",
    method: "createReviewsTable",
    message: "reviews 테이블 생성 SQL을 작성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 4,
    type: "sql",
    class: "BookSchema",
    method: "createReviewsTable",
    message: "reviews 테이블 생성 SQL 작성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 5,
    type: "sql",
    class: "BookSchema",
    method: "createCommentsTable",
    message: "comments 테이블 생성 SQL을 작성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 5,
    type: "sql",
    class: "BookSchema",
    method: "createCommentsTable",
    message: "comments 테이블 생성 SQL 작성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 6,
    type: "modeling",
    class: "User",
    method: "defineEntity",
    message: "User 엔티티 필드와 제약 조건을 모델링하고 있어요.",
    result: "PENDING",
  },
  {
    id: 6,
    type: "modeling",
    class: "User",
    method: "defineEntity",
    message: "User 엔티티 모델링이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 7,
    type: "modeling",
    class: "Book",
    method: "defineEntity",
    message: "Book 엔티티와 연관 관계를 모델링하고 있어요.",
    result: "PENDING",
  },
  {
    id: 7,
    type: "modeling",
    class: "Book",
    method: "defineEntity",
    message: "Book 엔티티 모델링이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 8,
    type: "modeling",
    class: "BookClub",
    method: "defineAggregate",
    message: "BookClub 애그리거트 루트와 상태 전이를 모델링하고 있어요.",
    result: "PENDING",
  },
  {
    id: 8,
    type: "modeling",
    class: "BookClub",
    method: "defineAggregate",
    message: "BookClub 애그리거트 모델링이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 9,
    type: "modeling",
    class: "Review",
    method: "defineEntity",
    message: "Review 엔티티와 책/사용자 연관 관계를 모델링하고 있어요.",
    result: "PENDING",
  },
  {
    id: 9,
    type: "modeling",
    class: "Review",
    method: "defineEntity",
    message: "Review 엔티티 모델링이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 10,
    type: "modeling",
    class: "Comment",
    method: "defineEntity",
    message: "Comment 엔티티와 계층 구조를 모델링하고 있어요.",
    result: "PENDING",
  },
  {
    id: 10,
    type: "modeling",
    class: "Comment",
    method: "defineEntity",
    message: "Comment 엔티티 모델링이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 11,
    type: "controller",
    class: "UserController",
    method: "getProfile",
    message: "사용자 프로필 조회 API를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 12,
    type: "service",
    class: "UserService",
    method: "getProfile",
    message: "사용자 프로필 조회 유즈케이스를 구성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 12,
    type: "service",
    class: "UserService",
    method: "getProfile",
    message: "프로필 응답 조합 로직과 권한 검증을 다시 정리하고 있어요.",
    result: "PENDING",
  },
  {
    id: 13,
    type: "data",
    class: "UserRepository",
    method: "findProfileById",
    message: "사용자 프로필 조회 쿼리를 구현하고 있어요.",
    result: "PENDING",
  },
  {
    id: 14,
    type: "test",
    class: "UserServiceTest",
    method: "getProfile",
    message: "사용자 프로필 조회 테스트를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 15,
    type: "config",
    class: "SecurityConfig",
    method: "configureAuth",
    message: "인증/인가 설정을 구성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 11,
    type: "controller",
    class: "UserController",
    method: "getProfile",
    message: "사용자 프로필 조회 API 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 13,
    type: "data",
    class: "UserRepository",
    method: "findProfileById",
    message: "프로필 projection alias가 잘못되어 쿼리 생성에 실패했어요.",
    result: "FAIL",
  },
  {
    id: 16,
    type: "controller",
    class: "BookController",
    method: "searchBooks",
    message: "도서 검색 API를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 12,
    type: "service",
    class: "UserService",
    method: "getProfile",
    message: "사용자 프로필 조회 유즈케이스 구성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 17,
    type: "service",
    class: "BookService",
    method: "searchBooks",
    message: "도서 검색 서비스 로직을 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 13,
    type: "data",
    class: "UserRepository",
    method: "findProfileById",
    message: "사용자 프로필 조회 쿼리 구현이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 18,
    type: "data",
    class: "BookRepository",
    method: "searchBooks",
    message: "도서 검색용 리포지토리 쿼리를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 14,
    type: "test",
    class: "UserServiceTest",
    method: "getProfile",
    message: "사용자 프로필 조회 테스트 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 13,
    type: "data",
    class: "UserRepository",
    method: "findProfileById",
    message: "projection alias를 수정하고 프로필 조회 쿼리를 다시 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 19,
    type: "test",
    class: "BookServiceTest",
    method: "searchBooks",
    message: "도서 검색 테스트를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 15,
    type: "config",
    class: "SecurityConfig",
    method: "configureAuth",
    message: "CORS allow credentials 설정이 누락되어 보안 설정 검증에 실패했어요.",
    result: "FAIL",
  },
  {
    id: 20,
    type: "config",
    class: "JpaConfig",
    method: "configureDataSource",
    message: "JPA와 데이터소스 설정을 구성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 16,
    type: "controller",
    class: "BookController",
    method: "searchBooks",
    message: "도서 검색 API 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 13,
    type: "data",
    class: "UserRepository",
    method: "findProfileById",
    message: "사용자 프로필 조회 쿼리 재생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 21,
    type: "controller",
    class: "BookClubController",
    method: "createBookClub",
    message: "독서 모임 생성 API를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 17,
    type: "service",
    class: "BookService",
    method: "searchBooks",
    message: "도서 검색 서비스 로직 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 22,
    type: "service",
    class: "BookClubService",
    method: "createBookClub",
    message: "독서 모임 생성 유즈케이스를 구성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 18,
    type: "data",
    class: "BookRepository",
    method: "searchBooks",
    message: "도서 검색용 리포지토리 쿼리 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 23,
    type: "data",
    class: "BookClubRepository",
    method: "save",
    message: "독서 모임 저장 리포지토리를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 19,
    type: "test",
    class: "BookServiceTest",
    method: "searchBooks",
    message: "도서 검색 테스트 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 24,
    type: "test",
    class: "BookClubServiceTest",
    method: "createBookClub",
    message: "독서 모임 생성 테스트를 만들고 있어요.",
    result: "PENDING",
  },
  {
    id: 24,
    type: "test",
    class: "BookClubServiceTest",
    method: "createBookClub",
    message: "mock repository 반환값이 누락되어 테스트 실행이 실패했어요.",
    result: "FAIL",
  },
  {
    id: 20,
    type: "config",
    class: "JpaConfig",
    method: "configureDataSource",
    message: "JPA와 데이터소스 설정 구성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 25,
    type: "config",
    class: "OpenSearchConfig",
    method: "registerClient",
    message: "검색 엔진 클라이언트 설정을 구성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 15,
    type: "config",
    class: "SecurityConfig",
    method: "configureAuth",
    message: "CORS allow credentials와 permitAll 경로를 조정하고 있어요.",
    result: "PENDING",
  },
  {
    id: 21,
    type: "controller",
    class: "BookClubController",
    method: "createBookClub",
    message: "독서 모임 생성 API 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 26,
    type: "controller",
    class: "ReviewController",
    method: "createReview",
    message: "리뷰 생성 API를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 22,
    type: "service",
    class: "BookClubService",
    method: "createBookClub",
    message: "독서 모임 생성 유즈케이스 구성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 27,
    type: "service",
    class: "ReviewService",
    method: "createReview",
    message: "리뷰 생성 서비스 로직을 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 23,
    type: "data",
    class: "BookClubRepository",
    method: "save",
    message: "독서 모임 저장 리포지토리 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 24,
    type: "test",
    class: "BookClubServiceTest",
    method: "createBookClub",
    message: "누락된 mock 응답과 fixture를 보강하고 있어요.",
    result: "PENDING",
  },
  {
    id: 28,
    type: "data",
    class: "ReviewRepository",
    method: "save",
    message: "리뷰 저장 리포지토리를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 24,
    type: "test",
    class: "BookClubServiceTest",
    method: "createBookClub",
    message: "독서 모임 생성 테스트가 다시 실행되어 통과했어요.",
    result: "SUCCESS",
  },
  {
    id: 29,
    type: "test",
    class: "ReviewServiceTest",
    method: "createReview",
    message: "리뷰 생성 테스트를 생성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 25,
    type: "config",
    class: "OpenSearchConfig",
    method: "registerClient",
    message: "검색 엔진 클라이언트 설정 구성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 30,
    type: "config",
    class: "CacheConfig",
    method: "registerRedis",
    message: "캐시와 Redis 설정을 구성하고 있어요.",
    result: "PENDING",
  },
  {
    id: 26,
    type: "controller",
    class: "ReviewController",
    method: "createReview",
    message: "리뷰 생성 API 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 27,
    type: "service",
    class: "ReviewService",
    method: "createReview",
    message: "리뷰 생성 서비스 로직 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 28,
    type: "data",
    class: "ReviewRepository",
    method: "save",
    message: "리뷰 저장 리포지토리 생성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 29,
    type: "test",
    class: "ReviewServiceTest",
    method: "createReview",
    message: "리뷰 생성 테스트가 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 30,
    type: "config",
    class: "CacheConfig",
    method: "registerRedis",
    message: "캐시와 Redis 설정 구성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 15,
    type: "config",
    class: "SecurityConfig",
    method: "configureAuth",
    message: "인증/인가 설정 구성이 완료됐어요.",
    result: "SUCCESS",
  },
  {
    id: 31,
    type: "validation",
    class: "BuildValidator",
    method: "fixMissingImport",
    message: "빌드 에러를 분석해 누락된 import를 추가하고 있어요.",
    result: "PENDING",
  },
  {
    id: 31,
    type: "validation",
    class: "BuildValidator",
    method: "fixMissingImport",
    message: "누락된 import 수정으로 컴파일 에러를 해결했어요.",
    result: "SUCCESS",
  },
  {
    id: 32,
    type: "validation",
    class: "BuildValidator",
    method: "fixTypeMismatch",
    message: "DTO와 엔티티 사이 타입 불일치를 수정하고 있어요.",
    result: "PENDING",
  },
  {
    id: 32,
    type: "validation",
    class: "BuildValidator",
    method: "fixTypeMismatch",
    message: "타입 불일치 수정으로 빌드 에러를 해결했어요.",
    result: "SUCCESS",
  },
  {
    id: 33,
    type: "validation",
    class: "BuildValidator",
    method: "fixConstructorArgs",
    message: "생성자 인자 개수 불일치를 수정하고 있어요.",
    result: "PENDING",
  },
  {
    id: 33,
    type: "validation",
    class: "BuildValidator",
    method: "fixConstructorArgs",
    message: "생성자 인자 불일치 수정으로 빌드가 다시 진행돼요.",
    result: "SUCCESS",
  },
  {
    id: 34,
    type: "validation",
    class: "BuildValidator",
    method: "fixRepositoryMethod",
    message: "존재하지 않는 리포지토리 메서드 호출을 수정하고 있어요.",
    result: "PENDING",
  },
  {
    id: 34,
    type: "validation",
    class: "BuildValidator",
    method: "fixRepositoryMethod",
    message: "리포지토리 메서드 시그니처 수정으로 에러를 해결했어요.",
    result: "SUCCESS",
  },
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
  const isProduction = process.env.NODE_ENV === "production";
  const streamDelayMs = isProduction
    ? PRODUCTION_STREAM_DELAY_MS
    : DEFAULT_STREAM_DELAY_MS;
  const statusTransitionDelayMs = isProduction
    ? PRODUCTION_STATUS_TRANSITION_DELAY_MS
    : DEFAULT_STATUS_TRANSITION_DELAY_MS;

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
          await sleep(streamDelayMs);

          for (let index = 0; index < PROCESSING_EVENTS.length; index += 1) {
            const event = PROCESSING_EVENTS[index];
            const previousEvent =
              index > 0 ? PROCESSING_EVENTS[index - 1] : undefined;

            if (
              previousEvent &&
              previousEvent.id === event.id &&
              previousEvent.result === "PENDING" &&
              event.result === "SUCCESS"
            ) {
              await sleep(statusTransitionDelayMs);
            }

            send(toSSEEvent("processing", event));
            await sleep(streamDelayMs);
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
