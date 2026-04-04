import type { Meta, StoryObj } from "@storybook/nextjs";
import { Project } from "@/app/feature/project/business/project.domain";
import { FeedGrid } from "./FeedGrid";

const createPlaceholderImage = (label: string, fill: string) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='${fill}'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f172a' font-size='40' font-family='sans-serif'>${label}</text></svg>`;

const sampleProjects: Project[] = [
  {
    id: "co-read",
    title: "Co-Read",
    keyword: ["Next.js", "NestJS", "Vercel"],
    images: [
      {
        path: createPlaceholderImage("Co-Read", "%23dbeafe"),
        description: "Co-Read 대표 화면",
      },
    ],
    projectMd:
      "# Co-Read\n\n## 프로젝트 소개\n협업 기반 문서 독해 서비스입니다.",
    retrospectMd:
      "## 회고\n공동 편집 경험을 더 자연스럽게 만드는 데 집중했습니다.",
  },
  {
    id: "open-labs",
    title: "Open Labs",
    keyword: ["React", "Spring Boot", "AWS"],
    images: [
      {
        path: createPlaceholderImage("Open Labs", "%23fde68a"),
        description: null,
      },
    ],
    projectMd:
      "# Open Labs\n\n## 프로젝트 소개\n연구 프로젝트를 아카이빙하고 탐색하는 서비스입니다.",
    retrospectMd:
      "## 회고\n탐색 경험과 정보 구조 설계의 중요성을 많이 느꼈습니다.",
  },
  {
    id: "note-flow",
    title: "Note Flow",
    keyword: ["Next.js", "Go", "Cloud Run"],
    images: [
      {
        path: createPlaceholderImage("Note Flow", "%23bfdbfe"),
        description: "Note Flow 대표 화면",
      },
    ],
    projectMd:
      "# Note Flow\n\n## 프로젝트 소개\n개인 지식 관리와 메모 흐름 정리에 초점을 둔 도구입니다.",
    retrospectMd:
      "## 회고\n모바일 환경에서 입력 경험을 다듬는 과정이 가장 중요했습니다.",
  },
  {
    id: "focus-board",
    title: "Focus Board",
    keyword: ["Vue", "FastAPI", "GCP"],
    images: [
      {
        path: createPlaceholderImage("Focus Board", "%23fecaca"),
        description: null,
      },
    ],
    projectMd:
      "# Focus Board\n\n## 프로젝트 소개\n작업 집중도 시각화 대시보드입니다.",
    retrospectMd:
      "## 회고\n데이터를 많이 보여주되 복잡하지 않게 만드는 게 핵심이었습니다.",
  },
];

const meta: Meta<typeof FeedGrid> = {
  title: "Feature/project/FeedGrid",
  component: FeedGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    projects: sampleProjects,
  },
  argTypes: {
    projects: {
      control: "object",
      description: "그리드에 표시할 프로젝트 목록입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeedGrid>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[320px] max-w-full md:w-[960px]">
      <FeedGrid {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    projects: [],
  },
  render: Default.render,
};
