import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ArticleCardViewModel } from "@/app/feature/article/presentation/article.view-model";
import type { ProjectCardViewModel } from "@/app/feature/project/presentation/project.view-model";
import {
  MainShowcasePage,
  type MainShowcasePageProps,
} from "./MainShowcasePage";
import { MainPageType } from "@/app/utils/contants";
import { defaultTimeLineItems } from "../../resume/ui/TimeLine.stories";

const sampleProjects: ProjectCardViewModel[] = [
  {
    id: "co-read",
    title: "Co-Read",
    keyword: ["Next.js", "NestJS", "Vercel"],
    href: "/project?id=co-read",
    imageSrc: "/images/p2_1.png",
  },
  {
    id: "open-labs",
    title: "Open Labs",
    keyword: ["React", "Spring Boot", "AWS"],
    href: "/project?id=open-labs",
    imageSrc: "/images/p2_1.png",
  },
  {
    id: "note-flow",
    title: "Note Flow",
    keyword: ["Next.js", "Go", "Cloud Run"],
    href: "/project?id=note-flow",
    imageSrc: "/images/p2_2.png",
  },
];

const sampleArticles: ArticleCardViewModel[] = [
  {
    id: "1",
    title: "협업 문서 독해 경험을 개선하는 UI 설계",
    description:
      "복수 사용자가 같은 문서를 함께 읽고 상호작용할 때 필요한 피드백 구조와 인터랙션 설계 원칙을 정리한 글입니다.",
    url: "https://younghun123.tistory.com/1",
    hostname: "younghun123.tistory.com",
  },
  {
    id: "2",
    title: "프로덕트 감각을 살리는 프론트엔드 컴포넌트 설계",
    description:
      "단순한 UI 조립을 넘어서, 화면 문맥과 제품 흐름 안에서 컴포넌트를 어떻게 나눌지에 대한 고민을 담았습니다.",
    url: "https://younghun123.tistory.com/2",
    hostname: "younghun123.tistory.com",
  },
  {
    id: "3",
    title: "사용자 관점에서 다시 보는 아카이브 서비스 정보 구조",
    description:
      "콘텐츠 탐색 경험을 개선하기 위해 정보 구조를 어떻게 설계하고 검증했는지 사례 중심으로 정리했습니다.",
    url: "https://younghun123.tistory.com/3",
    hostname: "younghun123.tistory.com",
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
    timeLineItems: defaultTimeLineItems,
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
          href: "/project?id=focus-board",
          imageSrc: "/images/p2_3.png",
        },
        {
          id: "archive-room",
          title: "Archive Room",
          keyword: ["Kotlin", "Next.js", "AWS"],
          href: "/project?id=archive-room",
          imageSrc: "/images/p2_4.png",
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
