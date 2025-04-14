export interface Article {
  id: string;

  userId: string;

  title: string;

  description: string;

  url: string;

  createdAt: Date;
}

export const createArticleDomain = (id: string, userId: string, title: string, description: string, url: string, createdAt: string): Article => {
  const article: Article = { id, userId, title, description, url, createdAt: new Date(createdAt) };
  return article;
}