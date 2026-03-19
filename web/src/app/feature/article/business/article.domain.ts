export interface Article {
  id: string;

  title: string;

  description: string;

  url: string;
}

export const createArticleDomain = (
  id: string,
  title: string,
  description: string,
  url: string
): Article => {
  const article: Article = {
    id,
    title,
    description,
    url,
  };
  return article;
};
