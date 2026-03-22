# useChat Usage Guide

대상 파일:

- `web/src/app/feature/play-ground/chat/business/hook/useChat.tsx`
- `web/src/app/feature/play-ground/chat/business/context/chat.context.tsx`
- `web/src/app/feature/play-ground/chat/types/view.model.ts`

## 개요

`useChat()`은 `ChatProvider`가 관리하는 공통 채팅 컨텍스트를 읽는 훅이다.

```tsx
const { chattingRoom, sendMessage, receiveMessage, updateChat } = useChat();
```

이 컨텍스트가 관리하는 단위는 `chattingRoom.chats` 안의 `Chat` 아이템이다.
각 `Chat`은 아래 필드만 가진다.

- `chatId`
- `message`
- `time`
- `isMine`
- `isloading`
- `copy`
- `infoPanel`

중요:

- 공통 모듈이다.
- 화면 전용 상태를 이 컨텍스트 타입에 추가하면 안 된다.
- 예: `chatAnswer`, `pairingList`, `keywords`, `wines` 같은 필드는 금지

## 전제

반드시 `ChatProvider` 안에서만 사용한다.

```tsx
<ChatProvider>
  <YourChatUI />
</ChatProvider>
```

## API 규칙

### 1. `sendMessage`

내가 보낸 채팅 하나를 추가한다.

```tsx
sendMessage({
  chatId: uuid(),
  message: "안녕",
});
```

용도:

- 사용자 입력 메시지 추가

### 2. `receiveMessage`

상대방 채팅 하나를 새로 추가한다.

```tsx
receiveMessage({
  chatId: botChatId,
  message: "",
  isloading: true,
});
```

용도:

- SSE 시작 전에 비어 있는 상대방 채팅 박스를 먼저 만들 때
- 이후 같은 `chatId`로 `updateChat()` 하면서 내용을 채울 때

### 3. `updateChat`

기존 채팅 하나를 찾아서 갱신한다.

```tsx
updateChat({
  chatId: botChatId,
  message: "네,",
  isloading: false,
  stream: true,
  infoPanel,
});
```

규칙:

- `stream: true` 이면 기존 `message` 뒤에 이어붙인다.
- `stream`이 없거나 `false`면 `message`를 통째로 교체한다.
- `infoPanel`은 해당 chat item에 붙는 별도 렌더링 영역이다.

## SSE 연동 규칙

SSE 기반 채팅 UI는 아래 순서를 지킨다.

### 1. 사용자가 입력

```tsx
sendMessage({
  chatId: userChatId,
  message: userInput,
});
```

### 2. 봇용 빈 채팅 생성

```tsx
receiveMessage({
  chatId: botChatId,
  message: "",
  isloading: true,
});
```

### 3. SSE 수신 때마다 같은 `chatId`를 업데이트

```tsx
updateChat({
  chatId: botChatId,
  message: nextChunk,
  isloading: false,
  infoPanel,
  stream: true,
});
```

이 규칙의 의미:

- 채팅 박스 하나는 `receiveMessage()`로 한 번만 만든다.
- 이후 SSE chunk는 새 chat을 추가하지 않는다.
- 같은 `chatId`에 계속 `updateChat()` 한다.

## `message`와 `infoPanel` 책임 분리

반드시 아래 원칙을 지킨다.

### `message`

- 상대방 말풍선 텍스트
- 예: `네,알겠습니다.와인추천해드릴게요!`

### `infoPanel`

- 말풍선 아래에 붙는 부가 UI
- 예: 와인 추천 카드 리스트
- 예: 가로 스크롤 카드 영역

즉:

- 텍스트 안내 문구를 `infoPanel`에 넣지 않는다.
- 카드 목록 상태를 공통 `Chat` 타입에 저장하지 않는다.
- 화면 전용 데이터는 `ChatUI` 내부에서 관리하고, 렌더링 결과만 `infoPanel`로 넘긴다.

## 하지 말아야 할 것

### 1. 공통 채팅 타입 확장 금지

아래 같은 필드를 `Chat`, `SendMessage`, `ReceiveMessage`, `UpdateChat`에 추가하지 않는다.

- `chatAnswer`
- `pairingList`
- `streamMeta`
- 특정 화면 전용 데이터

이런 값은 feature UI 내부 상태로 관리해야 한다.

### 2. `receiveMessage`를 SSE chunk마다 호출 금지

잘못된 예:

```tsx
// chunk마다 새 chat 생성
receiveMessage({ chatId: uuid(), message: chunk });
```

이렇게 하면 상대방 말풍선이 여러 개로 쪼개진다.

### 3. `infoPanel`을 상태 저장소처럼 사용 금지

`infoPanel`은 렌더링 결과물이다.
비즈니스 상태 저장소처럼 취급하지 않는다.

## 권장 패턴

와인 추천 같은 화면 전용 UI는 아래처럼 구현한다.

1. `ChatUI` 내부에서 `chatAnswer`, `pairingList`를 `useRef` 또는 `useState`로 관리
2. `receiveMessage()`로 빈 봇 chat 생성
3. `START` chunk가 오면 `updateChat({ message: chunk, stream: true })`
4. `PAIRING` chunk가 오면 내부 상태를 갱신한 뒤 `infoPanel`만 새로 생성해서 `updateChat()`
5. `FINISH`가 오면 `close()` 호출

핵심:

- 공통 채팅 컨텍스트는 chat box 목록만 관리
- 화면 전용 조합 로직은 `ChatUI`가 관리

## 예시

```tsx
const botChatId = uuid();
let answer = "";
let pairingList: PairingRecommendation[] = [];

receiveMessage({
  chatId: botChatId,
  message: "",
  isloading: true,
});

// START chunk
answer += chunk;
updateChat({
  chatId: botChatId,
  message: chunk,
  isloading: false,
  stream: true,
  infoPanel: <PairingCardsPanel pairingList={pairingList} />,
});
```

## 결론

`useChat()`은 공통 채팅 리스트 관리용이다.

- 텍스트는 `message`
- 부가 UI는 `infoPanel`
- 화면 전용 상태는 feature 내부
- 공통 컨텍스트 타입은 확장하지 않기
