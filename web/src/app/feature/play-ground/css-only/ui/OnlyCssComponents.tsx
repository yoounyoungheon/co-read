import CssOnlyTabItemCard from "./CssOnlyTabItemCard";
import ExpandableCard from "./ExpandableCard";
import FlipCardDemo from "./FlipCardDemo";
import OnlyCssHero from "./OnlyCssHero";
import SectionIntro from "./SectionIntro";
import {
  CssOnlyTabItem,
  ExpandableCardProps,
  FlipCardDemoProps,
  HeroProps,
} from "./OnlyCssComponents.type";

const HERO_CONTENT: HeroProps = {
  eyebrow: "CSS Only Playground",
  title: "상태는 브라우저가 갖고, UI는 CSS만으로 반응합니다.",
  description:
    "아래 예시는 모두 Server Component예요. React state 없이도 hover, details, radio 같은 브라우저 기본 상태를 활용해 충분히 읽히는 인터랙션을 만들 수 있어요. 서버 컴포넌트를 사용하면 단순한 UI 상태 때문에 굳이 Client Component 범위를 넓히지 않아도 돼서, 서버 렌더링 구조를 유지하면서도 번들 크기와 복잡도를 함께 줄일 수 있어요.",
};

const FLIP_CARD_DEMO: FlipCardDemoProps = {
  front: {
    eyebrow: "Hover to Flip",
    title: "손대면 뒤집히는 카드",
    description:
      "클라이언트 상태 없이 3D transform만으로도 인상적인 전환을 만들 수 있어요.",
    footer: "summary → detail",
  },
  back: {
    eyebrow: "Back Face",
    title: "사용 예시",
    list: [
      "포트폴리오 프로젝트의 요약/회고 분리",
      "멤버 카드의 역할/연락처 분리",
      "제품 카드의 핵심 기능/도입 효과 분리",
    ],
  },
};

const EXPANDABLE_CARDS: ExpandableCardProps[] = [
  {
    eyebrow: "Click to Open",
    title: "CSS-only 체크리스트",
    description: "React state 없이도 open 상태를 브라우저가 기억합니다.",
    items: [
      {
        title: "Structure",
        body: "summary는 트리거, 아래 영역은 열렸을 때만 보이는 본문으로 분리해요.",
      },
      {
        title: "Motion",
        body: "아이콘 회전, border 변화, 배경색 변화만으로도 충분히 상태를 전달할 수 있어요.",
      },
      {
        title: "Use Case",
        body: "세부 설명, 도움말, 정책 안내처럼 단계적으로 읽게 만드는 UI에 잘 맞아요.",
      },
      {
        title: "Accessibility",
        body: "`details`와 `summary`를 쓰면 기본 시맨틱을 그대로 가져갈 수 있어서, 단순한 펼침 UI에 특히 유리해요.",
      },
      {
        title: "Maintenance",
        body: "토글 하나를 위해 별도 상태와 이벤트를 만들지 않아서, 코드를 읽고 유지보수하기도 훨씬 단순해져요.",
      },
    ],
  },
  {
    eyebrow: "FAQ Pattern",
    title: "질문과 답변도 이 구조로 충분해요",
    description:
      "하나씩 펼쳐보는 FAQ나 도움말은 details 패턴과 가장 잘 맞는 영역 중 하나예요.",
    items: [
      {
        title: "Question",
        body: "짧은 질문 제목을 summary에 두고, 답변은 본문으로 분리하면 돼요.",
      },
      {
        title: "Repeatable",
        body: "같은 구조를 여러 개 반복하기 쉬워서 문서형 UI에 잘 어울려요.",
      },
      {
        title: "Readable",
        body: "열기 전에는 정보 밀도를 줄이고, 필요할 때만 내용을 확장해 보여줄 수 있어요.",
      },
    ],
  },
  {
    eyebrow: "Tiny Settings",
    title: "작은 설정 패널도 부담 없이 만들어요",
    description:
      "설정 설명을 잠깐 열어보는 수준이라면 굳이 별도 상태 관리 없이도 충분히 깔끔해요.",
    items: [
      {
        title: "Server Friendly",
        body: "서버 컴포넌트 안에서도 그대로 유지할 수 있어요.",
      },
      {
        title: "Low Cost",
        body: "작은 토글을 위해 클라이언트 컴포넌트를 넓게 만들 필요가 없어요.",
      },
      {
        title: "Composable",
        body: "안내 문구, 설정 설명, 주의사항처럼 짧은 블록을 묶어 보여주기에 좋아요.",
      },
    ],
  },
];

