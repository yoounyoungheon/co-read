# 1. 프로그래밍 정책

## 컴포넌트 개발 정책

### 1. 기본 원칙

- 모든 컴포넌트는 기본적으로 Server Component로 작성해야 한다 (MUST)
- Client Component는 클라이언트 상호작용이 필요한 경우에만 사용해야 한다 (MUST)
- Client Component는 파일 상단에 "use client"를 선언해야 한다 (MUST)

### 2. Server Component 규칙

- 다음 조건에 해당하는 컴포넌트는 Server Component로 작성해야 한다 (MUST)
- 서버에서 데이터를 조회하는 경우
- 페이지 초기 데이터를 렌더링하는 경우
- 정적인 UI를 출력하는 경우
- SEO가 중요한 화면인 경우
- 브라우저 API가 필요 없는 경우
- 사용자 이벤트 처리가 없는 경우
- 다음 파일은 반드시 Server Component로 유지해야 한다 (MUST)
  - page.tsx
  - layout.tsx

### 3. Client Component 규칙

- 다음 조건 중 하나라도 해당하면 Client Component로 분리해야 하는지 먼저 검토한다 (SHOULD)
- useState, useReducer 등 상태 관리가 필요한 경우
- useEffect, useRef 등 클라이언트 실행 이후 동작이 필요한 경우
- onClick, onChange, onSubmit 등 이벤트 처리가 필요한 경우
- window, document, localStorage 등 브라우저 API가 필요한 경우
- 모달, 드롭다운, 탭, 폼 입력 등 인터랙션 UI인 경우
- Client Component는 필요한 범위에서 최소 단위로 분리해야 한다 (SHOULD)

### 4. 빠른 판단 순서

- 아래 질문 중 하나라도 "예"이면 Client Component 분리를 우선 검토한다.
- React hook이 필요한가?
- 사용자 이벤트 처리가 필요한가?
- 브라우저 API가 필요한가?
- 위 질문이 모두 "아니오"이면 Server Component를 기본값으로 사용한다 (SHOULD)

### 5. 페이지와 레이아웃 예외 규칙

- page.tsx와 layout.tsx는 인터랙션이 있더라도 파일 자체는 Server Component로 유지해야 한다 (MUST)
- page.tsx와 layout.tsx에 인터랙션이 필요하면, 상호작용 영역만 별도 Client Component로 분리해서 하위에 배치해야 한다 (MUST)
- 페이지 전체에 "use client"를 선언해서 문제를 해결하는 방식은 지양해야 한다 (SHOULD NOT)
- 좋은 예
  ```
  Page (Server)
  ├ ContentSection (Server)
  └ LikeButton (Client)
  ```
- 나쁜 예
  ```
  Page (Client)
  ├ ContentSection
  └ LikeButton
  ```

### 6. Component Composition 규칙

- 컴포넌트 구조는 다음 패턴을 따라야 한다 (SHOULD)
  ```
  Server Component
    └ Client Component
  ```
- Server Component는 데이터 조회와 초기 렌더링을 담당해야 한다 (SHOULD)
- Client Component는 사용자 인터랙션을 담당해야 한다 (SHOULD)

### 7. Import 규칙

- Server Component는 Client Component를 import 할 수 있다 (ALLOW)
- Client Component는 Server Component를 직접 import 하면 안 된다 (MUST NOT)
- 단, Server Component가 상위에서 렌더링한 결과를 children 또는 props 형태로 전달받는 패턴은 별도로 설계할 수 있다 (ALLOW)
- 잘못된 예
  ```
  Client Component
    └ Server Component
  ```

### 8. "use client" 사용 규칙

- "use client"는 필요한 파일에만 선언해야 한다 (SHOULD)
- 상호작용 영역만 별도 Client Component로 분리해야 한다 (SHOULD)
- 선언 이유가 불명확한 넓은 범위의 Client 전환은 지양해야 한다 (SHOULD NOT)

### 9. 데이터 조회 규칙

- 초기 데이터 조회는 Server Component에서 수행해야 한다 (SHOULD)
- Client Component에서 초기 데이터 fetch를 수행하는 방식은 지양한다 (SHOULD NOT)
- 서버 전용 로직(DB 접근, 인증 처리 등)은 Client Component에 포함하면 안 된다 (MUST NOT)

