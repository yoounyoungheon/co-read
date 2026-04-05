import { ArticleCard } from "./ArticleCard";
import type { ArticleCardViewModel } from "../presentation/article.view-model";

export interface ArticleListProps {
  articles: ArticleCardViewModel[];
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
