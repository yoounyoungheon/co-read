import { type ReactNode, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import StreamCard from "./StreamCard";

const meta: Meta<typeof StreamCard> = {
  title: "Feature/play-ground/rtc/StreamCard",
  component: StreamCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: {
      control: "text",
    },
    muted: {
      control: "boolean",
    },
    mirror: {
      control: "boolean",
    },
    emptyLabel: {
      control: "text",
    },
    stream: {
      control: false,
    },
  },
  args: {
    name: "김민수",
    muted: true,
    mirror: false,
    emptyLabel: "스트림을 기다리는 중입니다.",
  },
};

export default meta;

type Story = StoryObj<typeof StreamCard>;

function MockStreamCard(args: React.ComponentProps<typeof StreamCard>) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;

    const context = canvas.getContext("2d");

    if (!context || typeof canvas.captureStream !== "function") {
      return;
    }

    let frame = 0;

    const drawFrame = () => {
      frame += 1;

      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#1d4ed8");
      gradient.addColorStop(1, "#14b8a6");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "rgba(255,255,255,0.12)";
      context.beginPath();
      context.arc(260, 220, 150, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "rgba(255,255,255,0.18)";
      context.beginPath();
      context.arc(980, 500, 220, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = "700 52px sans-serif";
      context.fillText("RTC Preview", 64, 108);

      context.font = "400 30px sans-serif";
      context.fillText("Mock media stream for Storybook", 64, 156);

      context.fillStyle = "#f8fafc";
      context.fillRect(64, 220, 260, 146);

      context.fillStyle = "#0f172a";
      context.fillRect(94, 250, 200, 86);

      context.fillStyle = "#22c55e";
      context.beginPath();
      context.arc(114 + ((frame * 6) % 160), 293, 12, 0, Math.PI * 2);
      context.fill();
    };

    drawFrame();

    const interval = window.setInterval(drawFrame, 120);
    const mockStream = canvas.captureStream(12);

    setStream(mockStream);

    return () => {
      window.clearInterval(interval);
      mockStream.getTracks().forEach((track) => track.stop());
      setStream(null);
    };
  }, []);

  return <StreamCard {...args} stream={stream} />;
}

function renderFrame(content: ReactNode) {
  return <div className="w-[720px] max-w-[95vw]">{content}</div>;
}

export const Default: Story = {
  render: (args) => renderFrame(<MockStreamCard {...args} />),
};

export const Waiting: Story = {
  args: {
    stream: null,
  },
  render: (args) => renderFrame(<StreamCard {...args} />),
};

export const Mirrored: Story = {
  args: {
    mirror: true,
  },
  render: (args) => renderFrame(<MockStreamCard {...args} />),
};

export const MutedPreview: Story = {
  args: {
    muted: false,
  },
  render: (args) => renderFrame(<MockStreamCard {...args} />),
};
