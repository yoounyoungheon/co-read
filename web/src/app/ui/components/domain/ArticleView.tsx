import { Article } from "@/app/business/article/article.domain";
import { ArticleCard } from "@/app/feature/profile/ui/ArticleCard";

export const ArticleView = ({ articles }: { articles: Article[] }) => {
  return (
    <div className="flex flex-col gap-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
