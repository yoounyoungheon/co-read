import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type GuideId =
  | "reusable-components"
  | "domain-components"
  | "data-flow-layering"
  | "rsc-rendering"
  | "rcc-rendering"
  | "css-only-state"
  | "sse-chat-streaming"
  | "rtc-signaling"
  | "storybook-authoring"
  | "style-implementation";

export type GuidePriority = "high" | "medium" | "low";

type GuideTrigger = {
  paths: string[];
  keywords: string[];
};

type GuideDefinition = {
  id: GuideId;
  title: string;
  summary: string;
  triggers: GuideTrigger;
  sources: string[];
  canonicalSources: string[];
  guideFiles?: string[];
  body: string;
};

export type ResolvedGuide = {
  id: GuideId;
  reason: string;
  priority: GuidePriority;
};

export type GuideSourceStatus = {
  path: string;
  exists: boolean;
  lastModified: string | null;
};

export type GuideReadResult = {
  id: GuideId;
  title: string;
  summary: string;
  body: string;
  sourcePaths: string[];
  canonicalSourcePaths: string[];
  sources: GuideSourceStatus[];
  canonicalSources: GuideSourceStatus[];
  lastUpdated: string | null;
  lastUpdatedBasis: string;
};

const currentFilePath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFilePath), "..", "..");

const normalizePath = (value: string) =>
  value.replaceAll("\\", "/").toLowerCase();
const normalizedRepoRoot = normalizePath(repoRoot);

function toRepoRelativePath(value: string) {
  const normalizedValue = normalizePath(value);

  if (normalizedValue.startsWith(`${normalizedRepoRoot}/`)) {
    return normalizedValue.slice(normalizedRepoRoot.length + 1);
  }

  return normalizedValue;
}

const escapeRegex = (value: string) =>
  value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replaceAll("*", "[^/]*");

const globToRegExp = (pattern: string) => {
  const normalized = pattern.replaceAll("\\", "/");
  const withDoubleStar = normalized.replaceAll("**", "::DOUBLE_STAR::");
  const escaped = escapeRegex(withDoubleStar)
    .replaceAll("::DOUBLE_STAR::", ".*")
    .replaceAll("/.*", "(?:/.*)?");

  return new RegExp(`^${escaped}$`, "i");
};

const pathMatches = (candidatePath: string, patterns: string[]) => {
  const normalizedCandidate = normalizePath(candidatePath);

  return patterns.some((pattern) => {
    const normalizedPattern = normalizePath(pattern);
    return globToRegExp(normalizedPattern).test(normalizedCandidate);
  });
};

const textIncludesKeyword = (text: string, keywords: string[]) => {
  const normalizedText = text.toLowerCase();
  return keywords.some((keyword) =>
    normalizedText.includes(keyword.toLowerCase()),
  );
};

const toAbsoluteSourcePath = (sourcePath: string) =>
  path.resolve(repoRoot, sourcePath);

async function readGuideMarkdown(filePath: string) {
  const absolutePath = toAbsoluteSourcePath(filePath);

  try {
    return await readFile(absolutePath, "utf8");
  } catch {
    return "";
  }
}

