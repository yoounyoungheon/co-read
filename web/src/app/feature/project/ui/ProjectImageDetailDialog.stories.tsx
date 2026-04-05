import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProjectImageDetailDialog } from "./ProjectImageDetailDialog";

const meta: Meta<typeof ProjectImageDetailDialog> = {
  title: "Feature/project/ProjectImageDetailDialog",
  component: ProjectImageDetailDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: true,
    onOpenChange: () => {},
    image: {
      src: "/images/p2_1.png",
      description: "프로젝트 메인 화면 설명이 전체화면 상단에 표시되는 상태예요.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectImageDetailDialog>;

export const Default: Story = {};

export const WithoutDescription: Story = {
  args: {
    image: {
      src: "/images/p2_2.png",
      description: null,
    },
  },
};
