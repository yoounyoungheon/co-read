import type { Meta, StoryObj } from "@storybook/nextjs";
import BuildUI from "./BuildUI";

const meta: Meta<typeof BuildUI> = {
  title: "Feature/play-ground/logs/BuildUI",
  component: BuildUI,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof BuildUI>;

export const Default: Story = {
  render: () => (
    <div className="w-[960px] max-w-[96vw] rounded-3xl bg-slate-50 p-6">
      <BuildUI />
    </div>
  ),
};
