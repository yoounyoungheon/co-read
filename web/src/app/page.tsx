import { loadProjectsForGuestRequest } from "./business/project/project.service";
import { PageQueryProps } from "./utils/type";
import { loadAllArticles } from "./business/article/article.service";
import { ProfilePage } from "./feature/profile/page/ProfilePage";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const type =
    typeof searchParams.type === "string" ? searchParams.type : "project";

  const projectResponse =
    type === "project" ? await loadProjectsForGuestRequest() : null;

  const articleResponse = type === "article" ? await loadAllArticles() : null;

  return (
    <main className="flex justify-center w-full">
      <ProfilePage
        projects={projectResponse?.data || []}
        articles={articleResponse?.data || []}
        type={type}
      />
    </main>
  );
}
