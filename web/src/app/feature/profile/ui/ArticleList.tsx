import type { Article } from "@/app/business/article/article.domain";
import { ArticleCard } from "./ArticleCard";

export interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="flex flex-col gap-3 h-full max-w-[1200px]">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
