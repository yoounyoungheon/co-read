"use client";

import { useEffect, useRef } from "react";
import Button from "@/app/shared/ui/atom/button";
import { useRtc } from "@/app/shared/rtc/useRtc";
import StreamCard from "./StreamCard";
import { RtcShareLinkButton } from "./RtcShareLinkButton";

export interface RtcRoomState {
  localStream: MediaStream | null;
  remoteStreams: MediaStream[];
  startStream: () => void | Promise<void>;
  startScreenStream: () => void | Promise<void>;
  stopRtc: () => void;
}

export interface RtcRoomProps {
  roomId: string;
}

function createRtcKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `rtc-${Math.random().toString(36).slice(2, 10)}`;
}

export function RtcRoomView({
  roomId,
  rtcState,
}: RtcRoomProps & { rtcState: RtcRoomState }) {
  const { localStream, remoteStreams, startScreenStream } = rtcState;
  return (
    <section className="flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Web RTC Room
            </p>
            <h2 className="text-xl font-semibold text-slate-900">{roomId}</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              htmlType="button"
              type="cancel"
              variant="outline"
              onClick={() => void startScreenStream()}
              disabled={!localStream}
            >
              화면 공유
            </Button>
            <RtcShareLinkButton />
          </div>
        </div>

        <StreamCard
          stream={localStream}
          name="나"
          muted
          mirror
          emptyLabel="카메라와 마이크 연결을 준비하는 중입니다."
          className="min-h-[320px]"
        />
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Remote Streams
            </p>
            <p className="mt-1 text-sm text-slate-600">
              연결된 상대 스트림을 가로 리스트로 표시합니다.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            {remoteStreams.length}명 연결
          </span>
        </div>

        {remoteStreams.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {remoteStreams.map((stream, index) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                name={`Remote ${index + 1}`}
                aspectRatio="square"
                className="w-[320px] shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500">
            아직 연결된 remote stream 이 없습니다.
          </div>
        )}
      </section>
    </section>
  );
}

export default function RtcRoom({ roomId }: RtcRoomProps) {
  const myKeyRef = useRef(createRtcKey());
  const rtcState = useRtc({
    roomId,
    myKey: myKeyRef.current,
  });
  const { startStream, localStream } = rtcState;
  const latestRtcStateRef = useRef(rtcState);

  latestRtcStateRef.current = rtcState;

  useEffect(() => {
    void startStream();
  }, [startStream]);

  useEffect(() => {
    if (!localStream) {
      return;
    }

    return () => {
      localStream.getTracks().forEach((track) => track.stop());
    };
  }, [localStream]);

  useEffect(() => {
    const cleanupLocalMedia = () => {
      latestRtcStateRef.current.localStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };

    const handlePageHide = () => {
      cleanupLocalMedia();
      latestRtcStateRef.current.stopRtc();
    };

    const handleBeforeUnload = () => {
      cleanupLocalMedia();
      latestRtcStateRef.current.stopRtc();
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanupLocalMedia();
      latestRtcStateRef.current.remoteStreams.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
      latestRtcStateRef.current.stopRtc();
    };
  }, []);

  return <RtcRoomView roomId={roomId} rtcState={rtcState} />;
}
