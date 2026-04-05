import type { ArticleCardViewModel } from "@/app/feature/article/presentation/article.view-model";
import type { ProjectCardViewModel } from "@/app/feature/project/presentation/project.view-model";
import { FeedGrid } from "../../project/ui/FeedGrid";
import { ArticleList } from "../../article/ui/ArticleList";
import Link from "next/link";
import Button from "@/app/shared/ui/atom/button";
import { MainPageType } from "@/app/utils/contants";
import PlayGround from "../../play-ground/ui/PlayGround";
import { TimeLine } from "../../resume/ui/TimeLine";
import type { ResumeTimeLineItemViewModel } from "../../resume/presentation/resume.view-model";
import type { PlayGroundCardViewModel } from "../../play-ground/presentation/play-ground.view-model";

export interface MainShowcasePageProps {
  projects: ProjectCardViewModel[];
  articles: ArticleCardViewModel[];
  timeLineItems: ResumeTimeLineItemViewModel[];
  playGroundItems: PlayGroundCardViewModel[];
  type: string;
}

export function MainShowcasePage({
  projects,
  articles,
  timeLineItems,
  playGroundItems,
  type,
}: MainShowcasePageProps) {
  const categories = [
    MainPageType.PROFILE,
    MainPageType.PROJECT,
    MainPageType.ARTICLE,
    MainPageType.PLAY_GROUND,
  ] as const;

  const renderCategoryButtonText = (category: string) => {
    switch (category) {
      case MainPageType.PROFILE:
        return "어떤 사람인지 궁금하다면?";
      case MainPageType.PROJECT:
        return "영헌님이 진행한 프로젝트에요!";
      case MainPageType.ARTICLE:
        return "영헌님이 작성한 아티클이에요!";
      case MainPageType.PLAY_GROUND:
        return "영헌님의 플레이그라운드에요!";
      default:
        return "";
    }
  };

  return (
    <section className="flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6">
      {/* 카테고리 버튼 */}
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <div className="text-center font-semibold">{`차근차근! 구경하고 싶은 내용을 둘러보세요 :)`}</div>
        <div className="mb-4 flex w-full flex-col gap-3 items-center justify-center max-w-6xl sm:grid sm:grid-cols-4 sm:gap-4">
          {categories.map((category) => (
            <Link key={category} href={`/?type=${category}`} className="w-full">
              <Button
                className={`w-full ${
                  type === category
                    ? ""
                    : "text-black/70 bg-slate-50 hover:bg-slate-100"
                }`}
                type={type === category ? "primary" : "cancel"}
              >
                {renderCategoryButtonText(category)}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex w-full justify-center">
        {type === MainPageType.PROJECT ? (
          <FeedGrid projects={projects} />
        ) : type === MainPageType.ARTICLE ? (
          <ArticleList articles={articles} />
        ) : type === MainPageType.PROFILE ? (
          <TimeLine items={timeLineItems} />
        ) : (
          <PlayGround types={playGroundItems} />
        )}
      </div>
    </section>
  );
}
