import type { Meta, StoryObj } from "@storybook/nextjs";
import type { Article } from "@/app/feature/article/business/article.domain";
import type { Project } from "@/app/feature/project/business/project.domain";
import {
  MainShowcasePage,
  type MainShowcasePageProps,
} from "./MainShowcasePage";
import { MainPageType } from "@/app/utils/contants";

const sampleProjects: Project[] = [
  {
    id: "co-read",
    title: "Co-Read",
    keyword: ["Next.js", "NestJS", "Vercel"],
    description: ["협업 기반 문서 독해 서비스"],
    thinks: ["공동 편집 경험 개선"],
    beTechs: ["NestJS"],
    feTechs: ["Next.js"],
    infraTechs: ["Vercel"],
    images: [
      {
        path: "/images/p2_1.png",
        description: "서비스 메인 화면",
      },
    ],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-01"),
    projectMd: "# Co-Read\n\n## 프로젝트 소개\n협업 기반 문서 독해 서비스입니다.",
    retrospectMd: "## 회고\n공동 편집 경험을 더 자연스럽게 만드는 데 집중했습니다.",
  },
  {
    id: "open-labs",
    title: "Open Labs",
    keyword: ["React", "Spring Boot", "AWS"],
    description: ["연구 프로젝트 아카이브"],
    thinks: ["탐색 경험 강화"],
    beTechs: ["Spring Boot"],
    feTechs: ["React"],
    infraTechs: ["AWS"],
    images: [
      {
        path: "/images/p2_1.png",
        description: null,
      },
    ],
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-12-31"),
    projectMd:
      "# Open Labs\n\n## 프로젝트 소개\n연구 프로젝트를 아카이빙하고 탐색하는 서비스입니다.",
    retrospectMd:
      "## 회고\n탐색 경험과 정보 구조 설계의 중요성을 많이 느꼈습니다.",
  },
  {
    id: "note-flow",
    title: "Note Flow",
    keyword: ["Next.js", "Go", "Cloud Run"],
    description: ["개인 지식 관리 도구"],
    thinks: ["모바일 입력 최적화"],
    beTechs: ["Go"],
    feTechs: ["Next.js"],
    infraTechs: ["Cloud Run"],
    images: [
      {
        path: "/images/p2_2.png",
        description: "노트 흐름 관리 화면",
      },
    ],
    startDate: new Date("2023-08-01"),
    endDate: new Date("2024-01-15"),
    projectMd:
      "# Note Flow\n\n## 프로젝트 소개\n개인 지식 관리와 메모 흐름 정리에 초점을 둔 도구입니다.",
    retrospectMd:
      "## 회고\n모바일 환경에서 입력 경험을 다듬는 과정이 가장 중요했습니다.",
  },
];

const sampleArticles: Article[] = [
  {
    id: "1",
    title: "협업 문서 독해 경험을 개선하는 UI 설계",
    description:
      "복수 사용자가 같은 문서를 함께 읽고 상호작용할 때 필요한 피드백 구조와 인터랙션 설계 원칙을 정리한 글입니다.",
    url: "https://younghun123.tistory.com/1",
  },
  {
    id: "2",
    title: "프로덕트 감각을 살리는 프론트엔드 컴포넌트 설계",
    description:
      "단순한 UI 조립을 넘어서, 화면 문맥과 제품 흐름 안에서 컴포넌트를 어떻게 나눌지에 대한 고민을 담았습니다.",
    url: "https://younghun123.tistory.com/2",
  },
  {
    id: "3",
    title: "사용자 관점에서 다시 보는 아카이브 서비스 정보 구조",
    description:
      "콘텐츠 탐색 경험을 개선하기 위해 정보 구조를 어떻게 설계하고 검증했는지 사례 중심으로 정리했습니다.",
    url: "https://younghun123.tistory.com/3",
  },
];

const meta: Meta<typeof MainShowcasePage> = {
  title: "Feature/profile/MainShowcasePage",
  component: MainShowcasePage,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    projects: sampleProjects,
    articles: sampleArticles,
    type: MainPageType.PROJECT,
  },
  argTypes: {
    projects: {
      control: "object",
      description: "type이 project일 때 표시할 프로젝트 목록입니다.",
    },
    articles: {
      control: "object",
      description:
        "type이 article 또는 playground가 아닐 때 하단 영역에 표시할 아티클 목록입니다.",
    },
    type: {
      control: "radio",
      options: [
        MainPageType.PROJECT,
        MainPageType.ARTICLE,
        MainPageType.PLAY_GROUND,
      ],
      description: "현재 활성화된 프로필 하단 카테고리 타입입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MainShowcasePage>;

const renderMainShowcasePage = (args: MainShowcasePageProps) => (
  <div className="w-[360px] max-w-full lg:w-[1200px]">
    <MainShowcasePage {...args} />
  </div>
);

export const Default: Story = {
  render: renderMainShowcasePage,
};

export const EmptyFeed: Story = {
  args: {
    projects: [],
    articles: [],
  },
  render: Default.render,
};

export const ArticleTab: Story = {
  args: {
    type: MainPageType.ARTICLE,
  },
  render: Default.render,
};

export const PlayGroundTab: Story = {
  args: {
    type: MainPageType.PLAY_GROUND,
  },
  render: Default.render,
};

export const ManyProjects: Story = {
  args: {
    projects: [
      ...sampleProjects,
      {
        id: "focus-board",
        title: "Focus Board",
        keyword: ["Vue", "FastAPI", "GCP"],
        description: ["작업 집중도 시각화 대시보드"],
        thinks: ["데이터 밀도 조절"],
        beTechs: ["FastAPI"],
        feTechs: ["Vue"],
        infraTechs: ["GCP"],
        images: [
          {
            path: "/images/p2_3.png",
            description: null,
          },
        ],
        startDate: new Date("2022-05-01"),
        endDate: new Date("2022-10-01"),
        projectMd:
          "# Focus Board\n\n## 프로젝트 소개\n작업 집중도 시각화 대시보드입니다.",
        retrospectMd:
          "## 회고\n데이터를 많이 보여주되 복잡하지 않게 만드는 게 핵심이었습니다.",
      },
      {
        id: "archive-room",
        title: "Archive Room",
        keyword: ["Kotlin", "Next.js", "AWS"],
        description: ["콘텐츠 저장 및 분류 서비스"],
        thinks: ["검색 경험 개선"],
        beTechs: ["Kotlin"],
        feTechs: ["Next.js"],
        infraTechs: ["AWS"],
        images: [
          {
            path: "/images/p2_4.png",
            description: "콘텐츠 분류 화면",
          },
        ],
        startDate: new Date("2021-02-01"),
        endDate: new Date("2021-11-01"),
        projectMd:
          "# Archive Room\n\n## 프로젝트 소개\n콘텐츠 저장과 분류에 집중한 서비스입니다.",
        retrospectMd:
          "## 회고\n검색 경험을 개선하려면 저장 구조부터 잘 설계해야 했습니다.",
      },
    ],
  },
  render: Default.render,
};

export const EmptyArticles: Story = {
  args: {
    type: MainPageType.ARTICLE,
    articles: [],
  },
  render: Default.render,
};

export const EmptyPlayGround: Story = {
  args: {
    type: MainPageType.PLAY_GROUND,
    articles: [],
  },
  render: Default.render,
};
