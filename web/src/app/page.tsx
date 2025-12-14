import { ProfileView } from "./ui/components/domain/ProfileView";
import { FeedView } from "./ui/components/domain/FeedView";
import { loadProjectsForGuestRequest } from "./business/project/project.service";
import AchromaticButton from "./ui/components/view/atom/button/achromatic-button";
import { PageQueryProps } from "./utils/type";
import Link from "next/link";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const ctg =
    typeof searchParams.ctg === "string" ? searchParams.ctg : "project";

  const categories = ["project", "article"] as const;

  const projectResponse =
    ctg === "project" ? await loadProjectsForGuestRequest() : null;

  const renderFeedSection = () => {
    switch (ctg) {
      case "project":
        if (!projectResponse?.data) {
          return (
            <div className="text-center">
              서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </div>
          );
        }
        return <FeedView projects={projectResponse.data} />;

      case "article":
        return <div className="text-center">준비중입니다.</div>;

      default:
        return null;
    }
  };

  return (
    <main className="py-4 px-2">
      {/* 프로필 영역 */}
      <ProfileView />

      {/* 카테고리 버튼 */}
      <div className="flex items-center justify-center">
        <div className="flex flex-row gap-4 mb-4 w-full max-w-screen-sm">
          {categories.map((category) => (
            <Link key={category} href={`/?ctg=${category}`} className="w-full">
              <AchromaticButton
                className={`w-full ${
                  ctg === category ? "" : "text-black/70 bg-slate-50"
                }`}
              >
                {category}
              </AchromaticButton>
            </Link>
          ))}
        </div>
      </div>

      {/* 피드 영역 */}
      {renderFeedSection()}
    </main>
  );
}
