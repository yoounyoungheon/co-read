# useSSE Usage Guide

대상 파일:

- `web/src/app/shared/sse/business/hook/useSSE.tsx`
- `web/src/app/shared/sse/business/context/sseContext.tsx`
- `web/src/app/shared/sse/types/view.model.ts`

## 개요

`useSSE()`는 공통 SSE 컨텍스트를 읽는 훅이다.

```tsx
const { open, close, sseState, errorMessage } = useSSE();
```

이 훅은 직접 `EventSource`를 만들지 않고, `SSEProvider`가 관리하는 공통 연결 상태를 사용한다.

## 전제

반드시 `SSEProvider` 안에서만 사용한다.

```tsx
<SSEProvider>
  <YourClientComponent />
</SSEProvider>
```

## 제공 API

### `open(url, handlers)`

SSE 연결을 시작한다.

```tsx
open("/api/streaming/chat", [
  {
    eventName: "message",
    handle: (event) => {
      const payload = JSON.parse(event.data);
    },
  },
]);
```

인자:

- `url`: SSE endpoint
- `handlers`: `addEventListener`에 붙일 이벤트 핸들러 목록

### `close()`

현재 SSE 연결을 안전하게 닫고 리스너를 정리한다.

```tsx
close();
```

### `sseState`

상태 리터럴은 아래 4개다.

- `NONE_CONNECTION`
- `CONNECTING`
- `OPEN`
- `CLOSED`

### `errorMessage`

SSE 연결 도중 발생한 최근 에러 메시지다.

## 상태 의미

### `NONE_CONNECTION`

- 아직 연결한 적 없거나
- provider unmount 후 초기화된 상태

### `CONNECTING`

- `open()` 직후 연결 시도 중
- 브라우저 재시도 중일 때도 이 상태를 쓴다

### `OPEN`

- 연결이 열렸거나
- heartbeat / message를 정상 수신한 상태

### `CLOSED`

- `close()`를 명시적으로 호출해서 닫은 상태

## 가장 중요한 규칙

### 1. 중복 `open()` 금지

현재 구현은 이미 활성 연결이 있으면 두 번째 `open()`을 무시한다.

즉 아래 패턴을 지켜야 한다.

```tsx
close();
open(url, handlers);
```

연결을 다시 시작할 가능성이 있으면 항상 먼저 `close()`를 호출한다.

### 2. 종료 시 `close()` 호출

아래 경우에는 반드시 `close()`를 호출한다.

- `FINISH` 같은 종료 이벤트를 받았을 때
- 새 요청을 보내기 직전 이전 연결을 정리할 때
- 컴포넌트가 다른 흐름으로 넘어갈 때

### 3. 연결 하나당 채널 하나로 생각하기

현재 공통 `SSEProvider`는 내부적으로 `EventSource` 하나만 관리한다.

즉:

- 여러 SSE를 동시에 병렬로 관리하는 용도가 아니다
- 같은 화면에서 여러 stream을 동시에 열고 싶으면 현재 공통 모듈 구조와 맞지 않는다

## 이벤트 핸들러 작성 규칙

핸들러는 `MessageEvent`를 받는다.

```tsx
{
  eventName: "message",
  handle: (event) => {
    const payload = JSON.parse(event.data);
  },
}
```

권장:

- `try/catch`로 `JSON.parse()` 감싸기
- 지원하는 이벤트 타입만 분기 처리
- 종료 이벤트를 받으면 `close()` 호출

예:

```tsx
handle: (event) => {
  let payload;

  try {
    payload = JSON.parse(event.data);
  } catch {
    return;
  }

  if (payload.type === "FINISH") {
    close();
    return;
  }
}
```

## 채팅 UI에서의 권장 사용 순서

예: 와인 추천 SSE

1. 사용자가 메시지 전송
2. 기존 연결이 있으면 `close()`
3. `open("/api/streaming/chat", handlers)`
4. `message` 이벤트마다 UI 상태 갱신
5. `FINISH` 이벤트에서 `close()`

## 하지 말아야 할 것

### 1. `open()` 연속 호출

잘못된 예:

```tsx
open("/api/streaming/chat", handlers);
open("/api/streaming/chat", handlers);
```

현재 구현에서는 두 번째 호출이 경고만 찍고 무시된다.

### 2. `useSSE`를 공통 상태 저장소처럼 사용

`useSSE`는 연결 수명주기 관리용이다.
도메인 데이터 저장소가 아니다.

즉 아래 값은 `useSSE`에 넣지 않는다.

- 채팅 답변 문자열
- 카드 리스트
- 추천 결과 데이터

이런 값은 feature UI 내부 상태나 별도 도메인 상태에서 관리한다.

### 3. `message` 이벤트만 온다고 가정하기

SSE 응답은 아래처럼 올 수 있다.

- `message`
- heartbeat comment (`:heartbeat`)
- JSON이 아닌 데이터

따라서 파싱 실패를 항상 허용해야 한다.

## 현재 구현 특성

`sseContext.tsx` 기준 동작:

- `EventSource` 인스턴스 1개만 관리
- 실제 등록된 리스너만 제거하는 safe cleanup 사용
- `close()` 또는 unmount에서 정리
- 브라우저 기본 재시도 정책을 그대로 사용
- 에러 시 `sseState`를 `CONNECTING`으로 둠

## 권장 예시

```tsx
const { open, close } = useSSE();

useEffect(() => {
  open("/api/streaming/chat", [
    {
      eventName: "message",
      handle: (event) => {
        let payload;

        try {
          payload = JSON.parse(event.data);
        } catch {
          return;
        }

        if (payload.type === "FINISH") {
          close();
          return;
        }
      },
    },
  ]);

  return () => {
    close();
  };
}, [close, open]);
```

## 결론

`useSSE()`는 공통 SSE 연결 수명주기 관리용이다.

- 연결 시작은 `open()`
- 종료는 `close()`
- 중복 연결 금지
- 도메인 데이터는 별도 상태에서 관리
- 종료 이벤트에서는 명시적으로 `close()` 호출
