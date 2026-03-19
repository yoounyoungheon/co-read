import type { Article } from "@/app/feature/article/business/article.domain";
import { ArticleCard } from "./ArticleCard";

export interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="h-full max-w-[1200px] grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-2 md:grid-cols-2">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