### 10. 컴포넌트 설계 규칙

- 컴포넌트는 단일 책임 원칙(SRP)을 따라야 한다 (SHOULD)
- 재사용 가능한 UI 컴포넌트는 프레젠테이션 중심으로 작성한다 (SHOULD)

### 11. 핵심 원칙 요약

- 데이터 렌더링은 서버에서 처리한다
- 사용자 인터랙션만 클라이언트에서 처리한다
- "use client" 사용 범위를 최소화한다

# 2. 컴포넌트 디자인 규칙

## 목적

이 프로젝트에서 AI Agent는  
디자인 시스템(Atom/Molecule)을 조합하여  
feature/\*/ui/ 하위에 Feature UI 컴포넌트를 생성한다.

디자인 시스템의 구체적인 컴포넌트 목록, props, 사용 예시에 대해서는  
storybook-static/components.meta.json을 단일 소스 오브 트루스(Single Source of Truth)로 사용한다.

컴포넌트 실행 환경(Server/Client), 파일 생성 위치, 금지 사항 같은 행동 규칙은 AGENTS.md를 기준으로 판단한다.

AGENTS.md는 개별 컴포넌트(Button, Dialog 등)에 대해 설명하지 않는다.

## 0. 적용 범위

- AGENTS.md는 Agent의 행동 규칙과 생성 규칙을 정의한다.
- components.meta.json은 디자인 시스템 지식 베이스를 정의한다.
- 두 문서는 상호 보완 관계이며, 하나가 다른 하나를 완전히 대체하지 않는다.

## 1. 입력 데이터 규약

Agent는 반드시 아래 파일을 기반으로 의사결정을 한다.

### 1.1 components.meta.json

경로:

`docs/storybook/components.meta.json`

구조:

```json
{
  "components": [
    {
      "name": "ComponentName",
      "kind": "atom | molecule",
      "componentPath": "...",
      "storiesPath": "...",
      "argTypes": { ... },
      "args": { ... },
      "originalSources": [ "..." ]
    }
  ]
}
```

필드 의미

- name: 컴포넌트 이름
- kind: atom 또는 molecule
- componentPath: 실제 구현 파일 경로
- storiesPath: 스토리 파일 경로
- argTypes: 컴포넌트의 props
- args: 기본 args
- originalSources: 팀이 사용하는 실제 조합/사용 예시

## 2. 디자인 시스템 해석 규칙

Agent는 components.meta.json을 다음과 같이 해석한다.

### 2.1 디자인 시스템 컴포넌트는 수정하지 않는다

componentPath에 해당하는 파일은  
재사용 대상이며 수정 대상이 아니다.

새 UI는 반드시 조합을 통해 만든다.

### 2.2 메타에 없는 primitive가 필요한 경우

- components.meta.json에 없는 atom/molecule이 필요하더라도 shared/ui에 새 primitive를 추가하거나 기존 디자인 시스템 컴포넌트를 수정하지 않는다 (MUST NOT)
- 필요한 primitive가 프로젝트 내부에 존재하지 않으면, Feature UI를 임의 구현으로 완성하지 말고 TODO 주석을 통해 미완성 상태를 명시한다 (MUST)
- 이 TODO 주석에는 최소한 다음 내용을 포함해야 한다 (SHOULD)
  - 현재 필요한 primitive 또는 capability
  - 왜 기존 components.meta.json 조합으로 해결되지 않는지
  - 어떤 위치의 디자인 시스템 확장이 필요한지
- TODO 주석으로 미완성 상태를 남기는 경우에도, 가능한 범위의 Feature UI 골격과 Story는 함께 작성한다 (SHOULD)

### 2.3 originalSources는 “팀의 사용 패턴”

originalSources는 단순 코드 문자열이 아니다.  
이는 다음을 의미한다:

- 팀이 선호하는 조합 구조
- props 전달 방식
- variant 비교 방식
- 상태 표현 방식
- Storybook 작성 패턴

Agent는 새로운 Feature UI를 만들 때  
originalSources에서 발견되는 패턴을 최대한 유지한다.

