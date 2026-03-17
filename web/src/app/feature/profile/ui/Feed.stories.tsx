import type { Meta, StoryObj } from "@storybook/nextjs";
import { Feed } from "./Feed";

const placeholderImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='%23dbeafe'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f172a' font-size='44' font-family='sans-serif'>Co-Read</text></svg>";

const meta: Meta<typeof Feed> = {
  title: "Feature/profile/Feed",
  component: Feed,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    image: placeholderImage,
    projectName: "Co-Read",
    id: "co-read",
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
  },
};

export default meta;

type Story = StoryObj<typeof Feed>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[180px] max-w-full">
      <Feed {...args} />
    </div>
  ),
};

export const LongProjectName: Story = {
  args: {
    projectName: "Co-Read Portfolio Archive Platform",
  },
  render: Default.render,
};
