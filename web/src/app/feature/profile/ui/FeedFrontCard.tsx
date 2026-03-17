import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/app/shared/ui/molecule/card";

interface FeedFrontCardProps {
  image: string;
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
          <p className="line-clamp-3 pt-1 whitespace-pre-wrap font-bold text-slate-900 sm:text-[1.2rem]">
            {projectName}
          </p>
        </div>
        <Link
          href={href}
          aria-label={`${projectName} 상세 보기`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="flex items-end justify-start">
        <Card className="relative h-36 w-36 overflow-hidden rounded-[22px] bg-white shadow-none">
          <Image src={image} alt={projectName} fill className="object-cover" />
        </Card>
      </div>
    </div>
  );
}

export type { FeedFrontCardProps };