### 2.4 argTypes는 외부 노출 API의 기준

argTypes는 해당 디자인 시스템 컴포넌트의 public control surface이다.

Feature UI는 내부에서 이를 사용할 수 있으나,

모든 argTypes를 그대로 외부에 노출할 필요는 없다.

Feature UI는 도메인 중심 props를 설계한다.

### 2.5 메타 해석 시 허용 범위

- components.meta.json에 없는 디자인 시스템 컴포넌트를 새로 가정하지 않는다 (MUST NOT)
- 단, Feature UI를 조합하기 위해 Next.js 기본 컴포넌트, 표준 HTML element, feature 전용 wrapper/section 정도의 보조 구조는 사용할 수 있다 (ALLOW)
- 이때도 UI의 핵심 primitive는 가능한 한 components.meta.json에 정의된 atom/molecule 조합으로 해결해야 한다 (SHOULD)

## 3. Agent의 생성 대상

Agent는 아래 경로에만 파일을 생성한다:

`src/app/feature/<feature-name>/ui/`

생성 파일:

- `<ComponentName>.tsx`
- `<ComponentName>.stories.tsx`

## 4. 생성 절차

Agent는 다음 절차를 따른다.

### Step 1 — 요구사항 분석

사용자 요청을 Feature UI 단위로 해석한다.

### Step 2 — 디자인 시스템 검색

components.meta.json에서 적절한 atom/molecule을 검색한다.

검색 기준:

- 이름
- argTypes 키
- originalSources 패턴

필요한 primitive가 검색되지 않으면, 해당 Feature UI는 TODO 주석과 함께 미완성 상태로 남기고 shared/ui 수정 없이 중단한다.

### Step 3 — 조합 설계

atom/molecule을 조합한다.

props는 Feature 관점으로 재설계한다.

디자인 시스템 props를 그대로 노출하지 않는다 (필요한 경우 제외).

### Step 4 — 구현

Feature UI 컴포넌트를 작성한다.

### Step 5 — Story 작성

- Storybook 메타 작성
- Default 스토리 필수
- 주요 상태 스토리 포함
- 팀의 Storybook 패턴을 참고하되, feature 사용 맥락을 재현하는 최소 wrapper 중심의 render 구조 사용
- 미완성 상태인 경우에도 현재 구현 가능한 범위의 상태를 Story에 반영하고, TODO가 남아 있음을 명시한다

## 5. 스토리 작성 규칙

스토리는 다음을 만족해야 한다:

- title: Feature/<feature-name>/<ComponentName>
- tags: ["autodocs"]
- Feature 관점의 argTypes 정의
- 내부적으로 디자인 시스템 컴포넌트 조합 사용

Story 작성 시 components.meta.json의 originalSources를 참고하되, Feature Story는 feature의 공개 API와 사용 맥락을 우선한다.

### 5.1 기본 메타 규칙

- 스토리 파일은 `@storybook/nextjs`에서 `Meta`, `StoryObj`를 import 하는 패턴을 기본으로 사용한다 (SHOULD)
- 기본 메타는 `const meta: Meta<typeof ComponentName> = { ... }` 형태로 작성한다 (SHOULD)
- `export default meta` 이후에는 `type Story = StoryObj<typeof ComponentName>` 별칭을 선언한다 (SHOULD)
- `parameters.layout`은 특별한 이유가 없으면 `"centered"`를 기본값으로 사용한다 (SHOULD)

### 5.2 args와 argTypes 규칙

- `args`에는 컴포넌트를 이해할 수 있는 현실적인 기본 데이터를 제공한다 (SHOULD)
- 단순 문자열, boolean, className 등은 가능한 경우 `argTypes.control`을 명시한다 (SHOULD)
- 배열/객체 기반 도메인 데이터는 `control: "object"`를 우선 사용한다 (SHOULD)
- 함수, ReactNode, 복잡한 콜백처럼 Storybook control에 적합하지 않은 값은 `control: false` 또는 action으로 처리한다 (SHOULD)
- `argTypes` 설명은 디자인 시스템 내부 prop 설명이 아니라 Feature 관점 설명을 우선한다 (SHOULD)

