import { Article } from "@/app/business/article/article.domain";
import { Card } from "../view/molecule/card/card";
import Link from "next/link";

export const ArticleView = ({ articles }: { articles: Article[] }) => {
  return (
    <div className="flex flex-col gap-3">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card
            className="
              p-3
              rounded-xl
              border border-slate-200
              bg-white
              shadow-sm
              transition
              hover:shadow-md
              hover:-translate-y-[1px]
            "
          >
            <div className="flex flex-col gap-2 min-h-[72px]">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900 group-hover:underline">
                  {article.title}
                </p>

                <span className="text-xs text-slate-400 shrink-0">↗</span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {article.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>•</span>
                <span className="truncate max-w-[160px]">
                  {new URL(article.url).hostname}
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
