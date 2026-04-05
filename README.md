# co-read Architecture

이 문서는 현재 레포의 상위 아키텍처를 `web`, `signaling`, `mcp`를 중심으로 정리해요.

## 프로젝트 소개

해당 프로젝트는 개인 포트폴리오 웹 애플리케이션이에요.

이 프로젝트는 단일 웹 화면만으로 구성된 것이 아니라, 아래 세 가지 축이 함께 동작하는 구조로 구성되어있어요.

- `web`
  - 실제 포트폴리오 화면과 사용자 상호작용을 제공하는 메인 웹 애플리케이션
- `mcp`
  - 프론트엔드 구현 시 따라야 하는 프로그래밍 지식과 정책을 guide 형태로 제공하는 MCP 서버
- `signaling`
  - WebRTC 기반 실시간 연결을 위해 signaling 흐름을 담당하는 서버

즉 이 레포는 단순한 정적 포트폴리오가 아니라, **웹 애플리케이션 + 프로그래밍 정책 MCP + 실시간 통신용 signaling 서버**가 함께 있는 구조에요.

## 개요

이 프로젝트는 크게 3개 런타임으로 나뉘어요.

1. `web`
2. `signaling`
3. `mcp`

각 디렉터리의 역할은 다음과 같아요.

- `web`
  - 사용자에게 보이는 실제 웹 애플리케이션
  - Next.js 기반 프론트엔드
  - UI, 페이지, Storybook, RTC 클라이언트 로직 포함
- `signaling`
  - RTC용 signaling 서버
  - SockJS + STOMP 기반 room participant 관리와 offer/answer/ICE relay 담당
- `mcp`
  - 프론트엔드 작업 가이드를 선택적으로 제공하는 MCP 서버
  - 에이전트가 프론트엔드 작업 전에 필요한 guide만 읽도록 지원

## 디렉터리 구조

```text
.
├─ web/
├─ signaling/
├─ mcp/
└─ docs/
```

- `web/`
  - 실제 서비스 프론트엔드
- `signaling/`
  - RTC signaling 서버
- `mcp/`
  - frontend-guidance-mcp 서버
- `docs/`
  - 사람을 위한 설계/배포/아키텍처 문서

## 1. web

`web`은 Next.js 기반 애플리케이션이에요.

주요 책임:

- 페이지 렌더링
- 재사용 UI와 도메인 UI 구성
- Storybook 기반 컴포넌트 문서화
- SSE / RTC 같은 클라이언트 기능 제공
- 서버 컴포넌트와 클라이언트 컴포넌트 조합

### 핵심 구조

- `src/app/shared`
  - 여러 화면에서 공통으로 쓰는 UI, 로직, 헬퍼
- `src/app/feature`
  - 기능/도메인 단위 UI
- `src/app/(routes)`
  - 실제 라우트 진입점

### 프론트엔드 작업 규약

`web/AGENTS.md`에는 프론트엔드 작업의 전역 정책이 정리되어 있어요.

핵심 원칙은 아래와 같아요.

- 프론트엔드 작업은 구현 전에 반드시 MCP guide를 확인
- MCP guide 주요 내용
  - shared / feature 컴포넌트 레이어를 구분
  - 가능한 한 Server Component를 기본값으로 유지
  - story를 같은 경로에 유지

즉 `web`은 단순한 앱 디렉터리를 넘어, 에이전트 작업 규약까지 포함한 프론트엔드 작업 공간이에요.

## 2. mcp

`mcp`는 `frontend-guidance-mcp` 서버예요.

관련 파일:

- `mcp/src/*`
- `mcp/GUIDE_MCP_USAGE.md`
- `mcp/guidance/*`

### 핵심 역할

이 서버는 사용자-facing 기능을 제공하는 서버는 아니에요.

실제 역할은 아래와 같아요.

- 프론트엔드 작업 맥락에 맞는 guide 선택
- guide id와 근거 source path 반환
- 에이전트가 필요한 가이드만 읽도록 보조

즉 에이전트용 지식 라우팅 계층으로 동작해요.

### 제공 도구

- `resolve_guides`
  - 작업 설명과 수정 경로를 바탕으로 읽어야 할 guide id 추천
- `read_guide`
  - 특정 guide 본문과 source path, 갱신 시각 제공

### 왜 필요한가

