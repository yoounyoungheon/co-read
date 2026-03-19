import type { Meta, StoryObj } from "@storybook/nextjs";
import PlayGround from "./PlayGround";

const meta: Meta<typeof PlayGround> = {
  title: "Feature/play-ground/PlayGround",
  component: PlayGround,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    types: {
      control: "object",
    },
  },
  args: {
    types: [
      { type: "REAL TIME", path: "/play-ground/real-time" },
      { type: "CSS ONLY", path: "/play-ground/css-only" },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof PlayGround>;

export const Default: Story = {
  render: (args) => (
    <div className="h-[360px] w-[360px] rounded-2xl border border-slate-200 bg-white p-4">
      <PlayGround {...args} />
    </div>
  ),
};
