import type { Meta, StoryObj } from "@storybook/nextjs";
import { RtcShareLinkButton } from "./RtcShareLinkButton";

const meta: Meta<typeof RtcShareLinkButton> = {
  title: "Feature/play-ground/rtc/RtcShareLinkButton",
  component: RtcShareLinkButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