`web/AGENTS.md`에 모든 구현 상세를 넣으면 문서가 길어지고, 실제 코드와 드리프트도 쉽게 생겨요.

그래서 구조를 다음처럼 나눠두었어요.

- `web/AGENTS.md`
  - 전역 작업 규약
- `mcp/guidance/*`
  - 구현 상세 / 사용 가이드
- `mcp`
  - 그 가이드를 선택적으로 읽게 해주는 서버

즉 `mcp`는 코드 생성 서버가 아니라 “가이드 선택 서버”에 가까워요.

## 3. signaling

`signaling`은 RTC signaling 전용 서버예요.

관련 파일:

- `signaling/server.js`
- `signaling/docker-compose.yml`
- `signaling/Dockerfile`

### 핵심 역할

이 서버는 media relay 서버가 아니에요.

실제 역할은 아래와 같아요.

- RTC room participant registry 유지
- STOMP subscription 관리
- offer / answer / ICE candidate 중계

즉 브라우저 간 직접 media를 주고받기 위한 “메시지 조정 서버”예요.

### 현재 프로토콜

publish:

- `/app/room/join/:roomId`
- `/app/peer/offer/:otherKey/:roomId`
- `/app/peer/answer/:otherKey/:roomId`
- `/app/peer/iceCandidate/:otherKey/:roomId`

subscribe:

- `/topic/room/participants/:roomId`
- `/topic/peer/offer/:myKey/:roomId`
- `/topic/peer/answer/:myKey/:roomId`
- `/topic/peer/iceCandidate/:myKey/:roomId`

### 구현 특징

- `express + http + sockjs`
- STOMP frame를 직접 파싱
- `roomId -> participant keys`를 메모리로 관리
- 연결 종료 시 participant 목록 재브로드캐스트
- CORS는 운영 도메인과 로컬 개발 도메인을 허용

### 배포 방식

현재 레포는 signaling 서버를 Docker 이미지로 올릴 수 있어요.

관련 파일:

- `signaling/Dockerfile`
- `signaling/.dockerignore`
- `signaling/docker-compose.yml`

또한 같은 VM에서 `coturn`과 함께 운영하는 구성을 전제로 하고 있어요.

## web / signaling / mcp 관계

세 요소의 관계는 아래처럼 이해하면 쉬워요.

```text
User Browser
   |
   v
 web (Next.js)
   |
   +-- RTC signaling --> signaling
   +-- ICE/STUN/TURN --> coturn
   |
   +-- frontend work guidance --> mcp
```

조금 더 정확히 나누면 아래와 같아요.

- 런타임 관계
  - `web` ↔ `signaling`
  - `web` ↔ `coturn`
- 개발 도구 관계
  - 에이전트 ↔ `mcp`
  - 에이전트 ↔ `web/AGENTS.md`

즉 `mcp`는 운영 트래픽 경로에는 없고, 개발/자동화 경로에서만 사용돼요.

## 요청 흐름 예시

### 일반 웹 요청

1. 사용자가 `web`에 접속
2. Next.js가 페이지 렌더링
3. 필요 시 클라이언트 컴포넌트가 상호작용 수행

### RTC 요청

1. 사용자가 RTC 화면 진입
2. `web`의 `useRtc`가 signaling 서버 연결
3. `signaling`이 room participant 목록 전달
4. 브라우저끼리 offer / answer / ICE 교환
5. 필요 시 coturn이 relay 제공

### 프론트엔드 작업 자동화

1. 에이전트가 `web/AGENTS.md` 읽음
2. 수정 경로/작업 설명을 기준으로 `mcp.resolve_guides` 호출
3. 필요한 guide만 `mcp.read_guide`로 읽음
4. 실제 `web` 코드 수정

## 설계 의도

현재 구조의 핵심 의도는 아래와 같아요.

- `web`
  - 사용자 서비스와 클라이언트 구현 담당
- `signaling`
  - RTC 연결 조정 담당
- `mcp`
  - 프론트엔드 자동화 가이드 제공 담당

즉 서비스 런타임과 개발 자동화 런타임을 분리해서 유지보수성과 명확성을 높이는 구조예요.

## 관련 문서

- `docs/rtc-architecture.md`
- `docs/gcp-gabia-signaling-deploy.md`
- `docs/co-turn.md`
- `mcp/GUIDE_MCP_USAGE.md`
- `web/AGENTS.md`