### 5.3 스토리 구성 규칙

- `Default` 스토리는 항상 제공한다 (MUST)
- `Empty`, `Selected`, `WithLinks`, `LongDescription`처럼 사용자가 실제로 확인해야 하는 주요 상태를 추가한다 (SHOULD)
- 상태 차이가 `args`만으로 표현 가능하면 `render`를 중복 작성하기보다 기존 스토리의 `render`를 재사용한다 (SHOULD)
- 스토리 이름은 시각적/도메인 상태를 바로 이해할 수 있게 작성한다 (SHOULD)

### 5.4 render 함수 규칙

- 컴포넌트가 실제 화면에서는 고정 폭 또는 고정 높이 문맥에서 사용된다면, Story에서도 wrapper를 두어 그 문맥을 재현한다 (SHOULD)
- wrapper는 데모를 위한 최소 범위 레이아웃만 제공하고, 컴포넌트 자체의 책임을 대체하지 않는다 (SHOULD)
- `render` 함수는 스토리 시연에 필요한 조합만 담당하고, 컴포넌트 내부 구현을 우회하는 과도한 mocking은 지양한다 (SHOULD NOT)

### 5.5 Feature Story 원칙

- Story는 디자인 시스템 primitive 자체를 설명하는 문서가 아니라, Feature UI가 어떤 데이터와 상태에서 어떻게 보이는지 보여주는 데 집중한다 (SHOULD)
- 디자인 시스템 props를 그대로 나열하기보다, Feature 컴포넌트의 공개 API와 사용 시나리오를 드러내는 방향으로 스토리를 구성한다 (SHOULD)
- TODO 주석과 함께 미완성 상태로 남은 컴포넌트라면, Story에도 현재 구현 범위와 남은 제약이 드러나야 한다 (SHOULD)

## 6. 레이어 규칙

- Agent는 atom/molecule을 새로 만들지 않는다.
- shared/ui 레이어는 수정하지 않는다.
- feature 레이어에만 생성한다.
- shared/ui 확장이 필요하다고 판단되면, Feature UI 내부 TODO 주석으로 그 필요를 명시하고 구현은 중단한다.

## 7. 금지 사항

- components.meta.json에 없는 디자인 시스템 컴포넌트를 임의로 가정하지 않는다.
- 디자인 시스템 구현 파일을 직접 수정하지 않는다.
- 스토리 파일 없이 컴포넌트를 생성하지 않는다.
- Storybook에 등록되지 않는 구조로 만들지 않는다.
- TODO 없이 미완성 상태를 숨긴 채 완성된 것처럼 구현하지 않는다.

## 8. 확장성 원칙

components.meta.json은 자동 생성된다.  
새로운 atom/molecule이 추가되더라도 AGENTS.md는 수정하지 않는다.

Agent는 항상:

- 최신 components.meta.json을 읽고
- 그 안의 구조를 기반으로 동적으로 판단한다.

AGENTS.md는 정책 문서이며,  
디자인 시스템 정의는 components.meta.json이 담당한다.

핵심 철학

- AGENTS.md = 행동 규칙
- components.meta.json = 지식 베이스

# 3. 스타일 프로그래밍 정책

## 목적

이 프로젝트에서 Agent는  
스타일을 감각적으로 임의 작성하지 않고,  
레이아웃, 간격, 시각 효과, 애니메이션에 대한  
일관된 기준에 따라 구현해야 한다.

Tailwind CSS는 단순 유틸리티 모음이 아니라  
CSS box model, normal flow, flex/grid, stacking context, transform 같은  
기본 원리를 빠르게 표현하는 도구로 사용해야 한다.

즉, Agent는 먼저 CSS 원리로 문제를 이해하고,  
그 다음 Tailwind 클래스로 구현한다.

## 0. 적용 범위

- 본 정책은 `className`, `globals.css`, component-level style, animation 작성 전반에 적용된다.
- Agent는 스타일 문제를 우연한 조합으로 해결하지 않고, 폭(width), 흐름(flow), 정렬(alignment), 쌓임(layer) 기준으로 원인을 먼저 파악해야 한다.
- Tailwind 유틸리티는 빠른 구현 수단이지만, CSS 이론을 대체하지 않는다.

