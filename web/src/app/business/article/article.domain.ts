export interface Article {
  id: string;

  userId: string;

  title: string;

  description: string;

  url: string;
}

export const createArticleDomain = (id: string, userId: string, title: string, description: string, url: string): Article => {
  const article: Article = { id, userId, title, description, url };
  return article;
}