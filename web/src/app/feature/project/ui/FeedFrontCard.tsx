import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/app/shared/ui/molecule/card";

interface FeedFrontCardProps {
  image?: string | null;
  projectName: string;
  href: string;
}

export function FeedFrontCard({
  image,
  projectName,
  href,
}: FeedFrontCardProps) {
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex items-start justify-between gap-2 p-2">
        <div className="flex-1">
          <p className="line-clamp-3 pt-1 whitespace-pre-wrap font-bold text-slate-900 sm:text-sm">
            {projectName}
          </p>
        </div>
        <Link
          href={href}
          aria-label={`${projectName} 상세 보기`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
        >
          <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
        </Link>
      </div>
      <div className="p-2">
        <Card className="relative w-[100%] aspect-square rounded-2xl bg-white shadow-none">
          {image ? (
            <Image
              src={image}
              alt={projectName}
              fill
              sizes="1000px"
              className="rounded-2xl object-cover"
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-pink-700
                via-purple-300
                to-indigo-500
                px-6
                text-center
              "
            >
              <span className="text-lg font-semibold tracking-[0.12em] text-white sm:text-xl">
                {projectName}
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export type { FeedFrontCardProps };