## 1. 스타일 판단 순서

- 스타일을 수정할 때는 아래 순서로 판단한다 (SHOULD)
  1. 레이아웃이 왜 깨지는지 width / height / overflow / display 기준으로 먼저 해석한다
  2. 정렬 문제인지, 크기 문제인지, 간격 문제인지 구분한다
  3. 필요한 최소 Tailwind 클래스만 적용한다
  4. 장식 효과(gradient, shadow, blur, animation)는 구조가 안정된 뒤 마지막에 추가한다
- `justify-center`, `absolute`, 고정 폭, 과도한 `min-w-*`로 레이아웃 문제를 임시 봉합하지 않는다 (SHOULD NOT)

## 2. Tailwind 사용 원칙

### 2.1 기본 원칙

- Tailwind는 가능한 한 semantic grouping이 보이도록 사용한다 (SHOULD)
- 하나의 요소에 과도하게 긴 className을 몰아넣기보다, 구조적으로 역할이 다른 wrapper를 분리한다 (SHOULD)
- 스타일은 레이아웃 → spacing → typography → color → effect 순서로 읽히게 작성한다 (SHOULD)
- 동일한 패턴이 반복되면 유틸리티 조합을 복붙하기보다 공용 컴포넌트 추출을 우선 검토한다 (SHOULD)

### 2.2 허용/지양 기준

- `w-full`, `max-w-*`, `min-w-*`, `grid`, `flex`, `gap-*`, `p-*` 같은 구조 유틸리티를 우선 사용한다 (SHOULD)
- 임의값(`w-[237px]`, `mt-[13px]`)은 정당한 디자인 이유가 있을 때만 사용한다 (SHOULD)
- 동일한 파일에서 임의값이 반복되면 설계가 불안정한 신호로 간주한다 (SHOULD)
- `!important` 성격의 강제 우선순위 해결은 지양한다 (SHOULD NOT)
- 장식용 class가 콘텐츠 가독성을 해치면 제거를 우선 검토한다 (MUST)

## 3. CSS 이론 기반 레이아웃 규칙

### 3.1 폭(width)과 흐름(flow)

- 레이아웃 문제는 먼저 요소가 normal flow 안에 있는지, flex/grid 문맥인지 확인한다 (MUST)
- 부모가 `w-full`이 아니면 자식의 `w-full`은 기대한 대로 동작하지 않을 수 있음을 전제로 판단한다 (MUST)
- `max-w-*`는 상한을 정하는 값이지, 실제 폭을 채우는 값이 아니다. 화면을 꽉 채워야 하면 `w-full`과 함께 사용한다 (MUST)
- `min-w-*`는 콘텐츠 보존에는 유리하지만 모바일 overflow를 만들 수 있으므로 신중히 사용한다 (SHOULD)
- `justify-center`는 정렬 도구일 뿐, 폭 문제를 해결하지 못한다. 폭이 비정상적이면 먼저 width 관계를 수정한다 (MUST)

### 3.2 Flex와 Grid 선택 기준

- 1차원 정렬은 `flex`, 2차원 반복 배치는 `grid`를 우선 사용한다 (SHOULD)
- 카드 목록, 썸네일 목록, 피드 목록처럼 행/열 구조가 있는 경우 `grid`를 우선 검토한다 (SHOULD)
- 버튼 그룹, 아이콘 그룹, inline 정렬은 `flex`를 우선 사용한다 (SHOULD)
- `flex-wrap`은 카드 너비가 유동적일 때만 사용하고, 열 수가 명확하면 `grid-cols-*`를 우선한다 (SHOULD)

### 3.3 Mobile-first 반응형 규칙

- 모든 레이아웃은 mobile-first로 작성해야 한다 (MUST)
- 기본값은 모바일 기준 1열 또는 세로 배치로 두고, `sm:`, `md:`, `lg:`에서 확장한다 (SHOULD)
- 데스크톱 전용 고정 폭을 기본 class로 두지 않는다 (SHOULD NOT)
- 모바일에서 `w-full`, `grid-cols-1`, `flex-col`이 자연스럽게 동작하는지 먼저 확인한다 (MUST)

