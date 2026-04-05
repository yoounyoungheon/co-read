import { loadProjectsForGuestRequest } from "./feature/project/business/project.service";
import { PageQueryProps } from "./utils/type";
import { loadAllArticles } from "./feature/article/business/article.service";
import { MainShowcasePage } from "./feature/profile/page/MainShowcasePage";
import { loadResumeForGuestRequest } from "./feature/resume/business/resume.service";
import { MainPageType } from "./utils/contants";
import { presentArticleCards } from "./feature/article/presentation/article.presenter";
import { presentProjectCards } from "./feature/project/presentation/project.presenter";
import { presentResumeTimeLine } from "./feature/resume/presentation/resume.presenter";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const type =
    typeof searchParams.type === "string"
      ? searchParams.type
      : MainPageType.PROFILE;

  const projectResponse =
    type === MainPageType.PROJECT ? await loadProjectsForGuestRequest() : null;

  const articleResponse =
    type === MainPageType.ARTICLE ? await loadAllArticles() : null;

  const timeLineResponse =
    type === MainPageType.PROFILE
      ? await loadResumeForGuestRequest()
      : null;

  const projectCards = projectResponse?.data
    ? presentProjectCards(projectResponse.data)
    : [];
  const articleCards = articleResponse?.data
    ? presentArticleCards(articleResponse.data)
    : [];
  const timeLineItems = timeLineResponse?.data
    ? presentResumeTimeLine(timeLineResponse.data)
    : [];

  return (
    <main className="flex justify-center w-full">
      <MainShowcasePage
        projects={projectCards}
        articles={articleCards}
        timeLineItems={timeLineItems}
        type={type}
      />
    </main>
  );
}
