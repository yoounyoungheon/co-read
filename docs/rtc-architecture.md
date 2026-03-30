# RTC Architecture

이 문서는 현재 레포의 RTC 플레이그라운드 구현을 기준으로 클라이언트-서버 구조, `useRtc` 훅의 책임과 구현, signaling 서버의 책임과 구현을 정리한다.

대상 코드:

- `web/src/app/shared/rtc/useRtc.tsx`
- `web/src/app/feature/play-ground/rtc/ui/RtcRoom.tsx`
- `signaling/server.js`

## 개요

현재 RTC 구조는 아래 3개 레이어로 나뉜다.

1. UI 레이어
2. 클라이언트 RTC 훅 레이어
3. signaling 서버 레이어

역할 분리는 다음과 같다.

- UI는 로컬/원격 스트림을 보여주고 화면 공유 같은 사용자 액션만 연결한다.
- `useRtc`는 브라우저 WebRTC 상태와 signaling 메시지 흐름을 함께 관리한다.
- signaling 서버는 room 참가자 목록과 STOMP destination 브로드캐스트를 관리한다.

실제 미디어는 브라우저 간 `RTCPeerConnection`으로 직접 오가고, signaling 서버는 offer/answer/ICE candidate와 room participant 목록만 중계한다.

## 전체 아키텍처

```text
RtcRoom / StreamCard
        |
        v
     useRtc
        |
        +-- getUserMedia / getDisplayMedia
        +-- RTCPeerConnection
        +-- SockJS + STOMP
                |
                v
         signaling/server.js
                |
                +-- room participant registry
                +-- destination subscription registry
                +-- offer / answer / iceCandidate relay
```

## 클라이언트-서버 상호작용

현재 상호작용 흐름은 아래 순서다.

1. `RtcRoom`이 마운트되면 `useRtc`를 사용한다.
2. `useRtc`는 SockJS/STOMP client를 생성하고 signaling 서버에 연결한다.
3. 연결이 완료되면 현재 room에 `join` 메시지를 보낸다.
4. signaling 서버는 room participant 목록을 갱신하고 `/topic/room/participants/:roomId`로 브로드캐스트한다.
5. 각 클라이언트는 participant 목록을 보고, 자기보다 정렬 순서가 뒤인 peer에 대해서만 offer를 만든다.
6. offer를 받은 상대는 answer를 만든다.
7. 양쪽은 ICE candidate를 교환한다.
8. 연결이 성립되면 `ontrack`으로 들어온 원격 `MediaStream`을 UI가 렌더링한다.

핵심은 다음 두 가지다.

- room participant discovery는 서버가 authoritative 하게 관리한다.
- 실제 peer negotiation은 클라이언트 `useRtc`가 수행한다.

### 시퀀스 다이어그램

아래는 두 참가자 A, B가 같은 room에 들어와 연결되는 현재 흐름이다.

```text
Participant A        useRtc A            Signaling Server         useRtc B         Participant B
     |                  |                       |                     |                  |
     | open room        |                       |                     | open room        |
     |----------------->|                       |                     |----------------->|
     |                  | connect SockJS/STOMP |                     |                  |
     |                  |---------------------->|                     |                  |
     |                  | join room            |                     |                  |
     |                  |---------------------->|                     |                  |
     |                  |                       | participants=[A]    |                  |
     |                  |<----------------------|                     |                  |
     |                  | start local stream    |                     |                  |
     |                  |                       |                     | connect SockJS/STOMP
     |                  |                       |<--------------------|                  |
     |                  |                       | room join(B)        |                  |
     |                  |                       |<--------------------|                  |
     |                  |                       | participants=[A,B]  |                  |
     |                  |<----------------------|-------------------->|                  |
     |                  | create offer if       |                     |                  |
     |                  | shouldCreateOffer(B)  |                     |                  |
     |                  |---------------------->| offer to B          |                  |
     |                  |                       |-------------------->| setRemoteDescription
     |                  |                       |                     | createAnswer
     |                  |                       | answer to A         |----------------->|
     |                  |<----------------------|                     |                  |
     | setRemoteAnswer  |                       |                     |                  |
     |                  | ICE candidate         |                     | ICE candidate    |
     |                  |<--------------------->|<------------------->|                  |
     |                  | ontrack(remote stream)|                     | ontrack(remote stream)
     |<-----------------|                       |                     |----------------->|
```

조금 더 간단히 보면 아래 4단계다.

