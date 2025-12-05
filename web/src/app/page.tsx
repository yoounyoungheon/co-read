import { ProfileView } from "./ui/components/domain/ProfileView";
import { FeedView } from "./ui/components/domain/FeedView";
import { loadProjectsForGuestRequest } from "./business/project/project.service";

export default async function MainPage() {
  const response = await loadProjectsForGuestRequest();

  return (
    <main className="py-12 px-2">
      {/* 프로필 영역 */}
      <ProfileView />

      {/* 피드 영역 */}
      {response.data ? (
        <FeedView projects={response.data} />
      ) : (
        <div className="text-center">
          {"서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
        </div>
      )}
    </main>
  );
}
