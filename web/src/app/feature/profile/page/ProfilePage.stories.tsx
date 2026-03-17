import type { Meta, StoryObj } from "@storybook/nextjs";
import ProfileImage from "@/app/assets/profile.png";
import type { Article } from "@/app/business/article/article.domain";
import type { Project } from "@/app/business/project/project.domain";
import { ProfilePage, type ProfilePageProps } from "./ProfilePage";

const sampleProjects: Project[] = [
  {
    id: "co-read",
    title: "Co-Read",
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
    name: "윤영헌",
    job: "🖥️ developer",
    spec: ["Dongguk Univ · scsc & biz", "Open Labs · 2025 ~"],
    intorudctiion:
      "안녕하세요! 개발자 윤영헌입니다.\n융합소프트웨어와 경영학을 전공했습니다.\n비즈니스, 기술적 관점에서 변화에 유연한 소프트웨어 설계를 고민합니다.\ne-mail: iddyoon@gmail.com",
    profileImage: ProfileImage,
    githubLink: "https://github.com/yoounyoungheon",
    blogLink: "https://younghun123.tistory.com/",
    projects: sampleProjects,
    articles: sampleArticles,
    type: "project",
  },
  argTypes: {
    name: {
      control: "text",
      description: "상단 프로필 영역에 표시할 이름입니다.",
    },
    job: {
      control: "text",
      description: "이름 아래에 표시할 역할 또는 직무입니다.",
    },
    spec: {
      control: "object",
      description: "프로필 보조 정보 목록입니다.",
    },
    intorudctiion: {
      control: "text",
      description: "줄바꿈을 포함할 수 있는 소개 문구입니다.",
    },
    profileImage: {
      control: false,
      description: "프로필 사진 이미지입니다.",
    },
    githubLink: {
      control: "text",
      description: "GitHub 링크입니다.",
    },
    blogLink: {
      control: "text",
      description: "블로그 링크입니다.",
    },
    projects: {
      control: "object",
      description: "하단 FeedGrid에 표시할 프로젝트 목록입니다.",
    },
    articles: {
      control: "object",
      description: "하단 ArticleList에 표시할 아티클 목록입니다.",
    },
    type: {
      control: "radio",
      options: ["project", "article"],
      description: "현재 활성화된 프로필 하단 카테고리 타입입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProfilePage>;

const renderProfilePage = (args: ProfilePageProps) => (
  <div className="w-full">
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

export const LongIntroduction: Story = {
  args: {
    spec: [
      "Dongguk Univ · Convergence Software",
      "Business Administration · Double Major",
      "Open Labs · Backend Engineer",
    ],
    intorudctiion:
      "사용자 경험과 제품 완성도를 함께 보는 개발을 지향합니다.\n빠르게 만드는 것보다 오래 유지되는 구조를 선호하고, 팀 안에서 문제를 명확히 정의하는 과정에도 관심이 많습니다.\n최근에는 서비스 설계와 실행 사이의 간극을 줄이는 방법을 고민하고 있습니다.",
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

export const CareerFocused: Story = {
  args: {
    name: "Youngheon Yun",
    job: "Product Engineer",
    spec: [
      "Open Labs · Product Engineer",
      "Co-Read · Frontend / Product",
      "Interest · UX, Architecture, Storytelling",
    ],
    intorudctiion:
      "문제를 구조화하고, 사용자에게 자연스럽게 보이는 인터페이스를 만드는 일에 집중합니다.\n작은 UI 조합부터 제품 흐름 전체까지 연결해서 설계하는 방식을 선호합니다.",
    githubLink: "https://github.com/yoounyoungheon",
    blogLink: "https://younghun123.tistory.com/",
    type: "article",
  },
  render: Default.render,
};