1. 각 클라이언트가 signaling 서버에 room join을 등록한다.
2. 서버가 room participant 목록을 브로드캐스트한다.
3. offer 생성 규칙에 따라 한쪽만 offer를 보내고, 다른 쪽이 answer를 보낸다.
4. 양쪽이 ICE candidate를 교환하고 `ontrack`으로 원격 스트림을 받는다.

## UI 레이어

관련 파일:

- `web/src/app/feature/play-ground/rtc/ui/RtcRoom.tsx`
- `web/src/app/feature/play-ground/rtc/ui/StreamCard.tsx`

### `RtcRoom`의 역할

`RtcRoom`은 RTC 화면의 진입 컴포넌트다.

- `roomId`를 props로 받는다.
- 현재 탭의 `myKey`를 랜덤 UUID로 1회 생성한다.
- `useRtc({ roomId, myKey })`를 호출한다.
- 마운트 시 `startStream()`을 자동 실행한다.
- 브라우저 이탈 시 현재 로컬 스트림을 직접 stop한 뒤 `stopRtc()`를 호출한다.
- `localStream`, `remoteStreams`, `startScreenStream()`을 UI에 연결한다.

즉 `RtcRoom`은 RTC 정책을 구현하지 않고, `useRtc`가 제공하는 상태와 액션을 화면에 연결하는 thin wrapper에 가깝다.

### `StreamCard`의 역할

`StreamCard`는 `MediaStream`을 `<video>`에 붙여 렌더링하는 프레젠테이션 컴포넌트다.

- `stream`이 있으면 `video.srcObject`에 연결한다.
- `stream`이 없으면 placeholder를 보여준다.
- `muted`, `mirror`, `emptyLabel` 같은 화면 옵션만 가진다.

## `useRtc`의 역할

관련 파일:

- `web/src/app/shared/rtc/useRtc.tsx`

`useRtc`는 현재 구현의 핵심이다. 이 훅은 아래 책임을 동시에 가진다.

1. 로컬 미디어 확보
2. peer connection 생성/정리
3. signaling 서버 연결
4. room participant 목록 구독
5. offer/answer/ICE 처리
6. 원격 스트림 상태를 React state로 노출
7. 화면 공유 track 교체

### 입력

```ts
useRtc({
  roomId,
  myKey,
})
```

- `roomId`
  - 화면에서 받은 방 ID
  - 내부적으로 `${roomId}consulting` 형태의 signaling room ID로 변환된다
- `myKey`
  - 현재 참가자 고유 키
  - peer signaling topic 경로에 직접 사용된다

### 출력

```ts
{
  localStream,
  startStream,
  startScreenStream,
  remoteStreams,
  stopRtc,
}
```

### 내부 상태와 자료구조

`useRtc`는 React state와 ref를 함께 사용한다.

- `localStream`
  - 내 로컬 카메라/마이크 스트림
- `remoteStreams`
  - 현재 화면에 렌더링할 원격 `MediaStream[]`
- `hasStartedStreamRef`
  - 스트림 시작 시도가 있었는지 표시
- `otherKeyListRef`
  - room participant 목록 중 나를 제외한 peer key 목록
- `pcListMapRef`
  - `otherKey -> RTCPeerConnection`
- `pendingPeerConnectionRef`
  - 동일 peer에 대한 중복 connection 생성을 막기 위한 promise map
- `peerStreamMapRef`
  - `otherKey -> remote MediaStream`
- `pendingIceCandidatesRef`
  - remote description 적용 전 받은 ICE candidate queue
- `clientRef`
  - STOMP client 인스턴스
- `localStreamRef`
  - 로컬 스트림 캐시
- `screenStreamRef`
  - 화면 공유 스트림 캐시
- `isDisposedRef`
  - cleanup 이후 늦게 도착한 async media 결과를 무시하기 위한 dispose 플래그
- `pendingLocalStreamRef`
  - 중복 `getUserMedia()` 호출을 막기 위한 pending promise 캐시

### offer 생성 규칙

현재 구현은 glare를 줄이기 위해 offer 발신자를 고정한다.

```ts
const shouldCreateOffer = (otherKey) => myKey.localeCompare(otherKey) < 0;
```

즉 두 참가자 모두 room participant 목록을 받아도, 한쪽만 offer를 만든다.

### 로컬 미디어 확보

`ensureLocalStream()`은 `navigator.mediaDevices.getUserMedia()`를 호출해 카메라/마이크 스트림을 확보한다.

특징:

