import type { Meta, StoryObj } from "@storybook/nextjs";
import TimeLine, { defaultTimeLineItems } from "./TimeLine";

const meta: Meta<typeof TimeLine> = {
  title: "Feature/profile/TimeLine",
  component: TimeLine,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    items: defaultTimeLineItems,
  },
};

export default meta;

type Story = StoryObj<typeof TimeLine>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[360px] max-w-full md:w-[1040px]">
      <TimeLine {...args} />
    </div>
  ),
};
