import { loadProjectsForGuestRequest } from "./feature/project/business/project.service";
import { PageQueryProps } from "./utils/type";
import { loadAllArticles } from "./feature/article/business/article.service";
import { MainShowcasePage } from "./feature/profile/page/MainShowcasePage";
import { MainPageType } from "./utils/contants";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const type =
    typeof searchParams.type === "string"
      ? searchParams.type
      : MainPageType.PROJECT;

  const projectResponse =
    type === MainPageType.PROJECT ? await loadProjectsForGuestRequest() : null;

  const articleResponse =
    type === MainPageType.ARTICLE ? await loadAllArticles() : null;

  return (
    <main className="flex justify-center w-full">
      <MainShowcasePage
        projects={projectResponse?.data || []}
        articles={articleResponse?.data || []}
        type={type}
      />
    </main>
  );
}
