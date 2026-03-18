import Link from "next/link";
import type { Article } from "@/app/business/article/article.domain";
import { Card } from "@/app/shared/ui/molecule/card";

export interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card
        className="
          rounded-xl
          border border-slate-200
          bg-white
          p-3
          shadow-sm
          transition
          hover:-translate-y-[1px]
          hover:shadow-md
        "
      >
        <div className="flex min-h-[72px] flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900 group-hover:underline">
              {article.title}
            </p>

            <span className="shrink-0 text-xs text-slate-400">↗</span>
          </div>

          <p className="line-clamp-2 text-xs text-slate-600">
            {article.description}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>•</span>
            <span className="max-w-[160px] truncate">
              {new URL(article.url).hostname}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
