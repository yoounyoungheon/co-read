import type { Meta, StoryObj } from "@storybook/nextjs";
import Log from "./Log";

const meta: Meta<typeof Log> = {
  title: "Feature/play-ground/logs/Log",
  component: Log,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    content: {
      control: "text",
    },
  },
  args: {
    content:
      "[SCM] 01/20 fetching repository metadata...\n[SCM] 02/20 fetching repository metadata...\n[BUILD] 01/20 compiling application modules...\n[DEPLOY] 01/20 rolling out release bundle...\n",
  },
};

export default meta;

type Story = StoryObj<typeof Log>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[720px] max-w-[95vw]">
      <Log {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    content: "",
  },
  render: (args) => (
    <div className="w-[720px] max-w-[95vw]">
      <Log {...args} />
    </div>
  ),
};
