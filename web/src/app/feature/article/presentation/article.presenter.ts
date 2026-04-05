import type { Article } from "../business/article.domain";
import type { ArticleCardViewModel } from "./article.view-model";

const toHostname = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

export const presentArticleCard = (
  article: Article,
): ArticleCardViewModel => {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    url: article.url,
    hostname: toHostname(article.url),
  };
};

export const presentArticleCards = (
  articles: Article[],
): ArticleCardViewModel[] => {
  return articles.map(presentArticleCard);
};
