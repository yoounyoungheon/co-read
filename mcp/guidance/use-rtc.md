# useRtc Usage Guide

대상 파일:

- `web/src/app/shared/rtc/useRtc.tsx`

## 개요

`useRtc()`는 WebRTC 피어 연결과 SockJS/STOMP 기반 시그널링을 함께 관리하는 훅이다.

```tsx
const { startStream, startScreenStream, remoteStreams } = useRtc({
  id,
  myKey,
});
```

이 훅은 아래 3가지를 한 번에 담당한다.

- 로컬 카메라/마이크 확보
- `RTCPeerConnection` 생성 및 offer/answer/iceCandidate 처리
- SockJS + STOMP로 상대 peer와 시그널링 메시지 교환

## 전제

### 1. `id`와 `myKey`가 반드시 있어야 한다

```tsx
const { startStream, startScreenStream, remoteStreams } = useRtc({
  id: "room-1",
  myKey: "user-a",
});
```

- `id`
  - 실제 room id의 베이스 값
  - 내부적으로 `${id}consulting` 형태의 `roomId`로 변환된다
- `myKey`
  - 현재 사용자 식별 키
  - 시그널링 topic 경로에 그대로 들어간다

### 2. 브라우저 환경에서만 동작한다

이 훅은 아래 API를 직접 사용한다.

- `navigator.mediaDevices.getUserMedia`
- `navigator.mediaDevices.getDisplayMedia`
- `RTCPeerConnection`

즉 서버 컴포넌트나 SSR 실행 문맥에서 직접 쓰면 안 된다.

## 제공 API

### `startStream()`

로컬 카메라/마이크를 확보하고, 시그널링을 시작한다.

```tsx
await startStream();
```

현재 구현 순서:

1. STOMP client 연결 여부 확인
2. `getUserMedia({ video: true, audio: true })`
3. `/app/call/key` publish
4. 수집된 상대 key 목록 기준으로 peer connection 생성
5. 각 상대에게 offer 전송

### `startScreenStream()`

화면 공유를 시작한다.

```tsx
await startScreenStream();
```

현재 구현 순서:

1. 로컬 카메라 stream 확보
2. `getDisplayMedia({ video: true, audio: true })`
3. 각 peer의 video sender를 screen track으로 교체
4. 화면 공유 종료 시 원래 로컬 video track으로 복구

### `remoteStreams`

현재 수신 중인 원격 미디어 스트림 목록이다.

```tsx
remoteStreams.map((stream) => (
  <video key={stream.id} ref={(node) => {}} />
));
```

주의:

- 이 배열에는 상대 peer stream이 들어간다
- 현재 구현에서는 화면 공유 stream도 일시적으로 추가될 수 있다

## 시그널링 경로

현재 훅은 SockJS + STOMP로 아래 목적지를 사용한다.

### publish

- `/app/call/key`
- `/app/send/key`
- `/app/peer/offer/:otherKey/:roomId`
- `/app/peer/answer/:otherKey/:roomId`
- `/app/peer/iceCandidate/:otherKey/:roomId`

### subscribe

- `/topic/call/key`
- `/topic/send/key`
- `/topic/peer/offer/:myKey/:roomId`
- `/topic/peer/answer/:myKey/:roomId`
- `/topic/peer/iceCandidate/:myKey/:roomId`

## 연결 흐름

현재 구현 기준 실제 흐름은 아래와 같다.

### 1. `startStream()` 호출

내가 먼저 스트림 시작을 선언한다.

```tsx
client.publish({
  destination: `/app/call/key`,
  body: "publish: call/key",
});
```

### 2. 다른 클라이언트가 `/topic/call/key`를 수신

수신한 클라이언트는 자기 `myKey`를 `/app/send/key`로 다시 보낸다.

```tsx
client.publish({
  destination: `/app/send/key`,
  body: JSON.stringify(myKey),
});
```

### 3. `/topic/send/key` 수신 시 상대 key 목록 저장

자기 자신이 아니고 아직 없으면 `otherKeyListRef.current`에 넣는다.

```tsx
if (key !== myKey && !otherKeyListRef.current.includes(key)) {
  otherKeyListRef.current.push(key);
}
```

### 4. `startStream()`은 현재 수집된 상대 key를 기준으로 offer 전송

각 key마다:

1. `RTCPeerConnection` 생성
2. 로컬 트랙 추가
3. `createOffer()`
4. `setLocalDescription()`
5. `/app/peer/offer/:otherKey/:roomId` 전송

### 5. offer를 받은 쪽은 answer 생성

`/topic/peer/offer/:myKey/:roomId` 수신 시:

1. 해당 상대용 peer connection 생성
2. `setRemoteDescription(offer)`
3. 대기 중이던 ICE candidate flush
4. `createAnswer()`
5. `setLocalDescription(answer)`
6. `/app/peer/answer/:otherKey/:roomId` 전송

