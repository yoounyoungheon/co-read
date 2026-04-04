import type { Meta, StoryObj } from "@storybook/nextjs";
import BuildStartButton from "./BuildStartButton";

const meta: Meta<typeof BuildStartButton> = {
  title: "Feature/play-ground/logs/BuildStartButton",
  component: BuildStartButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["success", "error", "inprogress"],
    },
    onStart: {
      action: "start",
    },
  },
  args: {
    type: "success",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof BuildStartButton>;

export const Default: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <BuildStartButton {...args} type="success" />
      <BuildStartButton {...args} type="error" />
      <BuildStartButton {...args} type="inprogress" />
    </div>
  ),
};
