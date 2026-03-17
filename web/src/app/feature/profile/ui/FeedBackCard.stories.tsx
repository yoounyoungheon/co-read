import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card } from "@/app/shared/ui/molecule/card";
import { FeedBackCard } from "./FeedBackCard";

const meta: Meta<typeof FeedBackCard> = {
  title: "Feature/profile/FeedBackCard",
  component: FeedBackCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    projectName: "Co-Read",
    id: "co-read",
    href: "/project?id=co-read",
    keyword: ["Next.js", "NestJS", "Vercel"],
  },
  argTypes: {
    projectName: {
      control: "text",
      description: "뒷면 카드에 표시할 프로젝트 이름입니다.",
    },
    id: {
      control: "text",
      description: "프로젝트 식별자입니다.",
    },
    href: {
      control: "text",
      description: "우측 하단 액션 버튼 클릭 시 이동할 경로입니다.",
    },
    keyword: {
      control: "object",
      description: "설명 영역에 배지 형태로 표시할 키워드 목록입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeedBackCard>;

export const Default: Story = {
  render: (args) => (
    <Card className="h-[300px] w-[250px] rounded-2xl border-none bg-slate-900 text-left text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
      <FeedBackCard {...args} />
    </Card>
  ),
};

export const LongProjectName: Story = {
  args: {
    projectName: "Co-Read Portfolio Archive Platform",
    id: "co-read-portfolio-archive",
    keyword: ["React", "TypeScript", "Design System", "Storybook"],
  },
  render: Default.render,
};
