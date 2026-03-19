import type { Meta, StoryObj } from "@storybook/nextjs";
import { ChatLog } from "./ChatLog";
import { WineRecommendView } from "./WineRecommendView";

const meta: Meta<typeof ChatLog> = {
  title: "Feature/chat/ChatLog",
  component: ChatLog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    chats: { control: "object" },
  },
  args: {
    chats: [
      {
        chatId: "1",
        message: "안녕 너의 이름은 뭐야?",
        time: new Date().toISOString(),
        isMine: true,
      },
      {
        chatId: "2",
        message: "안녕하세요! 저는 윤영헌입니다. 개발자에요 ^_^ ~",
        time: new Date().toISOString(),
        isMine: false,
        infoPanel: <WineRecommendView />,
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof ChatLog>;

export const Default: Story = {
  render: (args) => (
    <div className="h-[420px] w-[360px] rounded-xl border border-slate-200 bg-white">
      <ChatLog {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    chats: [],
  },
  render: Default.render,
};