## 4. 간격과 크기 규칙

- 간격은 `gap`, `padding`, `margin`의 역할을 구분해 사용한다 (SHOULD)
- 형제 요소 간격은 `gap-*`을 우선 사용한다 (SHOULD)
- 컴포넌트 내부 여백은 `padding`으로, 컴포넌트 외부 간격은 `margin`으로 구분한다 (SHOULD)
- radius, shadow, padding 크기는 같은 역할의 카드/버튼끼리 일관되게 유지한다 (SHOULD)
- 시각적으로 비슷한 컴포넌트가 서로 다른 spacing scale을 갖지 않도록 한다 (SHOULD)

## 5. 타이포그래피와 이미지 규칙

- 텍스트 대비(contrast)는 장식보다 우선한다 (MUST)
- 텍스트가 흐려 보이면 색상, opacity, blur, transform 영향을 먼저 점검한다 (MUST)
- 제목/본문/보조 텍스트는 계층이 보이도록 크기와 굵기를 구분한다 (SHOULD)
- `next/image`에서 `fill`을 사용할 때는 가능한 한 `sizes`를 함께 제공한다 (SHOULD)
- 이미지 비율이 중요한 경우 부모의 aspect ratio를 먼저 정의하고, 이미지에는 `object-cover` 또는 `object-contain`을 의도적으로 선택한다 (SHOULD)

## 6. 색상, 그림자, 배경 효과 규칙

- 색상은 의미 전달과 계층 구분을 위해 사용하고, 장식 목적 남용을 지양한다 (SHOULD)
- shadow는 깊이감을 보조하는 정도로만 사용한다 (SHOULD)
- shadow, blur, gradient를 동시에 강하게 사용하는 경우 가독성 저하를 먼저 의심한다 (SHOULD)
- 텍스트 위 장식 레이어를 둘 때는 opacity를 낮추고, 콘텐츠는 `relative` 레이어로 분리한다 (SHOULD)
- 불투명도(`text-white/70`, `bg-white/10`)는 미세한 분위기 조절 용도로 쓰되, 정보가 흐려지면 즉시 대비를 높인다 (MUST)

## 7. 애니메이션 규칙

### 7.1 기본 원칙

- 애니메이션은 정보 구조를 보조할 때만 사용한다 (SHOULD)
- hover, active, open/close, tab, flip 같은 상호작용은 CSS transition 기반을 우선 사용한다 (SHOULD)
- JS 없이 해결 가능한 애니메이션은 CSS-only 방식으로 구현한다 (SHOULD)
- 애니메이션이 없어도 콘텐츠 이해가 가능해야 한다 (MUST)

### 7.2 성능과 시각 품질

- 애니메이션은 `transform`, `opacity` 중심으로 작성한다 (SHOULD)
- layout reflow를 크게 유발하는 `width`, `height`, `top`, `left` 애니메이션은 지양한다 (SHOULD NOT)
- 3D transform 사용 시 `backface-visibility`, `preserve-3d`, 텍스트 선명도 문제를 확인한다 (SHOULD)
- flip UI는 가능하면 공용 primitive로 추상화하고, 개별 feature는 앞면/뒷면 콘텐츠 조합만 담당한다 (SHOULD)

### 7.3 강도 기준

- duration은 짧고 예측 가능하게 유지한다 (SHOULD)
- 과도한 bounce, 반복, attention-seeking animation은 지양한다 (SHOULD NOT)
- hover 효과는 미세한 scale, translate, opacity 변화 정도로 제한한다 (SHOULD)

## 8. 스타일 디버깅 규칙

- 스타일 버그를 수정할 때는 먼저 아래를 점검한다 (MUST)
  - 부모에 `w-full`이 있는가
  - `max-w-*`만 있고 실제 폭이 없는가
  - `min-w-*` 때문에 모바일이 깨지는가
  - `justify-center`가 폭 문제를 가리고 있는가
  - `absolute`가 normal flow를 탈출해서 예상치 못한 겹침을 만드는가
  - `transform`, `opacity`, `blur` 때문에 텍스트가 흐려지는가
