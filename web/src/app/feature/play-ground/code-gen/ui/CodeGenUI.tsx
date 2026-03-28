"use client";

import * as ReactToast from "@radix-ui/react-toast";
import { useEffect, useMemo, useState } from "react";
import { SSEProvider } from "@/app/shared/sse/business/context/sseContext";
import { useSSE } from "@/app/shared/sse/business/hook/useSSE";
import Button from "@/app/shared/ui/atom/button";
import { Card } from "@/app/shared/ui/molecule/card";
import { Dialog, DialogContent } from "@/app/shared/ui/molecule/dialog";

export type CodeGenStep =
  | "sql"
  | "modeling"
  | "controller"
  | "service"
  | "data"
  | "test"
  | "config"
  | "validation"
  | "result";

export type CodeGenStatus = "PENDING" | "SUCCESS" | "FAIL";

export type CodeGenItem = {
  id: number;
  type: Exclude<CodeGenStep, "result">;
  class: string;
  method: string;
  message: string;
  result: CodeGenStatus;
};

export type CodeGenSummary = {
  result: "SUCCESS" | "FAIL";
  git: string;
  artifact: string;
};

type ProcessingPayload = CodeGenItem;

type ToastState = {
  id: number;
  open: boolean;
  title: string;
  description?: string;
};

const CODE_GEN_STEPS: CodeGenStep[] = [
  "sql",
  "modeling",
  "controller",
  "service",
  "data",
  "test",
  "config",
  "validation",
  "result",
];

const STATUS_STYLES: Record<CodeGenStatus, string> = {
  SUCCESS: "border-primary-main/20 bg-primary-main text-white",
  PENDING: "border-[#F4F5F7] bg-[#F4F5F7] text-slate-600",
  FAIL: "border-error-main/20 bg-error-main text-white",
};

const STEP_DESCRIPTIONS = [
  "sql: 데이터베이스 스키마를 설계하는 단계에요.",
  "modeling: 애플리케이션 설계를 담당하는 단계에요.",
  "controller, service, data, test, config: modeling 내용을 바탕으로 코드를 생성하는 단계에요. 병렬로 수행돼요.",
  "validation: 코드 생성을 모두 마친 후, 유효성을 검증하는 단계에요.",
  "result: 애플리케이션이 생성 된 후, 결과를 확인할 수 있어요!",
] as const;

const formatDisplayName = (item: Pick<CodeGenItem, "class" | "method">) =>
  `${item.class}-${item.method}`;

const normalizeStepLabel = (step: CodeGenStep) =>
  step.charAt(0).toUpperCase() + step.slice(1);

const initialToastState: ToastState = {
  id: 0,
  open: false,
  title: "",
  description: undefined,
};

