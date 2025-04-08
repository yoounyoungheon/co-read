import { loadAllArticles } from "@/app/business/article/article.service";
import { Card } from "@/app/ui/components/view/molecule/card/card";

export default async function ArticlePage() {
  const loadArticlesResponse = await loadAllArticles();
  
  return (
    <main>
      <div className="text-center text-3xl font-bold p-5">ARTICLE</div>
      <div className="text-center mb-5 italic">
        {`"개발자로서 공부하고 고민했던 내용을 기록한 공간입니다."`}
      </div>
      <div className="px-10 grid grid-cols-3 gap-3">
        {loadArticlesResponse.isSuccess && loadArticlesResponse.data ? (
        loadArticlesResponse.data.map((article, index) => {
            const { title, description, url } = article;
            return (
            <Card key={index} className="text-start p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-500 hover:text-blue-700 font-medium"
                >
                    원문 보러가기 ➡️
                </a>
                </div>
            </Card>
            );
        })
        ) : (
        <></>
        )}
      </div>
    </main>
  )
}