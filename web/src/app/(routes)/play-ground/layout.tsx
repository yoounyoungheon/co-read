import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Ground",
  description: "인터랙션과 실험용 UI를 모아둔 플레이그라운드 영역입니다.",
};

export default function PlayGroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full justify-center px-2 py-8">
      <div className="flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-slate-200 p-5 shadow-sm">
        <header className="space-y-2 border-b border-slate-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Play Ground
          </p>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              UI Playground
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              컴포넌트의 인터랙션과 화면 흐름을 빠르게 확인할 수 있는
              공간입니다.
            </p>
          </div>
        </header>

        <div className="min-h-[480px] flex justify-center">{children}</div>
      </div>
    </section>
  );
}
