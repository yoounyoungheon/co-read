import type { Meta, StoryObj } from "@storybook/nextjs";
import { FeedCard } from "./FeedCard";

const meta: Meta<typeof FeedCard> = {
  title: "Feature/profile/FeedCard",
  component: FeedCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    image: "/images/p2_1.png",
    projectName: "Co-Read",
    id: "co-read",
    href: "/project?id=co-read",
    keyword: ["Next.js", "NestJS", "Vercel"],
  },
  argTypes: {
    image: {
      control: "text",
      description: "피드 카드에 표시할 대표 이미지 URL입니다.",
    },
    projectName: {
      control: "text",
      description: "카드 중앙에 표시할 프로젝트 이름입니다.",
    },
    id: {
      control: "text",
      description: "프로젝트 상세 페이지 이동에 사용하는 식별자입니다.",
    },
    href: {
      control: "text",
      description:
        "카드 클릭 시 이동할 경로입니다. 비워두면 id 기반 기본 경로를 사용합니다.",
    },
    keyword: {
      control: "object",
      description: "카드 뒷면에 배지 형태로 표시할 키워드 목록입니다.",
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
    projectName: "Co-Read Portfolio Archive Platform",
    keyword: ["React", "TypeScript", "Design System", "Storybook"],
  },
  render: Default.render,
};
