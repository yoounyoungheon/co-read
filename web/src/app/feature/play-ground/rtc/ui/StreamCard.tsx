"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/app/utils/style/helper";

export interface StreamCardProps {
  stream: MediaStream | null;
  name: string;
  className?: string;
  muted?: boolean;
  mirror?: boolean;
  emptyLabel?: string;
  aspectRatio?: "video" | "square";
}

export default function StreamCard({
  stream,
  name,
  className,
  muted = false,
  mirror = false,
  emptyLabel = "스트림을 기다리는 중입니다.",
  aspectRatio = "video",
}: StreamCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (videoElement.srcObject !== stream) {
      videoElement.srcObject = stream;
    }

    if (!stream) {
      videoElement.pause();
      videoElement.srcObject = null;
      return;
    }

    const playMedia = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("스트림 재생에 실패했습니다:", error);
      }
    };

    void playMedia();

    return () => {
      if (videoElement.srcObject === stream) {
        videoElement.pause();
        videoElement.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm",
        aspectRatio === "square" ? "aspect-square" : "aspect-video",
        className,
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={cn(
          "h-full w-full object-cover",
          mirror && "-scale-x-100",
          !stream && "invisible",
        )}
      />

      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_72%)] px-6 text-center text-sm text-slate-300">
          {emptyLabel}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-10">
        <span className="inline-flex max-w-full rounded-full border border-white/10 bg-black/40 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          <span className="truncate">{name}</span>
        </span>
      </div>
    </section>
  );
}
