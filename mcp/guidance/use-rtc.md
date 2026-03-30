# useRtc Usage Guide

대상 파일:

- `web/src/app/shared/rtc/useRtc.tsx`
- `signaling/server.js`

## 개요

`useRtc()`는 WebRTC peer connection과 SockJS/STOMP 기반 signaling을 함께 관리하는 훅이다.

```tsx
const {
  localStream,
  startStream,
  startScreenStream,
  remoteStreams,
  stopRtc,
} = useRtc({
  roomId,
  myKey,
});
```

현재 구현에서 이 훅이 담당하는 일은 아래와 같다.

- 로컬 카메라/마이크 stream 확보
- `RTCPeerConnection` 생성 및 정리
- signaling 서버 연결
- room participant 목록 구독
- offer / answer / ICE candidate 처리
- 원격 `MediaStream[]`를 React state로 노출
- 화면 공유 시 `replaceTrack()` 처리
- 화면 종료 시 RTC 자원 정리

## 전제

### 1. `roomId`와 `myKey`가 반드시 있어야 한다

```tsx
const rtc = useRtc({
  roomId: "room-1",
  myKey: "user-a",
});
```

- `roomId`
  - 실제 room 식별 값
  - 내부적으로 `${roomId}consulting` 형태의 signaling room id로 변환된다
- `myKey`
  - 현재 참가자 고유 key
  - peer signaling topic 경로에 직접 사용된다

### 2. 브라우저 환경에서만 동작한다

이 훅은 아래 브라우저 API를 직접 사용한다.

- `navigator.mediaDevices.getUserMedia`
- `navigator.mediaDevices.getDisplayMedia`
- `RTCPeerConnection`

즉 Server Component나 SSR 실행 문맥에서 직접 사용할 수 없다.

## 제공 API

### `startStream()`

로컬 카메라/마이크를 확보하고, signaling 준비가 끝난 peer와 연결을 시작한다.

```tsx
await startStream();
```

현재 구현 순서:

1. `hasStartedStreamRef.current = true`
2. `getUserMedia({ video: true, audio: true })`
3. signaling 연결이 이미 되어 있으면 `announceStreamStart()`
4. 연결이 아직 안 되어 있으면 로컬 stream만 먼저 시작하고, `onConnect` 후 이어서 negotiation

추가 특징:

- 생성 중인 `getUserMedia()` promise가 있으면 재사용한다
- dispose 이후 늦게 stream이 도착하면 즉시 track을 stop하고 버린다

### `startScreenStream()`

화면 공유를 시작한다.

```tsx
await startScreenStream();
```

현재 구현 순서:

1. 로컬 camera stream 확보
2. `getDisplayMedia({ video: true, audio: true })`
3. 각 peer connection의 video sender를 찾아 `replaceTrack(screenVideoTrack)`
4. 화면 공유 종료 시 원래 local video track으로 복구

현재 구현은 재협상을 하지 않고 기존 sender의 track만 교체한다.

### `remoteStreams`

현재 수신 중인 원격 미디어 스트림 목록이다.

```tsx
remoteStreams.map((stream) => <video key={stream.id} />);
```

주의:

- 이 배열에는 상대 peer의 remote `MediaStream`이 들어간다
- stream id 기준으로 중복 삽입을 막고 있다

### `stopRtc()`

RTC 관련 자원을 직접 정리한다.

```tsx
stopRtc();
```

정리 범위:

- STOMP client deactivate
- local / screen stream track stop
- peer connection close
- participant / peer / ICE / pending map 초기화
- `localStream`, `remoteStreams` state 초기화

### `localStream`

현재 내 카메라/마이크 로컬 미디어 스트림이다.

- `null`이면 아직 로컬 미디어를 시작하지 않은 상태
- UI에서 local preview를 렌더링할 때 사용

## ICE 서버 설정

현재 구현은 coturn 기반 STUN/TURN 서버를 함께 사용한다.

```ts
const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:8.229.223.216:3478", "turn:8.229.223.216:3478"],
      username: "iddyoon",
      credential: "iddyoon",
    },
  ],
};
```

즉:

- `stun:8.229.223.216:3478`
  - public candidate 조회용
- `turn:8.229.223.216:3478`
  - direct connection 실패 시 relay 용

이 값은 coturn 설정과 반드시 일치해야 한다.

## signaling 서버 연결

현재 훅은 아래 URL로 SockJS를 연결한다.

