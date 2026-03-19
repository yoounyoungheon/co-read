import type { Meta, StoryObj } from "@storybook/nextjs";
import { SendMessageForm } from "./SendMessageForm";

const meta: Meta<typeof SendMessageForm> = {
  title: "Feature/chat/SendMessageForm",
  component: SendMessageForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: { control: "text" },
    onSend: { action: "send" },
  },
  args: {
    placeholder: "메시지를 입력하세요...",
  },
};

export default meta;

type Story = StoryObj<typeof SendMessageForm>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[360px]">
      <SendMessageForm {...args} />
    </div>
  ),
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "메세지를 입력하세요...",
  },
  render: Default.render,
};
