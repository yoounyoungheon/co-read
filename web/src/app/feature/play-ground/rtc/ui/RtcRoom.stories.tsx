import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { RtcRoomView, type RtcRoomState } from "./RtcRoom";

const meta: Meta<typeof RtcRoomView> = {
  title: "Feature/play-ground/rtc/RtcRoom",
  component: RtcRoomView,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    roomId: {
      control: "text",
    },
  },
  args: {
    roomId: "demo-room",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type MockRtcRoomPreviewProps = {
  roomId: string;
  remoteCount: number;
};

type CreatedStream = {
  stream: MediaStream;
  dispose: () => void;
};

function createMockStream(label: string, hue: number): CreatedStream | null {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;

  const context = canvas.getContext("2d");

  if (!context || typeof canvas.captureStream !== "function") {
    return null;
  }

  let frame = 0;

  const drawFrame = () => {
    frame += 1;

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `hsl(${hue} 68% 18%)`);
    gradient.addColorStop(0.55, `hsl(${(hue + 28) % 360} 75% 42%)`);
    gradient.addColorStop(1, `hsl(${(hue + 64) % 360} 72% 58%)`);

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(255, 255, 255, 0.12)";
    context.beginPath();
    context.arc(240, 180, 120, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(1080, 540, 190, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "700 54px sans-serif";
    context.fillText(label, 64, 110);

    context.font = "400 30px sans-serif";
    context.fillText("Mock RTC stream preview", 64, 156);

    context.fillStyle = "rgba(15, 23, 42, 0.9)";
    context.fillRect(64, 230, 280, 152);

    context.fillStyle = "#22c55e";
    context.beginPath();
    context.arc(112 + ((frame * 7) % 190), 306, 13, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#e2e8f0";
    context.fillRect(144, 295, 150, 22);
  };

  drawFrame();

  const interval = window.setInterval(drawFrame, 120);
  const stream = canvas.captureStream(12);

  return {
    stream,
    dispose: () => {
      window.clearInterval(interval);
      stream.getTracks().forEach((track) => track.stop());
    },
  };
}

function MockRtcRoomPreview({
  roomId,
  remoteCount,
}: MockRtcRoomPreviewProps) {
  const [rtcState, setRtcState] = useState<RtcRoomState | null>(null);

  useEffect(() => {
    const local = createMockStream("Local Stream", 214);
    const remotes = Array.from({ length: remoteCount }, (_, index) =>
      createMockStream(`Remote ${index + 1}`, (index * 48 + 24) % 360),
    ).filter((item): item is CreatedStream => item !== null);

    setRtcState({
      localStream: local?.stream ?? null,
      remoteStreams: remotes.map(({ stream }) => stream),
      startStream: () => undefined,
      startScreenStream: () => undefined,
    });

    return () => {
      local?.dispose();
      remotes.forEach(({ dispose }) => dispose());
    };
  }, [remoteCount]);

  if (!rtcState) {
    return (
      <div className="w-[1100px] max-w-[96vw] rounded-3xl border border-slate-200 bg-white p-6">
        <RtcRoomView
          roomId={roomId}
          rtcState={{
            localStream: null,
            remoteStreams: [],
            startStream: () => undefined,
            startScreenStream: () => undefined,
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-[1100px] max-w-[96vw] rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <RtcRoomView roomId={roomId} rtcState={rtcState} />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <MockRtcRoomPreview roomId={args.roomId} remoteCount={3} />,
};

export const Empty: Story = {
  render: (args) => (
    <div className="w-[1100px] max-w-[96vw] rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <RtcRoomView
        roomId={args.roomId}
        rtcState={{
          localStream: null,
          remoteStreams: [],
          startStream: () => undefined,
          startScreenStream: () => undefined,
        }}
      />
    </div>
  ),
};

export const Overflow: Story = {
  render: (args) => <MockRtcRoomPreview roomId={args.roomId} remoteCount={6} />,
};