const guides: GuideDefinition[] = [
  {
    id: "reusable-components",
    title: "재사용 컴포넌트 가이드",
    summary:
      "shared/ui 변경은 shared/ui 안에 유지하고, 재사용 가능한 공개 props를 보존하며, story는 컴포넌트 옆에 함께 둬야 합니다.",
    triggers: {
      paths: [
        "web/src/app/shared/ui/**",
        "web/src/app/shared/ui/**/*.stories.tsx",
        "web/docs/storybook/components.meta.json",
      ],
      keywords: [
        "shared/ui",
        "shared ui",
        "reusable component",
        "design system",
        "atom",
        "molecule",
        "originalsources",
      ],
    },
    sources: [
      "web/AGENTS.md",
      "web/src/app/shared/ui/atom/button.stories.tsx",
      "web/src/app/shared/ui/molecule/markdown-viewer.tsx",
      "web/src/app/shared/ui/molecule/markdown-viewer.stories.tsx",
      "web/docs/storybook/components.meta.json",
    ],
    canonicalSources: [
      "web/src/app/shared/ui/atom/button.stories.tsx",
      "web/src/app/shared/ui/molecule/markdown-viewer.tsx",
      "web/src/app/shared/ui/molecule/markdown-viewer.stories.tsx",
      "web/docs/storybook/components.meta.json",
    ],
    body: `# reusable-components

## 언제 읽어야 하나
- \`web/src/app/shared/ui\` 아래 파일을 생성하거나 수정할 때 읽습니다.
- 재사용 atom/molecule 조합 방식이나 shared 컴포넌트 story 작성 기준이 필요할 때 읽습니다.

## 근거 기반 규칙
- 재사용 UI는 \`shared/ui\` 아래에 있어야 하며, shared primitive 안에 도메인 전용 문구나 상태를 넣지 않습니다.
- story 파일은 컴포넌트 파일과 같은 경로에 두어 구현과 데모가 함께 진화하게 합니다.
- 공개 props는 재사용 API 표면으로 다룹니다. feature 전용 상태보다 작고 표현 중심의 props를 우선합니다.
- 새로운 story 스타일이나 prop 스타일을 임의로 만들기보다, 주변 story와 컴포넌트에서 이미 쓰는 팀 패턴을 따릅니다.

## 현재 레포 패턴
- shared story는 보통 \`Default\`를 먼저 두고, 그 뒤에 상태/variant story를 몇 개 추가합니다.
- 실제 사용 맥락을 재현하는 wrapper render 함수는 허용되지만, wrapper 자체는 최소 범위로 유지합니다.
- \`MarkdownViewer\`는 작은 공개 API와 스타일 variant를 가진 shared 컴포넌트의 현재 패턴을 보여줍니다.
- \`Button\` story는 Storybook에서 variant, type, size, disabled 상태를 어떻게 보여주는지 잘 드러냅니다.

## 주의사항
- 디자인 시스템 metadata 산출물은 \`web/docs/storybook/components.meta.json\`을 기준으로 기대하지만, Storybook 문서를 생성하기 전에는 이 파일이 없을 수 있습니다.
- metadata가 없으면 주변 구현 파일과 Storybook 산출물을 canonical 근거로 사용합니다.
`,
  },
  {
    id: "domain-components",
    title: "도메인 컴포넌트 가이드",
    summary:
      "Feature UI는 feature/*/ui에 두고, 가능하면 shared UI를 조합해서 만들며, 같은 경로의 story를 반드시 함께 유지해야 합니다.",
    triggers: {
      paths: [
        "web/src/app/feature/*/ui/**",
        "web/src/app/feature/*/ui/**/*.stories.tsx",
        "web/src/app/feature/play-ground/chat/ui/**",
      ],
      keywords: [
        "feature ui",
        "domain component",
        "feature/",
        "play-ground",
        "chat ui",
      ],
    },
    sources: [
      "web/AGENTS.md",
      "web/src/app/feature/play-ground/chat/ui/ChatUI.tsx",
      "web/src/app/feature/play-ground/chat/ui/ChatUI.stories.tsx",
      "web/src/app/feature/profile/ui/Profile.stories.tsx",
    ],
    canonicalSources: [
      "web/src/app/feature/play-ground/chat/ui/ChatUI.tsx",
      "web/src/app/feature/play-ground/chat/ui/ChatUI.stories.tsx",
      "web/src/app/feature/profile/ui/Profile.stories.tsx",
    ],
    body: `# domain-components

## 언제 읽어야 하나
- \`web/src/app/feature/*/ui\`에서 작업할 때 읽습니다.
- 도메인 상태를 드러내는 feature props, wrapper, story를 만들 때 읽습니다.

## 근거 기반 규칙
- 도메인 UI는 \`feature/*/ui\`에 있어야 하며, 새로운 primitive를 만들기 전에 shared UI 조합을 먼저 검토합니다.
- feature 컴포넌트를 추가하거나 수정하면 같은 경로의 story도 함께 생성하거나 갱신합니다.
- 공개 props는 shared 컴포넌트의 모든 props를 노출하는 방식이 아니라, feature 사용 맥락 중심으로 설계합니다.
- 필요한 primitive가 없으면 \`shared/ui\`를 조용히 확장하지 말고, 해당 feature 컴포넌트를 명시적으로 미완성 상태로 남깁니다.

## 현재 레포 패턴
- \`ChatUI\`는 provider, chat 상태, shared SSE 관심사를 feature 레이어 안에서 조합하면서도 공개 export는 단순하게 유지합니다.
- Feature story는 휴대폰 크기나 실제 화면 제약을 재현하는 현실적인 wrapper를 사용합니다.
- \`Default\`는 기본으로 있어야 하고, 추가 story는 내부 구현 분기보다 사용자가 실제로 보게 될 상태를 드러내야 합니다.

## 주의사항
      - 도메인 데이터와 렌더링 상태는 feature 레이어에 남겨야 합니다.
      - 한 화면을 단순하게 만들기 위해 feature 전용 비즈니스 상태를 shared primitive로 옮기지 않습니다.
      `,
  },
  {
    id: "data-flow-layering",
    title: "데이터 흐름 레이어링 가이드",
    summary:
      "API 응답은 api-model, domain, view-model을 순서대로 거쳐야 하며 service는 domain까지만 반환하고 presenter가 UI용 데이터를 만들어야 합니다.",
    triggers: {
      paths: [
        "web/src/app/feature/*/business/**",
        "web/src/app/feature/*/presentation/**",
        "web/src/app/**/page.tsx",
        "web/src/app/**/layout.tsx",
      ],
      keywords: [
        "api model",
        "view model",
        "domain model",
        "presenter",
        "presentation",
        "service",
        "mapper",
        "data flow",
        "ui props",
        "api to ui",
        "layering",
      ],
    },
    sources: [
      "mcp/guidance/data-flow-layering.md",
      "web/src/app/page.tsx",
      "web/src/app/layout.tsx",
      "web/src/app/feature/article/business/article.service.ts",
      "web/src/app/feature/article/presentation/article.presenter.ts",
      "web/src/app/feature/project/business/project.service.ts",
      "web/src/app/feature/project/presentation/project.presenter.ts",
      "web/src/app/feature/resume/business/resume.service.ts",
      "web/src/app/feature/resume/presentation/resume.presenter.ts",
      "web/src/app/feature/play-ground/presentation/play-ground.presenter.ts",
      "web/README.md",
    ],
    canonicalSources: [
      "mcp/guidance/data-flow-layering.md",
      "web/src/app/page.tsx",
      "web/src/app/layout.tsx",
      "web/src/app/feature/article/business/article.service.ts",
      "web/src/app/feature/article/presentation/article.presenter.ts",
      "web/src/app/feature/project/business/project.service.ts",
      "web/src/app/feature/project/presentation/project.presenter.ts",
      "web/src/app/feature/resume/business/resume.service.ts",
      "web/src/app/feature/resume/presentation/resume.presenter.ts",
      "web/src/app/feature/play-ground/presentation/play-ground.presenter.ts",
      "web/README.md",
    ],
    guideFiles: ["mcp/guidance/data-flow-layering.md"],
    body: `# data-flow-layering

이 가이드는 API 응답이 business와 presentation 레이어를 거쳐 UI까지 전달되는 동안 어떤 책임 분리가 필요한지 설명합니다.

## 언제 읽어야 하나
- \`business\`, \`presentation\`, \`page.tsx\`, \`layout.tsx\`를 수정할 때 읽습니다.
- 작업 설명에 api-model, domain, presenter, view-model, UI props, data flow, service 경계가 언급될 때 읽습니다.

## 근거 기반 규칙
- service는 fetch와 응답 상태 검사 후 domain까지만 반환해야 합니다.
- presenter는 domain을 UI 친화적인 view model로 바꿔야 합니다.
- UI는 가능한 한 view model만 props로 받아야 하며 raw API shape를 직접 다루지 않아야 합니다.
- business 레이어가 feature UI 타입을 import 하면 안 됩니다.

## 현재 레포 패턴
- \`page.tsx\`는 feature service와 presenter를 조합해 메인 화면 데이터를 준비합니다.
- \`layout.tsx\`는 profile service와 presenter를 조합해 공통 프로필 UI 데이터를 준비합니다.
- article, project, resume은 service가 domain을 반환하고 presenter가 view model을 만드는 구조로 정리돼 있습니다.
- play-ground는 실시간 상태는 UI 인접 레이어에 두되, 카드 메타데이터 같은 정적인 화면 데이터는 presentation으로 올릴 수 있습니다.

## 주의사항
- api-model과 view-model은 비슷해 보여도 같은 책임이 아닙니다.
- service에서 UI props를 바로 만들기 시작하면 business와 UI가 다시 강하게 결합됩니다.
- page/layout에서 presenter 없이 domain을 바로 UI로 넘기면 화면 요구사항 변경이 business 레이어로 새기 쉽습니다.
`,
  },
  {
    id: "rsc-rendering",
    title: "Server Component 가이드",
    summary:
      "기본값은 Server Component이며, page/layout은 서버에 유지하고 데이터 조회와 초기 렌더링 책임도 서버에 둬야 합니다.",
    triggers: {
      paths: ["web/src/app/**/page.tsx", "web/src/app/**/layout.tsx"],
      keywords: [
        "server component",
        "rsc",
        "page.tsx",
        "layout.tsx",
        "seo",
        "initial data",
      ],
    },
    sources: ["mcp/guidance/RSC-guide.md", "web/AGENTS.md"],
    canonicalSources: ["mcp/guidance/RSC-guide.md", "web/AGENTS.md"],
    guideFiles: ["mcp/guidance/RSC-guide.md"],
    body: `# rsc-rendering

이 가이드는 Server Component를 기본값으로 유지해야 하는 작업에서 참고하는 구현 기준입니다.
`,
  },
  {
    id: "rcc-rendering",
    title: "Client Component 가이드",
    summary:
      "Client Component는 예외적으로만 사용하고, `use client` 범위를 최소화하며 상호작용이 필요한 최소 단위만 분리해야 합니다.",
    triggers: {
      paths: [],
      keywords: [
        "client component",
        "rcc",
        "use client",
        "usestate",
        "useeffect",
        "onclick",
        "browser api",
        "window",
        "document",
      ],
    },
    sources: ["mcp/guidance/RCC-guide.md", "web/AGENTS.md"],
    canonicalSources: ["mcp/guidance/RCC-guide.md", "web/AGENTS.md"],
    guideFiles: ["mcp/guidance/RCC-guide.md"],
    body: `# rcc-rendering

이 가이드는 Client Component 분리가 정말 필요한지 판단하고, 필요한 경우에도 범위를 최소화하는 기준입니다.
`,
  },
  {
    id: "css-only-state",
    title: "CSS-Only 상태 가이드",
    summary:
      "단순한 선택/열림/닫힘 상태는 React state 대신 radio, checkbox, label, peer-checked 조합으로 구현해 Server Component를 유지할 수 있습니다.",
    triggers: {
      paths: ["web/src/app/**/*.tsx", "web/src/app/**/*.css"],
      keywords: [
        "css-only",
        "peer-checked",
        "peer checked",
        "radio",
        "checkbox",
        "label",
        "toggle",
        "tab",
        "accordion",
        "server component",
        "without javascript",
      ],
    },
    sources: [
      "mcp/guidance/css-only-state.md",
      "mcp/guidance/RSC-guide.md",
      "mcp/guidance/RCC-guide.md",
      "web/AGENTS.md",
    ],
    canonicalSources: [
      "mcp/guidance/css-only-state.md",
      "mcp/guidance/RSC-guide.md",
      "mcp/guidance/RCC-guide.md",
      "web/AGENTS.md",
    ],
    guideFiles: ["mcp/guidance/css-only-state.md"],
    body: `# css-only-state

이 가이드는 Server Component를 유지하면서도 작은 UI 상태를 CSS만으로 표현할 수 있는 패턴을 설명합니다.

## 언제 읽어야 하나
- 단순 선택, 토글, 탭, 아코디언, 상세 패널 같은 상호작용을 구현할 때 읽습니다.
- React state를 추가하지 않고 UI 상태를 표현하고 싶을 때 읽습니다.

## 핵심 원칙
- 상태 저장은 브라우저 입력 요소가 맡고, 표현은 CSS selector가 맡습니다.
- \`radio + label + peer-checked\`는 단일 선택 상태에 적합합니다.
- \`checkbox + label + peer-checked\`는 독립적인 on/off 상태에 적합합니다.
- 상태가 복잡해지거나 접근성 요구가 커지면 Client Component로 전환합니다.
`,
  },
  {
    id: "sse-chat-streaming",
    title: "SSE 채팅 스트리밍 가이드",
    summary:
      "shared SSE provider는 하나의 EventSource를 관리하고, 채팅 스트리밍은 START와 PAIRING payload를 누적하다가 FINISH에서 연결을 닫습니다.",
    triggers: {
      paths: [
        "web/src/app/shared/sse/**",
        "web/src/app/feature/play-ground/chat/**",
        "web/src/app/api/streaming/chat/**",
      ],
      keywords: [
        "sse",
        "usesse",
        "eventsource",
        "stream",
        "chat",
        "pairing",
        "finish",
      ],
    },
    sources: [
      "mcp/guidance/use-sse.md",
      "mcp/guidance/use-chat.md",
      "mcp/guidance/stream.md",
      "web/src/app/shared/sse/business/context/sseContext.tsx",
      "web/src/app/shared/sse/business/hook/useSSE.tsx",
      "web/src/app/feature/play-ground/chat/business/context/chat.context.tsx",
      "web/src/app/feature/play-ground/chat/ui/ChatUI.tsx",
      "web/src/app/api/streaming/chat/route.ts",
    ],
    canonicalSources: [
      "web/src/app/shared/sse/business/context/sseContext.tsx",
      "web/src/app/shared/sse/business/hook/useSSE.tsx",
      "web/src/app/feature/play-ground/chat/business/context/chat.context.tsx",
      "web/src/app/feature/play-ground/chat/ui/ChatUI.tsx",
      "web/src/app/api/streaming/chat/route.ts",
    ],
    guideFiles: [
      "mcp/guidance/use-sse.md",
      "mcp/guidance/use-chat.md",
      "mcp/guidance/stream.md",
    ],
    body: `# sse-chat-streaming

## 언제 읽어야 하나
- \`shared/sse\`, 채팅 스트리밍 UI, 스트리밍 API route를 수정할 때 읽습니다.
- 작업 설명에 \`useSSE\`, \`useChat\`, EventSource, streaming payload, SSE lifecycle 버그가 언급될 때 읽습니다.

## 근거 기반 규칙
- \`SSEProvider\`는 단일 \`EventSource\` 인스턴스를 관리합니다. 새 스트림을 열기 전에는 항상 \`close()\`를 먼저 호출합니다.
- \`useSSE\`는 연결 수명주기 인프라이지, 도메인 상태 저장소가 아닙니다.
- \`useChat\`은 chat item만 관리합니다. pairing list 같은 feature 전용 상태는 feature UI 내부에 두고 \`infoPanel\`을 통해 렌더링합니다.
- 현재 스트리밍 route는 기본 \`message\` 이벤트 안에 \`START\`, \`PAIRING\`, \`FINISH\` 타입을 담은 JSON \`data\` payload를 보냅니다.
- route는 heartbeat comment도 함께 보내므로, 소비자는 JSON이 아닌 메시지와 파싱 실패를 허용해야 합니다.

## 현재 레포 패턴
- \`ChatUI\`는 비어 있는 봇 메시지 하나를 먼저 만든 뒤, 같은 chat item에 \`START\` chunk를 계속 덧붙입니다.
- Pairing 카드는 feature 내부 상태에서 rank 기준으로 조립한 뒤 \`infoPanel\`로 투영합니다.
- \`FINISH\`가 오면 SSE 연결을 닫고, 채팅 렌더링 상태는 feature 레이어에 남깁니다.
- route는 현재 \`:chat\`, \`:heartbeat\` 같은 comment line을 앞에 두고 \`data:<json-payload>\` 형식으로 payload를 스트리밍합니다.

## 드리프트 경고
- \`mcp/guidance/stream.md\`는 아직 \`prepare\`, \`title\`, \`description\` 같은 예전 named event를 설명하고 있습니다.
- 구현 작업의 canonical 기준은 \`web/src/app/api/streaming/chat/route.ts\`와 shared SSE/chat source 파일들입니다.
`,
  },
  {
    id: "rtc-signaling",
    title: "RTC 시그널링 가이드",
    summary:
      "useRtc는 SockJS/STOMP 시그널링과 WebRTC peer 연결을 함께 관리하며, offer/answer/iceCandidate 경로와 roomId 규칙을 정확히 맞춰야 합니다.",
    triggers: {
      paths: [
        "web/src/app/shared/rtc/**",
        "web/src/app/feature/play-ground/**",
        "signaling/**",
      ],
      keywords: [
        "rtc",
        "webrtc",
        "signaling",
        "signalling",
        "sockjs",
        "stomp",
        "peer connection",
        "ice candidate",
        "offer",
        "answer",
        "screen share",
        "useRtc",
      ],
    },
    sources: [
      "mcp/guidance/use-rtc.md",
      "web/src/app/shared/rtc/useRtc.tsx",
      "signaling/server.js",
      "signaling/README.md",
    ],
    canonicalSources: [
      "web/src/app/shared/rtc/useRtc.tsx",
      "signaling/server.js",
      "signaling/README.md",
    ],
    guideFiles: ["mcp/guidance/use-rtc.md"],
    body: `# rtc-signaling

## 언제 읽어야 하나
- \`shared/rtc\`, WebRTC 연결 흐름, 시그널링 서버를 수정할 때 읽습니다.
- 작업 설명에 \`useRtc\`, offer/answer, ice candidate, SockJS, STOMP, 화면 공유, peer connection이 언급될 때 읽습니다.

## 근거 기반 규칙
- 현재 RTC 구현은 \`useRtc.tsx\`가 클라이언트 WebRTC 상태와 SockJS/STOMP 시그널링을 함께 관리하는 구조입니다.
- 시그널링 destination은 \`/app/*\` publish와 \`/topic/*\` subscribe 경로를 그대로 유지해야 합니다.
- room 식별자는 현재 \`${"${id}"}consulting\` 규칙을 사용하므로, client와 signaling 서버가 같은 규칙을 공유해야 합니다.
- remote description 전에 들어온 ICE candidate는 즉시 적용하지 않고 queue 후 flush 해야 합니다.
- 화면 공유는 재협상 대신 \`replaceTrack()\` 기반으로 video sender만 교체하는 흐름입니다.

## 현재 레포 패턴
- \`startStream()\`은 먼저 \`/app/call/key\`를 publish 하고, 수집된 상대 key 기준으로 offer를 만듭니다.
- 상대는 \`/topic/call/key\`를 받고 \`/app/send/key\`로 자신의 key를 다시 보냅니다.
- offer를 받은 쪽은 remote description 적용 후 answer를 생성하고, answer를 받은 쪽이 최종적으로 연결을 완성합니다.
- cleanup에서는 STOMP subscription 해제, local/screen stream stop, peer connection close를 모두 수행합니다.

## 주의사항
- \`myKey\`가 고유하지 않으면 topic 경로가 충돌합니다.
- SockJS URL과 signaling 서버 endpoint가 어긋나면 연결 자체가 성립하지 않습니다.
- TURN 서버 자격 증명은 현재 client 코드에 하드코딩돼 있으므로 보안상 별도 관리가 필요합니다.
`,
  },
  {
    id: "storybook-authoring",
    title: "Storybook 작성 가이드",
    summary:
      "story는 컴포넌트 옆에 두고, Default를 먼저 제공하며, 실제 레이아웃 맥락을 재현하는 최소 wrapper만 사용해야 합니다.",
    triggers: {
      paths: [
        "web/src/app/shared/ui/**/*.stories.tsx",
        "web/src/app/feature/*/ui/**/*.stories.tsx",
        "web/docs/storybook/index.json",
        "web/docs/storybook/components.meta.json",
      ],
      keywords: [
        "story",
        "storybook",
        "argtypes",
        "meta",
        "autodocs",
        "components.meta.json",
      ],
    },
    sources: [
      "mcp/guidance/story-guide.md",
      "web/AGENTS.md",
      "web/docs/storybook/index.json",
      "web/src/app/shared/ui/atom/button.stories.tsx",
      "web/src/app/shared/ui/molecule/markdown-viewer.stories.tsx",
      "web/src/app/feature/play-ground/chat/ui/ChatUI.stories.tsx",
      "web/docs/storybook/components.meta.json",
    ],
    canonicalSources: [
      "mcp/guidance/story-guide.md",
      "web/docs/storybook/index.json",
      "web/src/app/shared/ui/atom/button.stories.tsx",
      "web/src/app/shared/ui/molecule/markdown-viewer.stories.tsx",
      "web/src/app/feature/play-ground/chat/ui/ChatUI.stories.tsx",
      "web/docs/storybook/components.meta.json",
    ],
    guideFiles: ["mcp/guidance/story-guide.md"],
    body: `# storybook-authoring

## 언제 읽어야 하나
- \`*.stories.tsx\` 파일을 생성하거나 수정할 때 읽습니다.
- 작업 설명에 Storybook metadata, args, argTypes, wrapper, story 구성 범위가 언급될 때 읽습니다.

## 근거 기반 규칙
- story는 해당 컴포넌트를 문서화하는 파일과 같은 경로에 둡니다.
- \`Default\`를 먼저 export하고, 그 뒤에는 중요한 시각 상태나 도메인 상태를 보여주는 최소한의 story만 추가합니다.
- \`tags: ["autodocs"]\`와 현실적인 title 계층을 유지합니다.
- Wrapper \`render\` 함수는 사용 맥락을 재현해야지, 컴포넌트의 책임을 대신하면 안 됩니다.

## 현재 레포 패턴
- shared story는 주로 \`args\`와 \`argTypes\`를 통해 variant와 control을 보여줍니다.
- Feature story는 실제 화면 제약과 맞도록 크기를 가진 wrapper를 자주 사용합니다.
- 생성된 Storybook index인 \`web/docs/storybook/index.json\`이 존재하므로, 기존 story title과 component path의 근거로 활용할 수 있습니다.

## 주의사항
- 아키텍처 설계안은 생성 metadata를 canonical guide 입력으로 보지만, \`web/docs/storybook/components.meta.json\`은 빌드 전까지 없을 수 있습니다.
- 생성 metadata가 없으면 주변 story 파일과 생성된 Storybook index를 근거 기준으로 사용합니다.
`,
  },
  {
    id: "style-implementation",
    title: "스타일 구현 가이드",
    summary:
      "스타일은 mobile-first와 가독성 우선 원칙으로 설계하고, width/flow 관점에서 원인을 먼저 파악한 뒤 Tailwind를 적용해야 합니다.",
    triggers: {
      paths: ["web/src/app/**/*.css", "web/src/app/**/*.tsx"],
      keywords: [
        "style",
        "tailwind",
        "css",
        "className",
        "layout",
        "responsive",
        "animation",
        "grid",
        "flex",
        "width",
      ],
    },
    sources: ["mcp/guidance/style-guide.md", "web/AGENTS.md"],
    canonicalSources: ["mcp/guidance/style-guide.md", "web/AGENTS.md"],
    guideFiles: ["mcp/guidance/style-guide.md"],
    body: `# style-implementation

이 가이드는 스타일 구현과 디버깅에서 구조를 먼저 보고 장식을 나중에 더하는 기준을 제공합니다.
`,
  },
];

