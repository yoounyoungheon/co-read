type LogProps = {
  content: string;
};

export function Log({ content }: LogProps) {
  return (
    <section className="flex min-h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
      <div className="border-b border-slate-800 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Build Log
        </p>
      </div>
      <pre className="flex-1 overflow-auto px-5 py-4 font-mono text-sm leading-6 text-emerald-300 whitespace-pre-wrap">
        {content || "빌드 버튼을 눌러 로그 스트리밍을 시작하세요."}
      </pre>
    </section>
  );
}

export default Log;