- 문제를 확인하지 않은 채 class를 추가로 누적해서 해결하려 하지 않는다 (SHOULD NOT)

## 9. 핵심 원칙 요약

- CSS 원리를 먼저 이해하고 Tailwind로 구현한다
- 모바일을 기본값으로 설계한다
- 폭 문제는 정렬이 아니라 width 관계로 해결한다
- 장식보다 가독성을 우선한다
- 애니메이션은 구조를 보조할 때만 사용한다

## 10. 스타일 정책 근거

이 섹션은 위 스타일 정책이 왜 필요한지 설명한다.  
Agent는 규칙만 따르는 것이 아니라,  
CSS 원리와 브라우저 렌더링 특성을 이해한 상태에서 스타일을 작성해야 한다.

### 10.1 왜 "CSS 원리를 먼저 이해하고 Tailwind로 구현"해야 하는가

- Tailwind는 CSS를 대체하는 별도 시스템이 아니라, CSS 속성을 짧은 클래스 형태로 표현한 도구다.
- 따라서 문제의 원인이 `display`, `width`, `overflow`, `position`, `transform` 중 어디에 있는지 이해하지 못하면, Tailwind 클래스는 빠른 해결 수단이 아니라 문제 은폐 수단이 된다.
- 예를 들어 `justify-center`는 정렬 속성일 뿐인데, 실제 원인이 부모의 `w-full` 부재인 경우에는 근본 해결이 되지 않는다.

### 10.2 왜 width 관계를 먼저 봐야 하는가

- 브라우저 레이아웃은 부모 박스의 폭과 자식 박스의 폭 관계에 의해 먼저 결정된다.
- `w-full`은 "가능한 공간을 채운다"는 의미이지, "항상 화면 전체 폭이 된다"는 의미가 아니다.
- 부모가 shrink-to-fit 상태이거나 width가 명확하지 않으면 자식의 `w-full`은 기대한 대로 동작하지 않는다.
- `max-w-*`는 상한선만 정한다. 실제 폭을 채우려면 `w-full` 같은 실제 width 지정이 같이 필요하다.
- 이 원리를 이해하지 못하면 모바일에서 레이아웃이 비거나, 콘텐츠가 왼쪽으로 몰리는 현상이 반복된다.

### 10.3 왜 mobile-first가 중요한가

- 작은 화면에서는 공간 제약이 가장 강하기 때문에, 이 환경을 먼저 만족시키면 큰 화면 확장이 쉬워진다.
- 반대로 데스크톱 기준 고정 폭을 먼저 만들고 모바일로 줄이면 `min-width`, overflow, 버튼 줄바꿈, 카드 폭 깨짐 같은 문제가 자주 발생한다.
- Tailwind의 responsive prefix(`sm:`, `md:`, `lg:`)도 mobile-first 전제를 기반으로 설계되어 있다.

### 10.4 왜 flex와 grid를 구분해야 하는가

- `flex`는 한 축(1차원) 정렬에 강하고, `grid`는 행과 열(2차원) 배치에 강하다.
- 카드 목록처럼 반복 구조가 있고 열 수가 중요하면 `grid`가 더 예측 가능하다.
- 버튼, 아이콘, inline 정렬처럼 한 줄 또는 한 축 흐름이 핵심이면 `flex`가 적합하다.
- 이 구분이 없으면 `flex-wrap`과 고정 폭 조합으로 억지로 레이아웃을 만들게 되고, 반응형 제어가 어려워진다.

### 10.5 왜 spacing 규칙이 필요한가

- UI 품질은 색보다 spacing에서 더 크게 드러난다.
- 사람은 시각적으로 가까운 요소를 같은 그룹으로 인식하고, 멀어진 요소를 다른 그룹으로 인식한다.
- 따라서 `gap`, `padding`, `margin`을 목적 없이 섞으면 계층이 흐려지고 읽기 어려운 화면이 된다.
- 같은 역할의 카드/버튼이 서로 다른 radius, padding, shadow를 가지면 시스템보다 임시 구현처럼 보이게 된다.

### 10.6 왜 장식보다 가독성을 우선해야 하는가

