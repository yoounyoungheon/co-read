import { loadAllArticles } from "@/app/business/article/article.service";
import { Card } from "@/app/ui/components/view/molecule/card/card";

export default async function ArticlePage() {
  const loadArticlesResponse = await loadAllArticles();

  const sortedArticles = loadArticlesResponse.isSuccess && loadArticlesResponse.data
    ? loadArticlesResponse.data.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
    : [];

  return (
    <main>
      <div className="text-center text-3xl font-bold p-5">ARTICLE</div>
      <div className="text-center mb-5 italic">
        {`"개발자로서 공부하고 고민했던 내용을 기록한 공간입니다."`}
      </div>
      <div className="px-10 grid grid-cols-1 gap-3 xl:grid-cols-3 lg:grid-cols-3 base:grid-cols-3 sm:grid-cols-2">
        {sortedArticles.map((article, index) => {
          const { title, description, url } = article;
          return (
            <Card
              key={index}
              className="flex flex-col text-start p-4 hover:shadow-lg duration-300"
            >
              <div className="flex-grow flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <a
                href={url}
                className="mt-auto inline-block text-blue-500 hover:text-blue-700 font-medium"
              >
                원문 보러가기 ➡️
              </a>
            </Card>
          );
        })}
      </div>
    </main>
  );
}