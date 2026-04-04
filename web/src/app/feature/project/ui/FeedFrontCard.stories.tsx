import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card } from "@/app/shared/ui/molecule/card";
import { FeedFrontCard } from "./FeedFrontCard";

const meta: Meta<typeof FeedFrontCard> = {
  title: "Feature/project/FeedFrontCard",
  component: FeedFrontCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    image: "/images/p2_1.png",
    projectName: "Co-Read",
    href: "/project?id=co-read",
  },
  argTypes: {
    image: {
      control: "text",
      description: "앞면 카드에 표시할 대표 이미지 URL입니다.",
    },
    projectName: {
      control: "text",
      description: "앞면 카드에 표시할 프로젝트 이름입니다.",
    },
    href: {
      control: "text",
      description: "우측 상단 액션 버튼 클릭 시 이동할 경로입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeedFrontCard>;

export const Default: Story = {
  render: (args) => (
    <Card className="h-[300px] w-[250px] rounded-2xl border-none bg-white text-left shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
      <FeedFrontCard {...args} />
    </Card>
  ),
};

export const LongProjectName: Story = {
  args: {
    projectName: "Co-Read Portfolio Archive Platform",
  },
  render: Default.render,
};
