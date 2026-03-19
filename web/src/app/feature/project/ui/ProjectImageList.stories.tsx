import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProjectImageList } from "./ProjectImageList";

const sampleImages = [
  "/images/p2_1.png",
  "/images/p2_2.png",
  "/images/p2_3.png",
  "/images/p2_4.png",
  "/images/p2_5.png",
  "/images/p2_6.png",
];

const meta: Meta<typeof ProjectImageList> = {
  title: "Feature/project/ProjectImageList",
  component: ProjectImageList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    images: sampleImages,
  },
  argTypes: {
    images: {
      control: "object",
      description: "가로 리스트로 표시할 프로젝트 이미지 경로 목록입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectImageList>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[720px] max-w-full">
      <ProjectImageList {...args} />
    </div>
  ),
};

export const ManyImages: Story = {
  args: {
    images: [
      ...sampleImages,
      "/images/p2_7.png",
      "/images/p2_8.png",
      "/images/p2_9.png",
      "/images/p2_10.png",
    ],
  },
  render: Default.render,
};

export const Empty: Story = {
  args: {
    images: [],
  },
  render: Default.render,
};