### 6. answer를 받은 쪽은 연결 완료

`/topic/peer/answer/:myKey/:roomId` 수신 시:

1. 기존 peer connection 조회
2. `setRemoteDescription(answer)`
3. 대기 중이던 ICE candidate flush

### 7. ICE candidate는 별도 topic으로 교환

로컬 candidate 발생 시:

```tsx
destination: `/app/peer/iceCandidate/${otherKey}/${roomId}`
```

원격 candidate 수신 시:

- 아직 `remoteDescription`이 없으면 queue에 적재
- 있으면 즉시 `addIceCandidate()`

## 내부 상태 책임

### `otherKeyListRef`

- 현재 room에서 연결 후보가 되는 상대 key 목록

### `pcListMapRef`

- `otherKey -> RTCPeerConnection`

### `peerStreamMapRef`

- `otherKey -> remote MediaStream`

### `pendingIceCandidatesRef`

- `otherKey -> RTCIceCandidateInit[]`
- remote description이 아직 없는 동안 candidate를 임시 저장한다

### `localStreamRef`

- 카메라/마이크 로컬 스트림
- 한 번 얻은 뒤 재사용한다

### `screenStreamRef`

- 화면 공유 스트림
- 공유 종료 시 track stop 후 `null`로 초기화한다

## 화면 공유 규칙

현재 구현은 각 peer connection의 video sender를 찾아 `replaceTrack()` 한다.

즉:

- 새 offer/answer를 다시 만들지 않는다
- 기존 연결 위에서 video track만 바꾼다

화면 공유 종료 시:

- screen track 제거
- 원래 local video track으로 복구

## cleanup

훅 unmount 시 아래 정리를 수행한다.

- STOMP subscription `unsubscribe()`
- screen stream track stop
- local stream track stop
- 모든 peer connection `close()`
- peer/ice queue/map 초기화
- `remoteStreams` 비우기
- STOMP client `deactivate()`

즉 화면을 떠날 때 연결을 수동으로 따로 정리하지 않아도 기본 cleanup은 있다.

## 가장 중요한 규칙

### 1. `myKey`는 반드시 고유해야 한다

현재 topic 경로가 `myKey`에 의존한다.

즉 `myKey`가 겹치면:

- offer/answer를 잘못 받거나
- 다른 사용자의 candidate를 섞어서 받을 수 있다

### 2. room id 규칙을 바꾸면 서버도 같이 바꿔야 한다

현재 room id는 아래 규칙이다.

```ts
const roomId = `${id}consulting`;
```

시그널링 서버가 이 경로를 그대로 라우팅한다고 가정한다.

### 3. 원격 video 렌더링은 `MediaStream` 단위로 한다

`remoteStreams`는 `MediaStream[]`이다.
트랙이 아니라 stream 자체를 `<video>.srcObject`로 연결해야 한다.

## 현재 구현 특성

- SockJS URL이 하드코딩돼 있다
  - `https://mhsls.site/api/ws/consulting-room`
- TURN 서버 자격 증명이 코드 안에 들어 있다
- 로컬 stream은 peer마다 새로 열지 않고 한 번만 재사용한다
- ICE candidate는 queue 후 flush 방식으로 처리한다
- connection state가 `disconnected`, `failed`, `closed`면 해당 peer를 정리한다

## 하지 말아야 할 것

### 1. `myKey` 없이 사용

잘못된 예:

```tsx
useRtc({ id: "room-1", myKey: "" });
```

이 경우 topic 경로가 깨진다.

### 2. `remoteStreams`를 도메인 데이터처럼 가공 저장

이 값은 렌더링용 미디어 상태다.
영속 상태 저장소처럼 다루지 않는다.

### 3. signaling 서버 경로를 바꾸고 client를 그대로 두기

현재 훅은 특정 SockJS endpoint를 직접 바라본다.
서버를 새로 띄웠으면 이 URL도 같이 맞춰야 한다.

## 권장 사용 예시

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useRtc } from "@/app/shared/rtc/useRtc";

export function RtcRoom() {
  const { startStream, startScreenStream, remoteStreams } = useRtc({
    id: "room-1",
    myKey: "user-a",
  });

  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    remoteStreams.forEach((stream) => {
      const node = videoRefs.current.get(stream.id);

      if (node) {
        node.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  return (
    <div>
      <button onClick={() => void startStream()}>통화 시작</button>
      <button onClick={() => void startScreenStream()}>화면 공유</button>

      {remoteStreams.map((stream) => (
        <video
          key={stream.id}
          ref={(node) => {
            if (node) {
              videoRefs.current.set(stream.id, node);
            } else {
              videoRefs.current.delete(stream.id);
            }
          }}
          autoPlay
          playsInline
        />
      ))}
    </div>
  );
}
```