const Stepper = ({
  currentStep,
  onChange,
}: {
  currentStep: CodeGenStep;
  onChange: (step: CodeGenStep) => void;
}) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        Code Generation Flow
      </p>
      <div
        className="
          mt-4
          overflow-x-auto
          pb-3
          [scrollbar-color:rgb(203_213_225)_white]
          [scrollbar-width:thin]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-none
          [&::-webkit-scrollbar-thumb]:bg-slate-300
          [&::-webkit-scrollbar-track]:border-none
          [&::-webkit-scrollbar-track]:bg-white
          [&::-webkit-scrollbar]:h-2
        "
      >
        <div className="flex min-w-max gap-2">
          {CODE_GEN_STEPS.map((step) => {
            const isActive = currentStep === step;

            return (
              <Button
                key={step}
                variant={isActive ? "solid" : "outline"}
                type="primary"
                radius="full"
                className="min-w-[112px] shrink-0 px-4 py-2 text-sm capitalize shadow-none"
                onClick={() => onChange(step)}
              >
                {step}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const PendingIndicator = () => (
  <span className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
);

const CodeGenItemDialog = ({
  selectedItem,
  open,
  onOpenChange,
}: {
  selectedItem?: CodeGenItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="코드 생성 상세 정보"
        description="선택한 코드 생성 항목의 현재 상태를 확인할 수 있어요."
        className="max-w-lg"
      >
        {selectedItem ? (
          <div className="space-y-3 text-sm text-slate-700">
            {[
              ["type", selectedItem.type],
              ["class", selectedItem.class],
              ["method", selectedItem.method],
              ["message", selectedItem.message],
              ["result", selectedItem.result],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 break-all whitespace-pre-line text-sm leading-6 text-slate-800">
                  {value}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

const ResultPanel = ({ result }: { result?: CodeGenSummary }) => {
  if (!result) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        애플리케이션이 생성 중이에요!
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Result
        </p>
        <p
          className={`mt-2 text-sm font-semibold ${
            result.result === "SUCCESS"
              ? "text-primary-main"
              : "text-error-main"
          }`}
        >
          {result.result}
        </p>
      </div>
      <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Git
        </p>
        <p className="mt-2 break-all text-sm text-slate-700">{result.git}</p>
      </div>
      <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Artifact
        </p>
        <p className="mt-2 break-all text-sm text-slate-700">
          {result.artifact}
        </p>
      </div>
    </div>
  );
};

const StepDescriptionPanel = () => {
  return (
    <Card className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#fffdf8_0%,#ffffff_48%,#f8fafc_100%)] p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Step Description
        </p>
        <h2 className="text-xl font-semibold text-slate-900">
          코드 생성 단계 안내
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          각 단계가 어떤 역할을 담당하는지 먼저 보고, 아래 스테퍼에서 현재 진행
          중인 영역을 확인해 보세요. 새로 고침을 하면, 스트림 데이터가 다시
          처음부터 들어와요!
        </p>
      </div>

      <div className="mt-5 space-y-2 text-sm leading-7 text-slate-700">
        {STEP_DESCRIPTIONS.map((description) => (
          <p key={description} className="whitespace-pre-line">
            {description}
          </p>
        ))}
      </div>
    </Card>
  );
};

const CodeGenContent = () => {
  const { open, close, sseState } = useSSE();
  const [currentStep, setCurrentStep] = useState<CodeGenStep>("sql");
  const [codeGenList, setCodeGenList] = useState<CodeGenItem[]>([]);
  const [result, setResult] = useState<CodeGenSummary | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<CodeGenItem | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toastList, setToastList] = useState<ToastState[]>([]);

  const showToast = (title: string, description?: string) => {
    setToastList((previous) => {
      const nextToast: ToastState = {
        ...initialToastState,
        id: Date.now() + previous.length,
        open: true,
        title,
        description,
      };

      return [...previous, nextToast].slice(-5);
    });
  };

  const currentStepItems = useMemo(
    () =>
      currentStep === "result"
        ? []
        : codeGenList.filter((item) => item.type === currentStep),
    [codeGenList, currentStep],
  );

  useEffect(() => {
    close();
    setCodeGenList([]);
    setResult(undefined);

    open("/api/streaming/code-gen", [
      {
        eventName: "start",
        handle: () => {
          showToast(
            "코드 생성을 시작했어요.",
            "서버에서 코드 생성 상태를 실시간으로 보내고 있어요.",
          );
        },
      },
      {
        eventName: "processing",
        handle: (event) => {
          let payload: ProcessingPayload;

          try {
            payload = JSON.parse(event.data) as ProcessingPayload;
          } catch {
            return;
          }

          showToast(
            `${payload.type} 단계를 처리하고 있어요.`,
            `${payload.class}-${payload.method} · ${payload.result}`,
          );

          setCodeGenList((previous) => {
            const targetIndex = previous.findIndex(
              (item) => item.id === payload.id,
            );

            if (targetIndex === -1) {
              return [...previous, payload];
            }

            const next = [...previous];
            next[targetIndex] = payload;
            return next;
          });
        },
      },
      {
        eventName: "end",
        handle: (event) => {
          let payload: CodeGenSummary;

          try {
            payload = JSON.parse(event.data) as CodeGenSummary;
          } catch {
            close();
            return;
          }

          setResult(payload);
          showToast(
            payload.result === "SUCCESS"
              ? "코드 생성이 완료됐어요."
              : "코드 생성이 실패했어요.",
            payload.result === "SUCCESS"
              ? "최종 산출물 정보를 확인해 보세요."
              : "생성 결과를 확인해 보세요.",
          );
          close();
        },
      },
    ]);

    return () => {
      close();
    };
  }, [close, open]);

  return (
    <>
      <ReactToast.Provider swipeDirection="right">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          <StepDescriptionPanel />
          <Stepper currentStep={currentStep} onChange={setCurrentStep} />

          <Card className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Code Generation Status
              </p>
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {normalizeStepLabel(currentStep)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    현재 SSE 연결 상태:{" "}
                    <span className="font-semibold text-slate-900">
                      {sseState}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              {currentStep === "result" ? (
                <ResultPanel result={result} />
              ) : currentStepItems.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
                  아직 이 단계의 코드 생성 항목이 없어요.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {currentStepItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-4 text-left transition hover:scale-[0.997] ${STATUS_STYLES[item.result]}`}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {formatDisplayName(item)}
                        </p>
                        <p className="mt-1 text-xs opacity-85">{item.result}</p>
                      </div>
                      {item.result === "PENDING" ? <PendingIndicator /> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {toastList.map((toast) => (
          <ReactToast.Root
            key={toast.id}
            open={toast.open}
            onOpenChange={(open) => {
              setToastList((previous) =>
                previous
                  .map((item) =>
                    item.id === toast.id ? { ...item, open } : item,
                  )
                  .filter((item) => item.open),
              );
            }}
            duration={2500}
            className="relative grid w-[360px] gap-1 rounded-xl border-none bg-black/75 px-4 py-3 shadow-xl backdrop-blur-sm"
          >
            <ReactToast.Close
              aria-label="닫기"
              className="absolute right-3 top-2 text-sm font-semibold text-white/70 transition hover:text-white"
            >
              x
            </ReactToast.Close>
            <ReactToast.Title className="text-sm font-semibold text-white">
              {toast.title}
            </ReactToast.Title>
            {toast.description ? (
              <ReactToast.Description className="text-sm leading-5 text-white/85">
                {toast.description}
              </ReactToast.Description>
            ) : null}
          </ReactToast.Root>
        ))}
        <ReactToast.Viewport className="fixed bottom-4 right-4 z-50 flex w-[400px] max-w-[calc(100vw-32px)] flex-col gap-2 outline-none" />
      </ReactToast.Provider>

      <CodeGenItemDialog
        selectedItem={selectedItem}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

const CodeGenUI = () => {
  return (
    <SSEProvider>
      <CodeGenContent />
    </SSEProvider>
  );
};

export default CodeGenUI;
