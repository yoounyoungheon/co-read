import type { Meta, StoryObj } from "@storybook/nextjs";
import { TimeLine, TimeLineItem } from "./TimeLine";

export const defaultTimeLineItems: TimeLineItem[] = [
  {
    kind: "university",
    tone: "slate",
    badge: "University",
    title: "대학생",
    period: "2019 ~ 2025",
    school: "동국대학교",
    majors: ["융합소프트웨어", "경영학 복수전공"],
    courses: [
      "웹 프로그래밍",
      "데이터베이스",
      "운영체제",
      "컴퓨터 네트워크",
      "소프트웨어 공학",
    ],
    summary:
      "기술 구현을 넘어서 비즈니스와 제품 관점까지 함께 보는 기반을 대학 시절에 만들었습니다.",
  },
  {
    kind: "club",
    tone: "rose",
    badge: "Club & Build",
    title: "동아리",
    intro:
      "학교 밖으로 시선을 넓히며, 금융과 서비스 기획을 실제 문제에 연결해 보는 경험을 쌓았습니다.",
    stories: [
      {
        title: "금융 동아리",
        startTime: "2020.03",
        endTime: "2021.12",
        description:
          "금융 서비스가 사용자에게 어떤 방식으로 전달되는지, 문제를 어떻게 정의하고 풀어야 하는지에 관심을 갖게 된 계기였습니다. 기술과 도메인이 만나는 지점을 자연스럽게 고민하기 시작했습니다.",
        links: [
          {
            header: "활동 기록",
            path: "/resume",
          },
        ],
      },
      {
        title: "창업 프로젝트",
        startTime: "2022.03",
        endTime: "2022.12",
        description:
          "아이디어를 제품 형태로 구체화하며 역할 분담, 빠른 검증, 우선순위 설정의 중요성을 배웠습니다. 구현 이전에 무엇을 먼저 풀어야 하는지 정리하는 힘을 많이 길렀습니다.",
        links: [],
      },
    ],
  },
  {
    kind: "bootcamp",
    tone: "blue",
    badge: "Bootcamp",
    title: "디지털 하나로",
    period: "금융 IT 부트캠프",
    program: "실무형 팀 프로젝트 중심 과정",
    programDescription:
      "금융 서비스를 주제로 팀 프로젝트를 반복하며 설계, 구현, 협업, 발표까지 한 흐름으로 경험한 과정입니다.",
    awards: ["프로젝트 최우수상 수상", "금융 도메인 기반 서비스 설계 경험"],
    retrospective: [
      {
        title: "구조적 품질에 대한 고민",
        description:
          "짧은 일정 안에서도 구조적 품질을 놓치지 않는 것이 중요하다는 점을 체감했습니다.",
        links: [
          {
            header: "회고 문서",
            path: "/resume",
          },
        ],
      },
      {
        title: "실전 감각 확보",
        description:
          "기능 구현, 협업, 배포까지 하나의 흐름으로 연결해 보는 실전 감각을 얻었습니다.",
        links: [],
      },
    ],
  },
  {
    kind: "work",
    tone: "zinc",
    badge: "Work",
    title: "Openlabs",
    company: "Openlabs",
    role: "Frontend Developer",
    employmentPeriod: "2026.6 ~ now",
    intro:
      "실제 제품과 프로젝트를 만들며 프론트엔드, 백엔드, 인프라를 연결해서 보는 개발 경험을 쌓고 있습니다.",
    experiences: [
      {
        title: "프로덕트 화면 설계와 구현",
        description:
          "서비스 요구사항을 실제 사용자 흐름에 맞는 화면으로 구체화했습니다.\n디자인 의도를 해치지 않으면서도 유지보수 가능한 컴포넌트 구조를 만드는 데 집중했습니다.",
        links: [
          {
            header: "프로젝트 링크",
            path: "https://example.com",
          },
        ],
      },
      {
        title: "프론트엔드 아키텍처 개선",
        description:
          "SSR, BFF, 상태 분리 같은 구조적 주제를 실무 안에서 계속 다뤘습니다.\n기능 추가 속도와 코드 품질이 함께 유지될 수 있는 방향을 고민했습니다.",
        links: [],
      },
      {
        title: "프로젝트 전반 협업",
        description:
          "백엔드, 인프라, 제품 요구사항을 함께 보면서 기능을 연결했습니다.\n지금은 단순 구현을 넘어서 오래 유지될 구조와 제품 경험을 함께 설계하는 개발자를 지향합니다.",
        links: [],
      },
    ],
  },
];

const meta: Meta<typeof TimeLine> = {
  title: "Feature/resume/TimeLine",
  component: TimeLine,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    items: defaultTimeLineItems,
  },
};

export default meta;

type Story = StoryObj<typeof TimeLine>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[360px] max-w-full md:w-[1040px]">
      <TimeLine {...args} />
    </div>
  ),
};
