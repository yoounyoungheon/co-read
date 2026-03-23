import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const bubbleDecorations = [
  { left: "14%", size: "22px", delay: "0s", duration: "14s" },
  { left: "66%", size: "44px", delay: "-4s", duration: "17s" },
  { left: "82%", size: "18px", delay: "-2s", duration: "12s" },
];

interface FeedBackCardProps {
  projectName: string;
  id: string;
  href: string;
  keyword?: string[];
}

export function FeedBackCard({
  projectName,
  id,
  href,
  keyword,
}: FeedBackCardProps) {
  const visibleKeywords = keyword?.slice(0, 3) ?? [];

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0)),radial-gradient(circle_at_top_right,_rgba(148,163,184,0.16),_transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0">
        {bubbleDecorations.map((bubble, index) => (
          <span
            key={`${bubble.left}-${index}`}
            className="absolute bottom-[-12%] rounded-full border border-white/10 bg-white/6 shadow-[inset_0_1px_8px_rgba(255,255,255,0.12)] animate-profile-bubble-float"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDelay: bubble.delay,
              animationDuration: bubble.duration,
            }}
          >
            <span className="absolute left-[18%] top-[16%] h-[18%] w-[18%] rounded-full bg-white/20 blur-[1px]" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-5 top-20 h-px bg-white/10" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
              Project
            </p>
            <p className="text-sm text-white/55">ID · {id}</p>
          </div>
          <Link
            href={href}
            aria-label={`${projectName} 상세 보기`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_8px_18px_rgba(255,255,255,0.14)] transition-transform hover:scale-105 hover:bg-slate-100"
          >
            <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="space-y-3 pt-3">
          <p className="line-clamp-3 whitespace-pre-wrap text-lg font-bold leading-[1.18] tracking-[-0.03em] text-white">
            {projectName}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleKeywords.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-white/88"
            >
              {item}
            </span>
          ))}
        </div>

        {keyword && keyword.length > visibleKeywords.length ? (
          <p className="text-xs text-white/45">
            + {keyword.length - visibleKeywords.length} more
          </p>
        ) : null}
      </div>

      <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          Project
        </p>
        <p className="mt-2 text-sm leading-6 text-white/72">
          키워드와 프로젝트 상세를 확인하려면 우측 상단 버튼으로 이동하세요.
        </p>
      </div>
    </div>
  );
}

export type { FeedBackCardProps };
