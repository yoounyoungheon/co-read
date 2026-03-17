import type { Meta, StoryObj } from "@storybook/nextjs";
import { FlipCard } from "./flip-card";

const meta: Meta<typeof FlipCard> = {
  title: "Components/FlipCard",
  component: FlipCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    className: "h-[280px] w-[220px]",
    frontClassName: "border-none bg-white",
    backClassName: "border-none bg-slate-900 text-white",
    frontCard: (
      <div className="flex h-full flex-col justify-between p-5">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
            Front
          </p>
          <p className="text-2xl font-bold leading-tight text-slate-900">
            Co-Read
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            Hover the card to flip it with CSS only.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-500">
          Front face content
        </div>
      </div>
    ),
    backCard: (
      <div className="flex h-full flex-col justify-between p-5">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/50">
            Back
          </p>
          <p className="text-2xl font-bold leading-tight text-white">
            Additional details
          </p>
          <p className="text-sm leading-relaxed text-white/70">
            This side can render any React node passed from a server component.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
          Back face content
        </div>
      </div>
    ),
  },
  argTypes: {
    className: {
      control: "text",
      description: "카드 바깥 래퍼의 크기와 원근감을 조절하는 클래스입니다.",
    },
    innerClassName: {
      control: "text",
      description: "회전하는 내부 레이어에 적용할 추가 클래스입니다.",
    },
    frontClassName: {
      control: "text",
      description: "앞면 Card에 적용할 추가 클래스입니다.",
    },
    backClassName: {
      control: "text",
      description: "뒷면 Card에 적용할 추가 클래스입니다.",
    },
    frontCard: {
      control: false,
      description: "앞면에 렌더링할 React node입니다.",
    },
    backCard: {
      control: false,
      description: "뒷면에 렌더링할 React node입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FlipCard>;

export const Default: Story = {};

export const SoftSurface: Story = {
  args: {
    frontClassName: "border-none bg-stone-50 shadow-[0_10px_24px_rgba(15,23,42,0.12)]",
    backClassName:
      "border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]",
  },
};
