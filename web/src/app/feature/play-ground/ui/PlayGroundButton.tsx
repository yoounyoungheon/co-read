import Link from "next/link";
import Button from "@/app/shared/ui/atom/button";
import { Card } from "@/app/shared/ui/molecule/card";

type PlayGroundButtonProps = {
  type: string;
  description: string;
  path: string;
  itemId: string;
};

export function PlayGroundButton({
  type,
  description,
  path,
  itemId,
}: PlayGroundButtonProps) {
  return (
    <div className="relative shrink-0">
      <input
        id={itemId}
        type="radio"
        name="play-ground-type"
        className="peer sr-only"
      />

      <Button
        asChild
        size="default"
        radius="full"
        className="h-24 w-24 whitespace-pre-wrap bg-gradient-to-br from-pink-700 via-purple-300 to-indigo-500 text-center font-semibold text-white shadow-lg hover:from-pink-700 hover:via-purple-300 hover:to-indigo-500"
      >
        <label htmlFor={itemId}>{type}</label>
      </Button>

      <Card className="pointer-events-none absolute left-[72%] top-[72%] z-10 w-64 border-slate-200 bg-white/95 p-4 opacity-0 shadow-xl transition-all duration-200 peer-checked:pointer-events-auto peer-checked:translate-y-0 peer-checked:opacity-100">
        <label
          htmlFor="play-ground-empty"
          aria-label="닫기"
          className="absolute left-0.5 top-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-sm font-semibold text-slate-500 shadow-sm transition hover:text-slate-900"
        >
          -
        </label>

        <div className="flex items-start justify-between gap-3 pt-2">
          <div>
            <div className="text-sm font-semibold text-slate-900">{type}</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
          <span className="truncate">{path}</span>
          <Link
            href={path}
            aria-label={`${type} 페이지로 이동`}
            className="shrink-0 rounded-full bg-slate-900 px-3 py-1.5 font-medium text-white"
          >
            이동
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default PlayGroundButton;
