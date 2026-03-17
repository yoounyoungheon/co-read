import type { Meta, StoryObj } from "@storybook/nextjs";
import ImageCarousel from "./image-carousel";

const sampleImages = [
  "/images/p2_1.png",
  "/images/p2_2.png",
  "/images/p2_3.png",
  "/images/p2_4.png",
  "/images/p2_5.png",
];

const meta: Meta<typeof ImageCarousel> = {
  title: "Components/ImageCarousel",
  component: ImageCarousel,
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
      description: "캐러셀에 표시할 이미지 경로 목록입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageCarousel>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[720px] max-w-full">
      <ImageCarousel {...args} />
    </div>
  ),
};

export const SingleImage: Story = {
  args: {
    images: ["/images/p2_1.png"],
  },
  render: Default.render,
};

export const ManyImages: Story = {
  args: {
    images: sampleImages,
  },
  render: Default.render,
};