const guideMap = new Map(guides.map((guide) => [guide.id, guide]));

const scoreToPriority = (score: number): GuidePriority => {
  if (score >= 6) {
    return "high";
  }

  if (score >= 3) {
    return "medium";
  }

  return "low";
};

export const resolveGuides = (
  task: string,
  targetPaths: string[],
): ResolvedGuide[] => {
  const normalizedTask = task.trim();
  const repoRelativeTargetPaths = targetPaths.map((targetPath) =>
    toRepoRelativePath(targetPath),
  );

  const matches = guides
    .map((guide) => {
      const matchedPaths = repoRelativeTargetPaths.filter((targetPath) =>
        pathMatches(targetPath, guide.triggers.paths),
      );
      const keywordMatched = textIncludesKeyword(
        normalizedTask,
        guide.triggers.keywords,
      );
      const storySignal =
        guide.id === "storybook-authoring" &&
        repoRelativeTargetPaths.some((targetPath) =>
          targetPath.endsWith(".stories.tsx"),
        );

      const score =
        matchedPaths.length * 4 +
        (keywordMatched ? 2 : 0) +
        (storySignal ? 2 : 0);

      if (score === 0) {
        return null;
      }

      const reasons: string[] = [];

      if (matchedPaths.length > 0) {
        reasons.push(`matched target path: ${matchedPaths[0]}`);
      }

      if (keywordMatched) {
        reasons.push(`matched task keywords for ${guide.id}`);
      }

      if (storySignal) {
        reasons.push("story file detected");
      }

      return {
        id: guide.id,
        reason: reasons.join("; "),
        priority: scoreToPriority(score),
        score,
      };
    })
    .filter(
      (value): value is ResolvedGuide & { score: number } => value !== null,
    )
    .sort(
      (left, right) =>
        right.score - left.score || left.id.localeCompare(right.id),
    );

  return matches.map(({ score: _score, ...guide }) => guide);
};