const CSS_ONLY_TABS: CssOnlyTabItem[] = [
  {
    id: "tab-layout",
    label: "Layout",
    eyebrow: "No useState, no tears",
    title: "state? 브라우저가 들고 있어요",
    description:
      "useState를 열지 않아도 탭은 잘 바뀝니다. 활성 상태는 브라우저가 맡고, 우리는 peer-checked만 얹으면 돼요.",
    points: [
      "상태 관리 라이브러리: 브라우저 내장",
      "hydration 전에 이미 모양이 맞아 있음",
      "탭, 필터, segmented control에 바로 재활용 가능",
    ],
  },
  {
    id: "tab-expand",
    label: "Expand",
    eyebrow: "HTML did it first",
    title: "details 태그는 원래 강해요",
    description:
      "새로운 토글 컴포넌트를 만들기 전에, HTML 기본 요소가 이미 이 문제를 풀고 있다는 사실을 떠올리면 됩니다.",
    points: [
      "열림/닫힘 상태를 직접 기억할 필요 없음",
      "FAQ, 도움말, 설정 패널에 넣기 좋음",
      "시맨틱도 챙기고 코드도 덜 짜게 됨",
    ],
  },
  {
    id: "tab-flip",
    label: "Flip",
    eyebrow: "Looks fancy, still CSS",
    title: "있어 보이는데 JS는 안 썼어요",
    description:
      "3D transform만으로도 꽤 그럴듯한 UI가 나와요. 발표할 때는 복잡해 보이는데, 실제 상태는 hover 하나예요.",
    points: [
      "요약과 상세를 한 카드 안에 우겨 넣기 좋음",
      "보는 사람은 어려워 보이는데 구현은 의외로 단순",
      "포트폴리오, 프로필 카드, 소개 영역에 잘 어울림",
    ],
  },
];

function CssOnlyFlipCardSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionIntro
        indexLabel="01. Flip Card"
        title="CSS로 구현한 FlipCard"
        description="별도 상태 훅 없이 hover만으로 카드의 앞면과 뒷면을 전환합니다. 소개와 세부 설명을 같은 영역 안에 담고 싶을 때 유용해요."
      />
      <FlipCardDemo {...FLIP_CARD_DEMO} />
    </section>
  );
}

function CssOnlyExpandableSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionIntro
        indexLabel="02. Expand Card"
        title="클릭하면 펼쳐지는 카드를 만듭니다."
        description="`details`와 `summary`는 가장 단순한 CSS-only disclosure 패턴이에요. FAQ, 설명 카드, 작은 설정 섹션처럼 열고 닫는 구조에 잘 맞아요."
      />

      <div className="grid gap-4">
        {EXPANDABLE_CARDS.map((card) => (
          <ExpandableCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

function CssOnlyTabsSection() {
  return (
    <section className="space-y-4">
      <SectionIntro
        indexLabel="03. Recommended Pattern"
        title="CSS-only 탭입니다."
        description="가장 재사용성이 높은 패턴은 탭이에요. 소개, 기능, 비교, 단계 요약처럼 한 자리에서 여러 상태를 전환해야 할 때 `radio + label + peer-checked` 조합이 깔끔하게 동작합니다."
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {CSS_ONLY_TABS.map((tab, index) => (
          <CssOnlyTabItemCard
            key={tab.id}
            tab={tab}
            defaultChecked={index === 0}
          />
        ))}
      </div>
    </section>
  );
}

export default function OnlyCssComponents() {
  return (
    <section className="flex w-full max-w-6xl flex-col gap-6 px-4 py-4 md:px-0">
      <OnlyCssHero {...HERO_CONTENT} />
      <CssOnlyFlipCardSection />
      <CssOnlyExpandableSection />
      <CssOnlyTabsSection />
    </section>
  );
}
