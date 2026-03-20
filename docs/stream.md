# Streaming API

## 개요

- 엔드포인트: `GET /api/streaming/chat`
- 구현 파일: `web/src/app/api/streaming/chat/route.ts`
- 응답 타입: `text/event-stream; charset=utf-8`
- 목적: 클라이언트와 SSE 연결을 맺고, 추천 카드 구성에 필요한 이벤트를 순차적으로 전송한다.

## 동작 방식

서버는 요청을 받으면 SSE 연결을 열고, 아래 순서대로 이벤트를 전송한다.

1. `prepare` 이벤트 5개 전송
2. `title` 이벤트 분할 전송
3. `sub-title` 이벤트 분할 전송
4. `image` 이벤트 전송
5. `description` 이벤트 15회 분할 전송
6. `next` 이벤트 전송
7. 두 번째 `image` 이벤트 전송
8. 두 번째 `description` 이벤트 15회 분할 전송
9. `false` 이벤트 전송 후 종료

## 이벤트 상세

### 1. prepare

초기 연결 및 준비 상태를 알리는 이벤트다. 총 5개를 순차 전송한다.

```text
event: prepare
data: stream 연결을 시작합니다.

event: prepare
data: 추천 데이터를 준비하고 있습니다.

event: prepare
data: 첫 번째 추천 카드를 불러오는 중입니다.

event: prepare
data: 추천 설명을 순차적으로 전송합니다.

event: prepare
data: 곧 상세 이벤트가 시작됩니다.
```

### 2. title

- 이벤트명: `title`
- 데이터: `이 음식에는 이런 와인이 잘 어울려요!`
- 전송 방식: 6개 chunk로 분할 전송

### 3. sub-title

- 이벤트명: `sub-title`
- 데이터: `와인 종류를 눌러보면 추천 메뉴를 볼 수 있어요.`
- 전송 방식: 6개 chunk로 분할 전송

### 4. image

첫 번째 이미지 경로를 한 번에 전송한다.

```text
event: image
data: /sample/carrot1.png
```

### 5. description

- 이벤트명: `description`
- 데이터: 소비뇨 블랑 페어링 설명 텍스트
- 전송 방식: 15개 chunk로 분할 전송
- 간격: 각 이벤트 사이 `0.5초`

구현상 각 chunk 내부 줄바꿈은 공백으로 정규화한다. 따라서 raw SSE 응답에서는 `description` 이벤트 하나당 `data:` 한 줄만 내려간다.

예시:

```text
event: description
data: 소비뇨 블랑은 보통 산도 높

event: description
data: 고 허브, 시트러스, 풀향이
```

### 6. next

첫 번째 추천 카드 스트림이 끝났음을 알리는 빈 이벤트다.

```text
event: next
data:
```

### 7. image

두 번째 이미지 경로를 한 번에 전송한다.

```text
event: image
data: /sample/carrot4.jpeg
```

두 번째 이미지는 최초 요청에 있던 `/sample/carrot2.png` 대신 실제 존재하는 파일 경로로 맞췄다. 현재 `web/public/sample` 기준 유효한 경로다.

### 8. description

첫 번째 설명과 동일한 내용을 다시 15개 chunk로 나눠 전송한다.

### 9. false

스트림 종료를 알리는 빈 이벤트다.

```text
event: false
data:
```

## 응답 헤더

서버는 SSE 동작을 위해 아래 헤더를 내려준다.

```text
cache-control: no-cache, no-transform
connection: keep-alive
content-type: text/event-stream; charset=utf-8
x-accel-buffering: no
```

추가 설정:

- `runtime = "nodejs"`
- `dynamic = "force-dynamic"`

## 구현 포인트

- `ReadableStream` 기반으로 SSE 응답을 생성한다.
- 이벤트 직렬화는 `event: ...`, `data: ...` 형식으로 구성한다.
- 문자열은 chunk 단위로 잘라 순차 전송한다.
- 클라이언트 연결이 끊기면 `abort`를 감지해 스트림을 정리한다.
- 스트림 종료 시 이벤트 리스너를 제거하고 응답을 닫는다.

## 테스트

실제 서버 실행 후 아래 명령으로 전체 SSE 응답을 캡처했다.

```bash
curl -i --no-buffer --max-time 25 http://127.0.0.1:3000/api/streaming/chat > docs/sse-streaming-chat-response.txt
```

캡처 결과 파일:

- `docs/sse-streaming-chat-response.txt`

확인된 사항:

- `HTTP/1.1 200 OK`
- 초기 5개 메시지는 모두 `event: prepare`
- 이후 `title`, `sub-title`, `image`, `description`, `next`, `image`, `description`, `false` 순서로 응답
- `description` 이벤트는 chunk마다 `data:` 한 줄만 포함