- gradient, blur, shadow는 시각적 분위기를 만들지만, 텍스트 대비를 떨어뜨리면 정보 전달력이 즉시 저하된다.
- 특히 어두운 카드 위의 낮은 opacity 텍스트, blur된 장식 레이어, 3D transform은 텍스트를 흐려 보이게 만들 수 있다.
- 사용자는 장식을 보러 오는 것이 아니라 내용을 읽기 위해 인터페이스를 사용한다.
- 따라서 장식은 텍스트와 정보 구조가 안정된 뒤에만 보조적으로 추가하는 것이 바람직하다.

### 10.7 왜 `transform` / `opacity` 중심 애니메이션을 권장하는가

- `transform`, `opacity`는 일반적으로 브라우저가 compositor 단계에서 처리하기 쉬워 성능에 유리하다.
- 반면 `width`, `height`, `top`, `left` 변경은 layout과 paint를 유발할 가능성이 높아 비용이 커질 수 있다.
- 따라서 hover, flip, fade 같은 효과는 가능한 한 `transform`, `opacity` 조합으로 구현하는 편이 부드럽고 안정적이다.

### 10.8 왜 3D transform에는 별도 주의가 필요한가

- `rotateY`, `preserve-3d`, `backface-visibility` 같은 3D 효과는 시각적으로 강력하지만, 브라우저 합성 과정에서 텍스트가 상대적으로 흐려질 수 있다.
- 뒷면 카드가 앞면보다 덜 선명해 보이는 현상은 흔한 합성 레이어 문제다.
- 따라서 flip UI는 feature마다 제각각 구현하지 말고 공용 primitive로 추상화해, 보정(`translateZ`, 대비 조정, blur 약화`)을 한곳에서 관리하는 것이 좋다.

### 10.9 왜 "문제 원인 확인 없이 class를 누적하지 말라"는 규칙이 필요한가

- 스타일 버그는 자주 "증상"과 "원인"이 다르다.
- 예를 들어 화면이 좁아 보이는 증상은 카드 자체 문제가 아니라 부모 width, max-width, justify-center 조합 때문일 수 있다.
- 이런 상황에서 class를 계속 추가하면 우연히 맞아보여도, 다른 화면 크기나 다른 콘텐츠에서 다시 깨진다.
- 따라서 디버깅은 항상 부모 → 자식 → 흐름 → 정렬 → overflow 순서로 보는 것이 안정적이다.

### 10.10 왜 shared/ui에 공용 스타일 primitive를 두는가

- 반복되는 카드, 버튼, dialog, flip 구조를 feature마다 다시 만들면 시각적 일관성이 무너진다.
- 공용 primitive는 단순 재사용 이상의 의미가 있다.
- 이는 프로젝트의 스타일 결정과 렌더링 품질을 한 곳에 모으는 역할을 한다.
- 결과적으로 feature 레이어는 도메인 콘텐츠에 집중하고, 시각적 구조와 동작은 shared/ui가 책임지는 편이 유지보수에 유리하다.

## 11. 참고 자료

아래 문서는 위 스타일 정책의 근거를 학습하기 위한 공식 자료다.

### 11.1 CSS / 레이아웃 기초

- MDN Responsive Web Design  
  https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
- web.dev Responsive Web Design Basics  
  https://web.dev/articles/responsive-web-design-basics
- MDN backface-visibility  
  https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility

### 11.2 Tailwind 공식 문서

- Tailwind Responsive Design  
  https://tailwindcss.com/docs/breakpoints
- Tailwind Container / Max Width  
  https://tailwindcss.com/docs/container
- Tailwind Box Sizing  
  https://tailwindcss.com/docs/box-sizing
- Tailwind Preflight  
  https://tailwindcss.com/docs/preflight

### 11.3 학습 포인트

- 레이아웃은 정렬보다 width와 normal flow를 먼저 본다
- 반응형은 desktop 축소보다 mobile-first 확장으로 이해한다
- Tailwind는 CSS 원리를 빠르게 표현하는 도구로 사용한다
- 3D transform은 시각 효과뿐 아니라 렌더링 품질 이슈도 함께 확인한다
- components.meta.json = 지식 베이스
