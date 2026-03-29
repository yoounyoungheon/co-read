# 디자인 시스템 문서 생성 정리

## 개요

`web` 프로젝트에서는 `npm run build-components-docs` 명령으로 Storybook 산출물을 기반으로 디자인 시스템 메타 JSON을 생성해요.

이 명령의 목적은 Storybook에 등록된 컴포넌트 정보를 사람이 바로 읽는 문서 대신, **다른 도구나 에이전트가 읽기 쉬운 구조화된 JSON** 형태로 정리하는 것이에요.

생성 결과물은 현재 기준으로 다음 파일이에요.

- `web/storybook-static/components.meta.json`

레포 안에는 예시 또는 스냅샷 성격의 파일로 다음 문서도 존재해요.

- `web/docs/storybook/components.meta.json`

## 실행 명령

`web/package.json` 기준 스크립트는 이렇게 정의되어 있어요.

```json
"build-components-docs": "node ./scripts/generate-components-meta.mjs storybook-static storybook-static/components.meta.json"
```

즉 실행 흐름은 다음과 같아요.

1. `storybook-static` 디렉터리를 입력으로 사용해요.
2. 그 안의 `index.json`과 번들된 `*.stories*.js` 파일을 읽어요.
3. 최종 결과를 `storybook-static/components.meta.json`으로 써요.

주의할 점은, 이 명령은 **Storybook 정적 산출물이 이미 존재한다는 전제** 위에서 동작한다는 거예요.  
즉 보통은 먼저 `storybook build`가 선행되어야 해요.

실제 순서는 보통 이렇게 이해하면 돼요.

1. `npm run build-storybook`
2. `npm run build-components-docs`

## 생성 과정

스크립트는 `web/scripts/generate-components-meta.mjs`에 있어요. 내부 흐름은 크게 4단계예요.

### 1. Storybook index 읽기

스크립트는 먼저 `storybook-static/index.json`을 읽어요.

여기서 title별로 아래 정보를 모아요.

- `title`
- `importPath` → stories 경로
- `componentPath` → 실제 컴포넌트 경로
- story id 목록

이 단계의 목적은 **Storybook에 노출된 title과 실제 파일 경로를 연결**하는 것이에요.

### 2. 번들된 stories 파일 탐색

그 다음 `fast-glob`으로 아래 패턴의 파일을 찾아요.

```txt
storybook-static/**/*.stories*.js
```

즉 원본 `.stories.tsx`를 직접 읽는 게 아니라, Storybook build 이후 생성된 JS 번들을 대상으로 파싱해요.

### 3. Babel AST로 메타 정보 추출

각 번들 파일은 `@babel/parser`와 `@babel/traverse`로 파싱해요.

여기서 추출하는 핵심 정보는 다음과 같아요.

- `meta.title`
- `meta.argTypes`
- 대표 story의 `args`
- 각 exported story의 `docs.source.originalSource`

이때 스크립트는 **안전한 literal만 복원**해요.

지원하는 값:

- 문자열
- 숫자
- 불리언
- `null`
- 배열
- 객체
- 단순 템플릿 문자열

지원하지 않는 값:

- 함수
- identifier 평가
- call expression
- 동적 계산식

즉 이 JSON은 “실행 결과”가 아니라, **정적으로 복원 가능한 Storybook 메타데이터**만 담아요.

### 4. 컴포넌트 목록 조합 후 JSON 저장

마지막으로 `index.json`에서 얻은 title 정보와, 번들에서 추출한 메타 정보를 title 기준으로 합쳐서 `components` 배열을 만들어요.

여기서 각 컴포넌트는 대략 이런 형태예요.

```json
{
  "name": "Button",
  "kind": "atom",
  "componentPath": "./src/app/shared/ui/atom/button.tsx",
  "storiesPath": "./src/app/shared/ui/atom/button.stories.tsx",
  "argTypes": {},
  "args": {},
  "originalSources": []
}
```

최종 출력 루트 구조는 이렇게 돼요.

```json
{
  "version": 1,
  "generatedAt": "ISO date string",
  "source": {
    "storybookIndex": "storybook-static/index.json"
  },
  "components": []
}
```

## 대표 스토리 선택 방식

스크립트는 대표 `args`를 하나 고를 때 우선순위를 둬요.

1. `Default` export
2. Storybook export order의 첫 번째 story
3. 아무 exported story 하나

즉 `args`는 모든 story의 합집합이 아니라, **대표 story 하나의 args**예요.

반면 `originalSources`는 story 순서대로 여러 개를 배열로 모아요.

## kind 판별 방식

컴포넌트 종류는 AST 분석이 아니라 **경로 문자열 규칙**으로 판별해요.

- 경로에 `/atom/` 포함 → `atom`
- 경로에 `/molecule/` 포함 → `molecule`
- 그 외 → `unknown`

즉 현재 결과의 `kind`는 엄격한 타입 체계라기보다, **경로 기반 휴리스틱**이에요.

예를 들어 feature 컴포넌트나 profile/resume 같은 영역은 대부분 `unknown`으로 남을 수 있어요.

## 현재 산출물 특징

`web/docs/storybook/components.meta.json` 기준 현재 메타 JSON의 특징은 다음과 같아요.

- `version: 1` 형태의 단순 버전 필드를 가져요.
- 생성 시각이 `generatedAt`에 들어가요.
- 어떤 Storybook index를 기준으로 만들었는지 `source.storybookIndex`에 기록돼요.
- 현재 저장된 컴포넌트 수는 9개예요.
- 각 컴포넌트는 `name`, `kind`, `componentPath`, `storiesPath`, `argTypes`, `args`, `originalSources` 필드를 가져요.

## 이 문서의 장점

이 JSON은 사람용 긴 문서보다 다음 용도에 더 잘 맞아요.

- 에이전트가 컴포넌트 목록을 빠르게 이해
- 컴포넌트별 props 설명 확인
- story 예시 코드 수집
- 원본 컴포넌트와 stories 파일 경로 추적
- atom/molecule 수준의 대략적 분류

즉 디자인 시스템 문서를 “렌더링된 문서”라기보다, **기계가 읽을 수 있는 메타 인덱스**로 보는 게 맞아요.

## 한계

현재 방식에는 몇 가지 한계도 있어요.

- Storybook build 산출물이 있어야만 생성 가능해요.
- 동적 표현식이나 함수 기반 값은 복원하지 못해요.
- `kind` 판별이 경로 규칙 기반이라 정확도가 높지 않아요.
- 대표 `args`는 하나의 story만 기준으로 잡아요.
- Storybook 번들 구조가 크게 바뀌면 파서 로직도 같이 수정해야 해요.

## 정리

`npm run build-components-docs`는 Storybook 정적 산출물을 다시 읽어, 컴포넌트 메타데이터를 JSON으로 재구성하는 작업이에요.

핵심 포인트는 이거예요.

- 입력: `storybook-static/index.json` + 번들된 `*.stories*.js`
- 처리: Babel AST 기반 정적 메타 추출
- 출력: 컴포넌트 목록, props 메타, 대표 args, story source를 담은 JSON

즉 이 과정은 디자인 시스템을 새로 “작성”하는 것이 아니라, **이미 있는 Storybook 정보를 다른 시스템이 활용하기 쉬운 메타 문서로 변환하는 과정**이라고 보면 돼요.
