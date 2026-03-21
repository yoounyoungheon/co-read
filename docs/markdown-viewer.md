# Markdown Viewer 설계 메모

## 목적

조회 전용 마크다운 콘텐츠를 SSR에 맞게 렌더링하되, 불필요한 클라이언트 번들을 늘리지 않고 `dangerouslySetInnerHTML`도 사용하지 않는 구조를 정리한다.

이 문서는 다음 기준을 전제로 한다.

- 글은 주로 읽기 전용이다.
- 초기 렌더링 품질과 SEO가 중요하다.
- 마크다운 조회를 위해 별도의 HTML 주입 경로를 만들고 싶지 않다.
- `page.tsx`, `layout.tsx`는 Server Component로 유지해야 한다.

## 결론

현재 구현은 `react-markdown` + `remark-gfm` 조합을 사용한다.

이 조합을 선택한 이유는 다음과 같다.

- Server Component에서 그대로 사용할 수 있다.
- 마크다운을 React 노드로 직접 렌더링할 수 있다.
- `dangerouslySetInnerHTML`가 필요 없다.
- GFM 문법을 비교적 단순하게 지원할 수 있다.

## 의사결정

### 1. HTML 문자열 주입 구조를 제거했다

초기에는 마크다운을 HTML로 변환한 뒤 주입하는 방식도 검토했다.

하지만 이 방식은 다음 부담이 있었다.

- HTML 문자열을 별도로 관리해야 한다.
- `dangerouslySetInnerHTML` 사용이 필요하다.
- 조회형 컴포넌트 치고 구조가 무거워진다.

현재는 HTML 문자열을 중간 산출물로 만들지 않고, `react-markdown`이 markdown를 React 노드로 직접 렌더링하도록 정리했다.

### 2. 서버 변환 전용 파일은 제거했다

이전에는 `markdown-viewer.server.ts` 같은 서버 전용 변환 모듈을 두는 구조를 검토했지만, 현재 구현에서는 필요하지 않다.

이유는 다음과 같다.

- `MarkdownViewer`가 markdown 문자열을 직접 렌더링한다.
- 더 이상 HTML 문자열을 생성해 전달할 필요가 없다.
- 컴포넌트 API가 단순해진다.

### 3. `dangerouslySetInnerHTML`를 사용하지 않는다

현재 구현의 핵심 결정이다.

이 기준으로 얻는 이점은 다음과 같다.

- HTML 주입 경로를 따로 관리하지 않아도 된다.
- 렌더링 계층이 React 흐름 안에 유지된다.
- 보안적으로도 raw HTML 주입을 기본 경로로 두지 않게 된다.

## 현재 구조

### 파일 구조

```text
src/app/shared/ui/molecule/
  markdown-viewer.tsx
  markdown-viewer.stories.tsx
```

### 역할

- `markdown-viewer.tsx`: markdown 문자열을 받아 React 노드로 렌더링하는 UI 컴포넌트
- `markdown-viewer.stories.tsx`: Storybook 데모 구성

## 컴포넌트 설계

### 공개 API

```ts
interface MarkdownViewerProps {
  markdown: string;
  className?: string;
}
```

공개 API는 가능한 한 단순하게 유지한다.

- `markdown`: 렌더링할 마크다운 문자열
- `className`: wrapper 스타일 확장용

파서 옵션이나 내부 라이브러리 세부사항은 외부 props로 노출하지 않는다.

### 구현 예시

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  markdown: string;
  className?: string;
}

export function MarkdownViewer({ markdown, className }: MarkdownViewerProps) {
  return (
    <article className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
```

### 책임 범위

`MarkdownViewer`의 책임은 다음으로 제한한다.

- markdown -> React 노드 렌더링
- wrapper 스타일 적용

다음 책임은 기본 구현에 넣지 않는다.

- raw HTML 주입
- 브라우저 이벤트 처리
- 접기/펼치기 같은 인터랙션
- 클라이언트 전용 데이터 fetch

인터랙션이 필요하면 해당 부분만 별도 Client Component로 최소 분리한다.

## 스타일링 원칙

현재 구현은 wrapper에 본문 typography 역할을 집중시킨다.

권장 방향:

- 모바일 기본 단일 컬럼
- `w-full`과 적절한 `max-w-*`를 함께 사용
- 제목, 본문, 리스트, 인용문, 코드 블록 계층을 분명히 구분
- 장식보다 가독성을 우선한다

현재 `markdown-viewer.tsx`에서는 다음 요소를 wrapper class로 제어한다.

- `h1`, `h2`, `h3`
- `p`
- `ul`, `ol`, `li`
- `blockquote`
- `pre`, `code`
- `a`
- `table`, `thead`, `tbody`, `th`, `td`

핵심은 typography primitive가 부족한 현재 구조에서, 본문 전체를 감싸는 wrapper가 레이아웃과 텍스트 계층을 책임지도록 두는 것이다.

## Storybook 설계

스토리 예시 데이터는 `docs/markdown-viewer.md` 원문을 그대로 사용한다.

Storybook은 브라우저 번들 환경이므로 `node:fs`를 사용하지 않고, 다음 방식으로 예시를 구성한다.

- 문서 원문을 `?raw` import로 가져온다.
- markdown 문자열을 컴포넌트에 직접 전달한다.

즉, 스토리도 현재 앱 구조와 동일하게 “markdown 직접 입력” 방식을 따른다.

## 보안 관점

현재 구조는 HTML 문자열을 직접 주입하지 않으므로, `dangerouslySetInnerHTML` 기반 구조보다 단순하다.

그래도 다음 원칙은 유지해야 한다.

- 사용자 입력 마크다운을 무조건 신뢰하지 않는다.
- raw HTML 허용 여부는 명확히 결정한다.
- 링크, 이미지, 코드 블록 등 정책이 필요한 요소는 별도 렌더링 규칙을 둔다.

추후 필요하면 `react-markdown`의 `components` 매핑으로 다음을 확장할 수 있다.

- 링크 속성 통제
- 코드 블록 커스텀 렌더링
- 이미지 렌더링 정책
- heading anchor 처리

## 구현 시 주의사항

- `page.tsx`, `layout.tsx`는 Server Component로 유지한다.
- 마크다운 뷰어 전체를 `"use client"`로 만들지 않는다.
- 조회 전용 콘텐츠 때문에 넓은 범위의 클라이언트 전환을 하지 않는다.
- shared/ui에 새 primitive를 추가하기 전에 wrapper 스타일로 해결 가능한지 먼저 본다.

## 최종 정리

현재 `MarkdownViewer`는 markdown 문자열을 직접 받아 `react-markdown`으로 React 노드를 렌더링한다.

정리하면:

- `MarkdownViewer`는 markdown 입력을 받는다.
- `dangerouslySetInnerHTML`는 사용하지 않는다.
- 서버 변환 전용 HTML 모듈은 두지 않는다.
- Storybook도 markdown 문자열을 직접 전달한다.

이 구조는 SSR 우선, 조회 전용, 단순한 컴포넌트 API, HTML 주입 제거라는 목표에 가장 잘 맞는다.
