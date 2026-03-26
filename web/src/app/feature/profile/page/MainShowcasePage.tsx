import type { Article } from "@/app/feature/article/business/article.domain";
import type { Project } from "@/app/feature/project/business/project.domain";
import { FeedGrid } from "../ui/FeedGrid";
import { ArticleList } from "../ui/ArticleList";
import Link from "next/link";
import Button from "@/app/shared/ui/atom/button";
import { MainPageType } from "@/app/utils/contants";
import PlayGround from "../../play-ground/ui/PlayGround";
import { TimeLine, TimeLineItem } from "../../resume/ui/TimeLine";

export interface MainShowcasePageProps {
  projects: Project[];
  articles: Article[];
  timeLineItems: TimeLineItem[];
  type: string;
}

export function MainShowcasePage({
  projects,
  articles,
  timeLineItems,
  type,
}: MainShowcasePageProps) {
  const categories = [
    MainPageType.PROFILE,
    MainPageType.PROJECT,
    MainPageType.ARTICLE,
    MainPageType.PLAY_GROUND,
  ] as const;

  const playGrounTypes = [
    {
      type: "AI Chat Streaming",
      description:
        "AI가 응답하는 스트리밍 데이터를 채팅 UI로 구현한 플레이그라운드입니다.",
      path: "/play-ground?type=AI_CHAT_STREAMING",
    },
    {
      type: "Log Streaming",
      description:
        "로그성 데이터의 실시간 스트리밍을 제공하는 플레이그라운드입니다.",
      path: "/play-ground?type=LOG_STREAMING",
    },
    {
      type: "WEB RTC",
      description:
        "WEB RTC를 활용한 실시간 통신을 제공하는 플레이그라운드입니다.",
      path: "/play-ground?type=WEB_RTC",
    },
    {
      type: "CSS ONLY",
      description:
        "JS없이 상태가 존재하는 컴포넌트 예시를 제공하는 플레이그라운드입니다.",
      path: "/play-ground?type=CSS_ONLY",
    },
  ];

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
          <PlayGround types={playGrounTypes} />
        )}
      </div>
    </section>
  );
}
