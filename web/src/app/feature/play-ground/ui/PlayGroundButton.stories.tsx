import type { Meta, StoryObj } from "@storybook/nextjs";
import PlayGroundButton from "./PlayGroundButton";

const meta: Meta<typeof PlayGroundButton> = {
  title: "Feature/play-ground/PlayGroundButton",
  component: PlayGroundButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    type: "REAL TIME",
    description: "실시간 인터랙션을 확인할 수 있는 플레이그라운드입니다.",
    path: "/play-ground/real-time",
    itemId: "play-ground-story-item",
  },
};

export default meta;

type Story = StoryObj<typeof PlayGroundButton>;

export const Default: Story = {
  render: (args) => (
    <div className="h-[360px] w-[360px] rounded-2xl border border-slate-200 bg-white p-4">
      <input
        id="play-ground-empty"
        type="radio"
        name="play-ground-type"
        className="sr-only"
        defaultChecked
      />
      <PlayGroundButton {...args} />
    </div>
  ),
};