```ts
const SIGNALING_SERVER_URL =
  process.env.NEXT_PUBLIC_RTC_SIGNALING_URL ??
  "https://signaling.iamyounghun.co.kr/api/ws/consulting-room";
```

즉 운영 환경에서는 HTTPS reverse proxy 뒤의 signaling endpoint를 바라본다.

## 시그널링 경로

현재 훅은 아래 destination을 사용한다.

### publish

- `/app/room/join/:roomId`
- `/app/peer/offer/:otherKey/:roomId`
- `/app/peer/answer/:otherKey/:roomId`
- `/app/peer/iceCandidate/:otherKey/:roomId`

### subscribe

- `/topic/room/participants/:roomId`
- `/topic/peer/offer/:myKey/:roomId`
- `/topic/peer/answer/:myKey/:roomId`
- `/topic/peer/iceCandidate/:myKey/:roomId`

## 연결 흐름

현재 구현 기준 실제 흐름은 아래와 같다.

### 1. client 연결

`useEffect()`에서 SockJS + STOMP client를 만들고 `activate()` 한다.

연결 완료 후:

1. room participant 목록 topic 구독
2. offer topic 구독
3. answer topic 구독
4. ICE topic 구독
5. `/app/room/join/:roomId` publish

### 2. room participant 목록 수신

`/topic/room/participants/:roomId`에서 participant key 목록을 받는다.

클라이언트는:

1. 나를 제외한 key만 `otherKeyListRef.current`에 저장
2. 목록에서 빠진 peer는 `cleanupPeerConnection()`으로 정리
3. 이미 `startStream()`이 호출된 상태면, offer 생성 대상 peer에 대해 연결 시작

### 3. offer 생성 규칙

현재 구현은 glare를 줄이기 위해 offer 생성자를 고정한다.

```ts
const shouldCreateOffer = (otherKey: string) =>
  myKey.localeCompare(otherKey) < 0;
```

즉 두 참가자가 동시에 목록을 받아도, 정렬 기준으로 한쪽만 offer를 만든다.

### 4. offer 송신

`announceStreamStart()` 또는 participant 목록 갱신 시:

1. `pcListMapRef.current.has(key)`가 아니어야 함
2. `shouldCreateOffer(key)`가 `true`여야 함
3. `createPeerConnection(key)`
4. `sendOffer(pc, key)`

`sendOffer()`는 아래 조건을 확인한다.

- `pc.signalingState === "stable"`
- `pc.localDescription?.type !== "offer"`

그 다음:

1. `createOffer()`
2. `setLocalDescription(offer)`
3. `/app/peer/offer/:otherKey/:roomId` publish

### 5. offer 수신

`/topic/peer/offer/:myKey/:roomId` 수신 시:

1. `createPeerConnection(key)`
2. `setRemoteDescription(offer)`
3. `flushPendingIceCandidates(key)`
4. `createAnswer()`
5. `setLocalDescription(answer)`
6. `/app/peer/answer/:otherKey/:roomId` publish

### 6. answer 수신

`/topic/peer/answer/:myKey/:roomId` 수신 시:

1. 기존 `RTCPeerConnection` 조회
2. `pc.signalingState === "have-local-offer"`인지 확인
3. `setRemoteDescription(answer)`
4. `flushPendingIceCandidates(key)`

### 7. ICE candidate 교환

로컬 candidate 발생 시:

```tsx
destination: `/app/peer/iceCandidate/${otherKey}/${consultationRoomId}`;
```

원격 candidate 수신 시:

- `remoteDescription`이 아직 없으면 queue에 적재
- 있으면 즉시 `addIceCandidate()`

## 내부 상태 책임

### `hasStartedStreamRef`

- 사용자가 스트림 시작을 시도했는지 표시
- signaling 연결보다 먼저 `startStream()`이 호출된 경우를 처리하기 위해 사용

### `otherKeyListRef`

- 현재 room participant 목록 중 나를 제외한 peer key 목록

### `pcListMapRef`

- `otherKey -> RTCPeerConnection`

### `pendingPeerConnectionRef`

- `otherKey -> Promise<RTCPeerConnection>`
- 같은 peer에 대한 비동기 connection 생성 race를 막는다
- 생성 실패 시 pending entry를 정리해 이후 다시 생성할 수 있게 한다

### `peerStreamMapRef`

