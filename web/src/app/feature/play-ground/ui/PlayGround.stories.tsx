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
      {
        type: "REAL TIME",
        description: "실시간 인터랙션을 확인할 수 있는 플레이그라운드입니다.",
        path: "/play-ground/real-time",
      },
      {
        type: "CSS ONLY",
        description: "CSS 중심의 인터랙션을 확인할 수 있는 플레이그라운드입니다.",
        path: "/play-ground/css-only",
      },
      {
        type: "code gen stream",
        description:
          "코드 생성 진행 상태를 스트리밍으로 확인할 수 있는 플레이그라운드입니다.",
        path: "/play-ground?type=CODE_GEN_STREAM",
      },
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
