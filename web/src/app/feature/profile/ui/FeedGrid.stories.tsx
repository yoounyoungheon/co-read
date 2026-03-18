import type { Meta, StoryObj } from "@storybook/nextjs";
import { Project } from "@/app/business/project/project.domain";
import { FeedGrid } from "./FeedGrid";

const createPlaceholderImage = (label: string, fill: string) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='${fill}'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f172a' font-size='40' font-family='sans-serif'>${label}</text></svg>`;

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
    images: [createPlaceholderImage("Co-Read", "%23dbeafe")],
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
    images: [createPlaceholderImage("Open Labs", "%23fde68a")],
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
    images: [createPlaceholderImage("Note Flow", "%23bfdbfe")],
    startDate: new Date("2023-08-01"),
    endDate: new Date("2024-01-15"),
  },
  {
    id: "focus-board",
    title: "Focus Board",
    keyword: ["Vue", "FastAPI", "GCP"],
    description: ["작업 집중도 시각화 대시보드"],
    thinks: ["데이터 밀도 조절"],
    beTechs: ["FastAPI"],
    feTechs: ["Vue"],
    infraTechs: ["GCP"],
    images: [createPlaceholderImage("Focus Board", "%23fecaca")],
    startDate: new Date("2022-05-01"),
    endDate: new Date("2022-10-01"),
  },
];

const meta: Meta<typeof FeedGrid> = {
  title: "Feature/profile/FeedGrid",
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
