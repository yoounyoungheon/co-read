"use client";

import * as ReactToast from "@radix-ui/react-toast";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SSEProvider } from "@/app/shared/sse/business/context/sseContext";
import { useSSE } from "@/app/shared/sse/business/hook/useSSE";
import BuildStartButton, { BuildStartType } from "./BuildStartButton";
import Log from "./Log";

type BuildStage = "SCM" | "BUILD" | "DEPLOY";

type ProgressEventPayload = {
  type: BuildStage;
  delta: string;
  length: number;
};

type EndEventPayload = {
  success: boolean;
  message: string;
};

type ToastState = {
  open: boolean;
  title: string;
  description?: string;
};

const initialToastState: ToastState = {
  open: false,
  title: "",
  description: undefined,
};

const appendLogChunk = (previousLog: string, payload: ProgressEventPayload) => {
  const nextExpectedLength = previousLog.length + payload.delta.length;

  if (payload.length === nextExpectedLength) {
    return previousLog + payload.delta;
  }

  const chunkStartIndex = Math.max(0, payload.length - payload.delta.length);

  if (previousLog.length >= chunkStartIndex) {
    const safeDeltaStart = Math.min(
      payload.delta.length,
      previousLog.length - chunkStartIndex,
    );

    return previousLog + payload.delta.slice(safeDeltaStart);
  }

  return previousLog + payload.delta;
};

const BuildUIContent = () => {
  const { open, close, sseState } = useSSE();
  const [log, setLog] = useState("");
  const [toastState, setToastState] = useState<ToastState>(initialToastState);
  const activeStageRef = useRef<BuildStage | null>(null);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const isStreaming = sseState === "CONNECTING" || sseState === "OPEN";

  const showToast = useCallback((title: string, description?: string) => {
    setToastState({
      open: true,
      title,
      description,
    });
  }, []);

  const startBuild = useCallback(
    (type: BuildStartType) => {
      const state =
        type === "inprogress"
          ? "progess"
          : type === "error"
            ? "error"
            : "success";

      close();
      setLog("");
      activeStageRef.current = null;

      open(`/api/streaming/log?state=${state}`, [
        {
          eventName: "start",
          handle: () => {
            showToast(
              "빌드를 시작했어요.",
              "서버에서 빌드 로그를 전송하고 있습니다.",
            );
          },
        },
        {
          eventName: "progress",
          handle: (event) => {
            let payload: ProgressEventPayload;

            try {
              payload = JSON.parse(event.data) as ProgressEventPayload;
            } catch {
              return;
            }

            if (activeStageRef.current !== payload.type) {
              activeStageRef.current = payload.type;
              showToast(
                `${payload.type} 단계를 시작했어요.`,
                `${payload.type} 로그를 이어서 수신하고 있습니다.`,
              );
            }

            setLog((previousLog) => appendLogChunk(previousLog, payload));
          },
        },
        {
          eventName: "end",
          handle: (event) => {
            let payload: EndEventPayload;

            try {
              payload = JSON.parse(event.data) as EndEventPayload;
            } catch {
              close();
              return;
            }

            showToast(
              payload.success ? "빌드가 완료됐어요." : "빌드가 실패했어요.",
              payload.message,
            );
            close();
          },
        },
      ]);
    },
    [close, open, showToast],
  );

  useEffect(() => () => close(), [close]);

  useLayoutEffect(() => {
    const scrollTarget = logContainerRef.current?.querySelector("pre");

    if (!(scrollTarget instanceof HTMLElement)) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      scrollTarget.scrollTop = scrollTarget.scrollHeight;
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [log]);

  return (
    <ReactToast.Provider swipeDirection="right">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                LOG Streaming UI
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                Build Pipeline Monitor
              </h2>
              <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                {
                  "버튼을 누르면 빌드 로그가 SSE로 스트리밍됩니다.\n현재 연결 상태:"
                }
                <span className="ml-1 font-semibold text-slate-900">
                  {sseState}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BuildStartButton
                type="success"
                onStart={startBuild}
                disabled={isStreaming}
              />
              <BuildStartButton
                type="error"
                onStart={startBuild}
                disabled={isStreaming}
              />
              <BuildStartButton
                type="inprogress"
                onStart={startBuild}
                disabled={isStreaming}
              />
            </div>
          </div>
        </section>

        <div
          ref={logContainerRef}
          className="[&_pre]:min-h-0 [&_pre]:flex-1 [&_pre]:[scrollbar-color:rgb(71_85_105)_rgb(15_23_42)] [&_pre::-webkit-scrollbar-thumb]:rounded-full [&_pre::-webkit-scrollbar-thumb]:bg-slate-600 [&_pre::-webkit-scrollbar-track]:bg-slate-900 [&_pre::-webkit-scrollbar]:h-2 [&_pre::-webkit-scrollbar]:w-2 [&_section]:h-[420px]"
        >
          <Log content={log} />
        </div>
      </div>

      <ReactToast.Root
        open={toastState.open}
        onOpenChange={(open) =>
          setToastState((previous) => ({ ...previous, open }))
        }
        duration={3000}
        className="grid w-[320px] gap-1 rounded-xl border-none bg-black/75 px-4 py-3 shadow-xl backdrop-blur-sm"
      >
        <ReactToast.Title className="text-sm font-semibold text-white">
          {toastState.title}
        </ReactToast.Title>
        {toastState.description ? (
          <ReactToast.Description className="text-sm leading-5 text-white/85">
            {toastState.description}
          </ReactToast.Description>
        ) : null}
      </ReactToast.Root>
      <ReactToast.Viewport className="fixed bottom-4 right-4 z-50 flex w-[360px] max-w-[calc(100vw-32px)] flex-col gap-2 outline-none" />
    </ReactToast.Provider>
  );
};

const BuildUI = () => {
  return (
    <SSEProvider>
      <BuildUIContent />
    </SSEProvider>
  );
};

export default BuildUI;