export const readGuide = async (id: GuideId): Promise<GuideReadResult> => {
  const guide = guideMap.get(id);

  if (!guide) {
    throw new Error(`Unknown guide id: ${id}`);
  }

  const sources = await Promise.all(
    guide.sources.map(async (sourcePath) => {
      const absolutePath = toAbsoluteSourcePath(sourcePath);

      try {
        const stats = await stat(absolutePath);

        return {
          path: sourcePath,
          exists: true,
          lastModified: stats.mtime.toISOString(),
        } satisfies GuideSourceStatus;
      } catch {
        return {
          path: sourcePath,
          exists: false,
          lastModified: null,
        } satisfies GuideSourceStatus;
      }
    }),
  );

  const canonicalSourceSet = new Set(guide.canonicalSources);
  const canonicalSources = sources.filter((source) =>
    canonicalSourceSet.has(source.path),
  );
  const guideMarkdownSections = await Promise.all(
    (guide.guideFiles ?? []).map(async (filePath) => ({
      filePath,
      content: await readGuideMarkdown(filePath),
    })),
  );
  const appendedGuideMarkdown = guideMarkdownSections
    .filter((section) => section.content.trim().length > 0)
    .map(
      (section) =>
        `## 원문 가이드: \`${section.filePath}\`\n\n${section.content.trim()}`,
    )
    .join("\n\n---\n\n");

  const existingCanonicalSources = canonicalSources.filter(
    (source) => source.lastModified !== null,
  );
  const mostRecentSource = existingCanonicalSources.sort((left, right) => {
    return (
      new Date(right.lastModified as string).getTime() -
      new Date(left.lastModified as string).getTime()
    );
  })[0];

  return {
    id: guide.id,
    title: guide.title,
    summary: guide.summary,
    body: [guide.body.trim(), appendedGuideMarkdown]
      .filter((part) => part.length > 0)
      .join("\n\n---\n\n"),
    sourcePaths: guide.sources,
    canonicalSourcePaths: guide.canonicalSources,
    sources,
    canonicalSources,
    lastUpdated: mostRecentSource?.lastModified ?? null,
    lastUpdatedBasis: mostRecentSource
      ? `latest existing source mtime from ${mostRecentSource.path}`
      : "no listed canonical source files currently exist in the workspace",
  };
};

export const listGuideIds = () => guides.map((guide) => guide.id);
