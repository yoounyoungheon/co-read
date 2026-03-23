import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProjectImageList } from "./ProjectImageList";

const sampleImages = [
  { path: "/images/p2_1.png", description: "프로젝트 메인 화면" },
  { path: "/images/p2_2.png", description: "서비스 상세 흐름 화면" },
  { path: "/images/p2_3.png", description: "기능 소개 화면" },
  { path: "/images/p2_4.png", description: "사용자 여정 화면" },
  { path: "/images/p2_5.png", description: "운영 관리 화면" },
  { path: "/images/p2_6.png", description: "추가 기능 미리보기" },
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
      description: "가로 리스트로 표시할 프로젝트 이미지 목록입니다.",
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
      { path: "/images/p2_7.png", description: "추가 상세 화면 1" },
      { path: "/images/p2_8.png", description: "추가 상세 화면 2" },
      { path: "/images/p2_9.png", description: "추가 상세 화면 3" },
      { path: "/images/p2_10.png", description: "추가 상세 화면 4" },
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