- 한 번 얻은 스트림은 `localStreamRef`에 저장해 재사용한다.
- 생성 중인 promise가 있으면 `pendingLocalStreamRef`를 재사용한다.
- React state `localStream`도 함께 갱신해 UI preview에 사용한다.
- dispose 이후 늦게 도착한 stream은 즉시 track을 stop하고 버린다.

### peer connection 생성

`createPeerConnection(otherKey)`는 아래 순서로 동작한다.

1. 이미 생성된 peer connection이 있으면 재사용한다.
2. 생성 중인 promise가 있으면 그 promise를 재사용한다.
3. 새 `RTCPeerConnection`을 만든다.
4. 로컬 스트림의 audio/video track을 sender로 추가한다.
5. `onicecandidate`, `ontrack`, `onconnectionstatechange` 핸들러를 등록한다.

이 함수는 peer connection 중복 생성 race를 막기 위해 `pendingPeerConnectionRef`를 사용한다.
또한 생성 도중 실패해도 pending entry를 정리하므로, 이후 같은 peer에 대해 다시 생성 시도할 수 있다.

### signaling 연결

`useEffect()` 안에서 SockJS와 STOMP client를 초기화한다.

현재 signaling URL:

- `NEXT_PUBLIC_RTC_SIGNALING_URL`
- 미지정 시 기본값: `https://signaling.iamyounghun.co.kr/api/ws/consulting-room`

연결 완료 후 하는 일:

1. room participant topic 구독
2. offer topic 구독
3. answer topic 구독
4. ICE topic 구독
5. `/app/room/join/:roomId` publish
6. 이미 `startStream()`이 호출된 상태면 negotiation 재개

### room participant 처리

participant 목록은 `/topic/room/participants/:roomId`에서 받는다.

메시지는 `string[]` 형식의 participant key 목록이다.

클라이언트는 이 목록을 받아서:

1. 나를 제외한 key만 `otherKeyListRef`에 저장한다.
2. 목록에서 빠진 peer는 `cleanupPeerConnection()`으로 정리한다.
3. `hasStartedStreamRef.current === true`이고 signaling이 연결된 상태면
   offer 생성 대상 peer에 대해서만 `createPeerConnection()`과 `sendOffer()`를 실행한다.

### offer / answer 처리

#### offer 송신

`sendOffer(pc, otherKey)`는:

1. `pc.signalingState === "stable"`인지 확인한다.
2. 기존 local offer가 있으면 다시 보내지 않는다.
3. `createOffer()`
4. `setLocalDescription(offer)`
5. `/app/peer/offer/:otherKey/:roomId` publish

#### offer 수신

`/topic/peer/offer/:myKey/:roomId` 수신 시:

1. 상대 peer connection을 준비한다.
2. `setRemoteDescription(offer)`
3. queue된 ICE candidate를 flush 한다.
4. `createAnswer()`
5. `setLocalDescription(answer)`
6. `/app/peer/answer/:otherKey/:roomId` publish

#### answer 수신

`/topic/peer/answer/:myKey/:roomId` 수신 시:

1. 기존 peer connection을 찾는다.
2. `signalingState === "have-local-offer"`일 때만 처리한다.
3. `setRemoteDescription(answer)`
4. queue된 ICE candidate를 flush 한다.

### ICE candidate 처리

ICE candidate는 peer별 topic으로 교환한다.

- 송신: `/app/peer/iceCandidate/:otherKey/:roomId`
- 수신: `/topic/peer/iceCandidate/:myKey/:roomId`

원격 description이 아직 없으면 즉시 `addIceCandidate()`하지 않고 `pendingIceCandidatesRef`에 적재한다. 이후 `flushPendingIceCandidates()`에서 한 번에 적용한다.

### 원격 스트림 처리

`pc.ontrack`에서 받은 `event.streams[0]`를 `peerStreamMapRef`와 `remoteStreams`에 반영한다.

중복 스트림 ID는 React state에 다시 넣지 않는다.

### 화면 공유 처리

`startScreenStream()`은 재협상을 하지 않고 기존 sender의 video track만 교체한다.

흐름:

1. `getDisplayMedia()`
2. 각 peer connection의 video sender를 찾는다.
3. `replaceTrack(screenVideoTrack)`
4. 공유가 끝나면 다시 `replaceTrack(localVideoTrack)`

### cleanup

`stopRtc()` 또는 훅 unmount 시:

- STOMP subscription 해제
- screen/local stream track stop
- 모든 peer connection close
- participant/ICE/pending connection map 초기화
- `remoteStreams` 초기화
- STOMP client deactivate