- `otherKey -> remote MediaStream`

### `pendingIceCandidatesRef`

- `otherKey -> RTCIceCandidateInit[]`
- remote description이 아직 없을 때 candidate를 임시 저장한다

### `localStreamRef`

- 카메라/마이크 로컬 stream 캐시

### `pendingLocalStreamRef`

- 생성 중인 `getUserMedia()` promise 캐시
- 동시에 여러 번 로컬 stream을 요청해도 한 번만 브라우저 권한 요청이 뜨게 한다

### `screenStreamRef`

- 화면 공유 stream 캐시

### `isDisposedRef`

- cleanup 이후 늦게 도착한 async media 결과를 무시하기 위한 플래그

## `createPeerConnection()` 구현 특징

현재 구현은 단순 map 조회만 하지 않고, 생성 중인 promise도 같이 추적한다.

즉:

1. 이미 생성된 peer connection이 있으면 재사용
2. 생성 중인 promise가 있으면 그 promise를 재사용
3. 새 `RTCPeerConnection` 생성
4. `onicecandidate`, `ontrack`, `onconnectionstatechange` 등록
5. 로컬 stream track 추가

이 패턴은 participant 목록 이벤트가 짧은 시간 안에 여러 번 와도 동일 peer에 대해 중복 connection이 생기는 것을 줄인다.
또한 생성 도중 실패해도 pending entry를 반드시 비우므로, 다음 signaling 이벤트에서 재시도할 수 있다.

## 화면 공유 규칙

현재 구현은 각 peer connection의 video sender를 찾아 `replaceTrack()` 한다.

즉:

- 새 offer/answer를 다시 만들지 않는다
- 기존 연결 위에서 video track만 교체한다

화면 공유 종료 시:

- screen stream 제거
- local video track으로 복구

## cleanup

`stopRtc()` 또는 훅 unmount 시 아래 정리를 수행한다.

- STOMP subscription `unsubscribe()`
- screen stream track stop
- local stream track stop
- 모든 peer connection `close()`
- pending peer connection map 초기화
- peer / ice / participant 상태 초기화
- `remoteStreams` 비우기
- STOMP client `deactivate()`

즉 화면을 떠나면 연결 상태를 기본적으로 정리한다.
UI에서는 `RtcRoom`이 브라우저 이탈 시 현재 `localStream`을 직접 stop한 뒤 `stopRtc()`를 호출하는 방식으로 함께 정리한다.

## 가장 중요한 규칙

### 1. `myKey`는 반드시 고유해야 한다

현재 topic 경로가 `myKey`에 의존한다.

즉 `myKey`가 겹치면:

- offer / answer를 잘못 받을 수 있고
- 다른 사용자의 ICE candidate를 섞어 받을 수 있다

### 2. room id 규칙을 바꾸면 signaling 서버도 같이 맞춰야 한다

현재 room id는 아래 규칙이다.

```ts
const consultationRoomId = `${roomId}consulting`;
```

signaling 서버는 이 room id를 기준으로 participant 목록과 peer topic을 관리한다.

### 3. STUN/TURN 값이 coturn 설정과 달라지면 연결이 흔들릴 수 있다

현재 ICE 서버 정보는 별도 env가 아니라 코드에 있다.

즉 아래 항목이 달라지면 클라이언트도 같이 바꿔야 한다.

- external IP
- username
- credential
- listening port

### 4. signaling 서버 경로를 바꾸면 client도 같이 바꿔야 한다

현재 훅은 특정 HTTPS signaling endpoint를 직접 바라본다.

운영 주소를 바꿨으면 `SIGNALING_SERVER_URL`도 같이 맞춰야 한다.

## 권장 사용 예시

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useRtc } from "@/app/shared/rtc/useRtc";

export function RtcRoom() {
  const myKeyRef = useRef(crypto.randomUUID());
  const {
    localStream,
    startStream,
    startScreenStream,
    remoteStreams,
    stopRtc,
  } = useRtc({
    roomId: "room-1",
    myKey: myKeyRef.current,
  });

  useEffect(() => {
    void startStream();
    return () => {
      stopRtc();
    };
  }, [startStream, stopRtc]);

  return (
    <div>
      <button onClick={() => void startScreenStream()}>화면 공유</button>
      <p>local: {localStream ? "ready" : "pending"}</p>
      <p>remote count: {remoteStreams.length}</p>
    </div>
  );
}
```
