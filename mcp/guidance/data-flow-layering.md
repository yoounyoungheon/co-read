# Data Flow Layering Guide

이 문서는 `web` 프론트엔드에서 API 응답이 UI까지 전달되는 동안 어떤 레이어를 거쳐야 하는지 정리한 데이터 흐름 규약이다.

## 목적

- API 계약 타입과 UI props를 직접 연결하지 않는다.
- business와 presentation 레이어가 각각 다른 책임을 갖도록 유지한다.
- service, mapper, presenter, view-model의 경계를 명확히 분리한다.

## 기본 흐름

```text
API Response
-> api-model
-> business mapper
-> domain
-> business service
-> presenter
-> view-model
-> UI component
```

핵심은 **business는 내부적으로 신뢰할 수 있는 domain을 만들고, presentation은 그 domain을 화면용 데이터로 바꾼다**는 점이다.

## 레이어별 책임

### 1. `api-model`

- 서버 응답 계약 타입을 표현한다.
- 외부 API나 route handler가 반환하는 raw shape를 담는다.
- UI에서 직접 import 하거나 사용하지 않는다.

### 2. `business mapper`

- `api-model`을 `domain`으로 변환한다.
- 외부 응답 구조를 feature 내부 표현으로 정리한다.
- 서버 계약 필드 이름이나 nullable shape를 여기서 흡수한다.

### 3. `business service`

- fetch를 수행한다.
- 응답 상태를 검사한다.
- mapper를 호출해 최종적으로 `domain`을 반환한다.
- **UI props나 view model을 만들지 않는다.**

즉 service 책임은 아래까지다.

```text
fetch -> response status check -> api-model -> domain
```

### 4. `presenter`

- `domain`을 `view-model`로 변환한다.
- UI가 필요한 필드만 추린다.
- 경로, 라벨, 카드 목록처럼 화면 친화적인 형태로 가공한다.
- page/layout 같은 서버 조합 레이어에서 호출된다.

### 5. `view-model`

- 특정 UI가 바로 사용할 데이터 shape다.
- domain과 같을 수도 있지만, 같아야 하는 것은 아니다.
- 화면 요구사항에 맞는 이름과 구조를 가진다.

### 6. `UI`

- 가능한 한 view model만 props로 받는다.
- fetch를 하지 않는다.
- api-model과 domain을 직접 몰라도 되도록 유지한다.

## 반드시 지켜야 할 규칙

- service는 domain까지만 반환해야 한다. (MUST)
- presenter가 아닌 곳에서 UI용 view model을 만들지 않는다. (MUST)
- business 레이어가 `feature/*/ui` 타입을 import하면 안 된다. (MUST NOT)
- UI 컴포넌트가 raw API 응답 타입을 직접 받으면 안 된다. (MUST NOT)
- page/layout 같은 Server Component 조합 레이어가 presenter를 호출해 UI 데이터를 준비해야 한다. (SHOULD)

## 권장 디렉터리 구조

```text
feature/<domain>/
├─ business/
│  ├─ <domain>.api-model.ts
│  ├─ <domain>.domain.ts
│  ├─ <domain>.mapper.ts
│  └─ <domain>.service.ts
├─ presentation/
│  ├─ <domain>.view-model.ts
│  └─ <domain>.presenter.ts
└─ ui/
   └─ ...
```

## 현재 레포 예시

### `resume`

- `resume.service.ts`는 API 응답을 `Resume` domain으로 정리한다.
- `resume.presenter.ts`는 `ResumeTimeLineItemViewModel[]`를 만든다.
- `TimeLine.tsx`는 presentation view model만 렌더링한다.

### `project`

- `project.service.ts`는 `Project` domain을 반환한다.
- `project.presenter.ts`는 카드/상세용 view model을 만든다.
- `FeedGrid`, `ProjectReview`는 view model 기반으로 렌더링된다.

### `play-ground`

- 실시간 상태와 브라우저 상호작용은 feature UI 근처에 둔다.
- 하지만 카드 메타데이터나 route type 상수처럼 정적인 화면 데이터는 `presentation`으로 올릴 수 있다.

## 안티 패턴

- service가 `TimeLineItem[]`, `CardProps[]` 같은 UI 타입을 바로 반환하는 경우
- UI 컴포넌트가 API 응답 shape를 그대로 props로 받는 경우
- business 레이어에서 `feature/*/ui/*` 파일을 import 하는 경우
- page/layout에서 presenter 없이 domain을 바로 UI로 넘기는 경우

## 빠른 판단 질문

- 이 타입은 외부 응답 계약인가? → `api-model`
- 이 타입은 내부 비즈니스 의미인가? → `domain`
- 이 로직은 fetch와 응답 검사인가? → `service`
- 이 로직은 domain을 화면용 데이터로 바꾸는가? → `presenter`
- 이 값은 화면 컴포넌트가 바로 렌더링하는 shape인가? → `view-model`

## Do

- API 계약 변경을 business mapper에서 흡수한다.
- UI 요구사항 변경을 presenter/view-model에서 흡수한다.
- page/layout에서 presenter를 통해 최종 UI 데이터를 준비한다.

## Don't

- service에서 UI props를 바로 만들지 않는다.
- UI에서 business/domain 세부 구조를 직접 알게 하지 않는다.
- api-model과 view-model을 같은 타입으로 취급하지 않는다.
