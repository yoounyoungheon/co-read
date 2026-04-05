import { Article, createArticleDomain } from "./article.domain";
import { ArticleApiModel } from "./article.api-model";

export const mapArticleApiModelToDomain = (
  article: ArticleApiModel,
): Article => {
  return createArticleDomain(
    article.id,
    article.title,
    article.description,
    article.url,
  );
};

export const mapArticleApiModelListToDomain = (
  articles: ArticleApiModel[],
): Article[] => {
  return articles.map(mapArticleApiModelToDomain);
};
