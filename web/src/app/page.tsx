import { loadProjectsForGuestRequest } from "./business/project/project.service";
import { PageQueryProps } from "./utils/type";
import { loadAllArticles } from "./business/article/article.service";
import { ProfilePage } from "./feature/profile/page/ProfilePage";
import ProfileImage from "@/app/assets/profile.png";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const type =
    typeof searchParams.type === "string" ? searchParams.type : "project";

  const projectResponse =
    type === "project" ? await loadProjectsForGuestRequest() : null;

  const articleResponse = type === "article" ? await loadAllArticles() : null;

  return (
    <main className="py-4 px-2">
      <ProfilePage
        projects={projectResponse?.data || []}
        articles={articleResponse?.data || []}
        type={type}
        name={"윤영헌"}
        job={"🖥️ developer"}
        spec={["Dongguk Univ · scsc & biz", "Open Labs · 2025 ~"]}
        intorudctiion={
          "안녕하세요! 개발자 윤영헌입니다.\n융합소프트웨어와 경영학을 전공했습니다.\n비즈니스, 기술적 관점에서 변화에 유연한 소프트웨어 설계를 고민합니다.\ne-mail: iddyoon@gmail.com"
        }
        profileImage={ProfileImage}
        githubLink={""}
        blogLink={""}
      />
    </main>
  );
}
