import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const bubbleDecorations = [
  { left: "8%", size: "56px", delay: "0s", duration: "13s" },
  { left: "24%", size: "22px", delay: "-3s", duration: "11s" },
  { left: "38%", size: "72px", delay: "-6s", duration: "16s" },
  { left: "54%", size: "34px", delay: "-2s", duration: "12s" },
  { left: "69%", size: "64px", delay: "-8s", duration: "15s" },
  { left: "82%", size: "28px", delay: "-5s", duration: "10s" },
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
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.02),_rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0">
        {bubbleDecorations.map((bubble, index) => (
          <span
            key={`${bubble.left}-${index}`}
            className="absolute bottom-[-18%] rounded-full border border-white/25 bg-white/8 shadow-[inset_0_1px_10px_rgba(255,255,255,0.18)] backdrop-blur-[1px] animate-profile-bubble-float"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDelay: bubble.delay,
              animationDuration: bubble.duration,
            }}
          >
            <span className="absolute left-[18%] top-[16%] h-[18%] w-[18%] rounded-full bg-white/35 blur-[1px]" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute -left-8 top-1/2 h-24 w-[140%] -translate-y-1/2 rotate-[-18deg] bg-gradient-to-r from-cyan-400/0 via-cyan-300/24 to-indigo-300/0" />
      <div className="pointer-events-none absolute -right-10 top-10 h-28 w-28 rounded-full bg-fuchsia-400/12 blur-0" />

      <div className="relative space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/75">
          Project
        </p>
        <p className="line-clamp-3 whitespace-pre-wrap text-2xl font-bold leading-tight">
          {projectName}
        </p>
        <div className="flex flex-wrap gap-2">
          {keyword?.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white/14 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-3">
        <div className="space-y-1 text-sm text-white/85">
          <p className="text-white/65">Project ID</p>
          <p className="font-medium text-white">{id}</p>
        </div>
        <Link
          href={href}
          aria-label={`${projectName} 상세 보기`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 transition-colors hover:bg-slate-100"
        >
          <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

export type { FeedBackCardProps };
