import type { Meta, StoryObj } from "@storybook/nextjs";
import type { Article } from "@/app/feature/article/business/article.domain";
import type { Project } from "@/app/feature/project/business/project.domain";
import { ProfilePage, type ProfilePageProps } from "./ProfilePage";
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
    images: ["/images/p2_1.png"],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-01"),
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
    images: ["/images/p2_1.png"],
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-12-31"),
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
    images: ["/images/p2_1.png"],
    startDate: new Date("2023-08-01"),
    endDate: new Date("2024-01-15"),
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

const meta: Meta<typeof ProfilePage> = {
  title: "Feature/profile/ProfilePage",
  component: ProfilePage,
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

type Story = StoryObj<typeof ProfilePage>;

const renderProfilePage = (args: ProfilePageProps) => (
  <div className="w-[360px] max-w-full lg:w-[1200px]">
    <ProfilePage {...args} />
  </div>
);

export const Default: Story = {
  render: renderProfilePage,
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
        images: ["/images/p2_1.png"],
        startDate: new Date("2022-05-01"),
        endDate: new Date("2022-10-01"),
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
        images: ["/images/p2_1.png"],
        startDate: new Date("2021-02-01"),
        endDate: new Date("2021-11-01"),
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