추가로 UI 레이어인 `RtcRoom`도 브라우저 이탈 시 현재 `localStream`을 직접 stop한 뒤 `stopRtc()`를 호출한다.
즉 실제 미디어 정리는 `useRtc`와 `RtcRoom`이 함께 수행한다.

## signaling 서버의 역할

관련 파일:

- `signaling/server.js`

signaling 서버는 media relay 서버가 아니다. 이 서버는 아래 두 역할만 한다.

1. room participant registry 유지
2. STOMP destination 기준 signaling 메시지 브로드캐스트

즉 offer/answer/ICE를 해석하거나 WebRTC 세션 상태를 깊게 관리하지 않는다. room 참가자 목록과 publish-subscribe 라우팅만 담당한다.

## signaling 서버 구현

### 기반 구성

서버는 `express + http + sockjs`로 구성되어 있다.

- health endpoint: `GET /health`
- sockjs endpoint: `/api/ws/consulting-room`

### 핵심 저장소

- `connections`
  - `sessionId -> connectionState`
- `destinationSubscriptions`
  - `destination -> subscribers`
- `roomParticipants`
  - `roomId -> Map<participantKey, sessionId>`

### connectionState

각 SockJS 연결은 대략 아래 상태를 가진다.

```ts
{
  sessionId,
  connection,
  connected,
  subscriptions,
  joinedRooms,
  buffer,
}
```

여기서 `joinedRooms`는 이 연결이 어떤 room에 어떤 participant key로 등록되었는지를 기록한다.

### frame 처리

서버는 간단한 STOMP frame parser를 직접 구현하고 있다.

지원하는 명령:

- `CONNECT`, `STOMP`
- `SUBSCRIBE`
- `UNSUBSCRIBE`
- `SEND`
- `DISCONNECT`

### room join 처리

클라이언트가 `/app/room/join/:roomId`로 자신의 `myKey`를 보내면:

1. `roomParticipants`에 `roomId -> key -> sessionId`를 저장한다.
2. 같은 연결에서 기존 key가 있었다면 교체한다.
3. `/topic/room/participants/:roomId`로 최신 participant key 목록을 broadcast 한다.

### peer signaling relay

서버는 아래 publish destination을 topic으로 그대로 매핑한다.

- `/app/peer/offer/:otherKey/:roomId`
  -> `/topic/peer/offer/:otherKey/:roomId`
- `/app/peer/answer/:otherKey/:roomId`
  -> `/topic/peer/answer/:otherKey/:roomId`
- `/app/peer/iceCandidate/:otherKey/:roomId`
  -> `/topic/peer/iceCandidate/:otherKey/:roomId`

즉 서버는 message body를 해석하지 않고 그대로 브로드캐스트한다.

### 연결 종료 처리

SockJS 연결이 닫히면:

1. `joinedRooms`에 등록된 room participant를 제거한다.
2. 각 room마다 최신 participant 목록을 다시 broadcast 한다.
3. subscription을 해제한다.
4. `connections`에서 세션을 제거한다.

## 현재 구조의 장점

- 구현이 작고 단순하다.
- signaling 서버가 room participant 목록과 메시지 relay만 담당하므로 분리가 명확하다.
- media는 브라우저 간 직접 연결이라 서버 부하가 낮다.
- `useRtc` 하나로 RTC 실험 화면을 빠르게 붙일 수 있다.

## 현재 구조의 한계

- `useRtc`가 signaling과 peer negotiation을 모두 갖고 있어 훅 책임이 크다.
- 서버는 participant 목록만 authoritative 하게 관리하고, negotiation 상태는 클라이언트에 위임한다.
- full perfect negotiation 패턴까지 구현된 것은 아니다.
- TURN/STUN 설정이 최소 수준이고 코드에 하드코딩돼 있다.
- participant state, signaling state, connection state를 UI에서 직접 보지 않으면 디버깅이 어렵다.

## 추천 다음 단계

안정성을 더 올리려면 보통 아래 순서로 확장한다.

1. peer별 debug state를 UI에 노출
2. negotiation 상태를 명시적인 상태 머신으로 분리
3. server-side participant metadata 확장
4. TURN/STUN 설정 외부화
5. reconnect / retry 전략 추가

## 요약

현재 RTC 아키텍처는 다음처럼 이해하면 된다.

- `RtcRoom`은 화면과 사용자 액션만 담당한다.
- `useRtc`는 local media, peer connection, signaling, negotiation의 중심이다.
- signaling 서버는 room participant registry와 publish-subscribe relay를 담당한다.
- 실제 media는 서버를 거치지 않고 브라우저 간 직접 전달된다.
