import type { Meta, StoryObj } from "@storybook/nextjs";
import type { Project } from "@/app/business/project/project.domain";
import { FeedCard } from "./FeedCard";

const sampleProject: Project = {
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
};

const meta: Meta<typeof FeedCard> = {
  title: "Feature/profile/FeedCard",
  component: FeedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    project: sampleProject,
    href: "/project?id=co-read",
  },
  argTypes: {
    project: {
      control: "object",
      description: "카드에 표시할 프로젝트 도메인 데이터입니다.",
    },
    href: {
      control: "text",
      description:
        "카드 클릭 시 이동할 경로입니다. 비워두면 id 기반 기본 경로를 사용합니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeedCard>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[220px] max-w-full">
      <FeedCard {...args} />
    </div>
  ),
};

export const LongProjectName: Story = {
  args: {
    project: {
      ...sampleProject,
      title: "Co-Read Portfolio Archive Platform",
      keyword: ["React", "TypeScript", "Design System", "Storybook"],
    },
  },
  render: Default.render,
};
