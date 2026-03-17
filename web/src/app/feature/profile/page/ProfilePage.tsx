import type { Article } from "@/app/business/article/article.domain";
import type { Project } from "@/app/business/project/project.domain";
import { FeedGrid } from "../ui/FeedGrid";
import { ArticleList } from "../ui/ArticleList";
import Link from "next/link";
import Button from "@/app/shared/ui/atom/button";

export interface ProfilePageProps {
  projects: Project[];
  articles: Article[];
  type: string;
}

export function ProfilePage({
  projects,
  articles,
  type,
}: ProfilePageProps) {
  const categories = ["project", "article"] as const;

  return (
    <section className="flex w-full flex-col gap-6">
      {/* 카테고리 버튼 */}
      <div className="flex items-center flex-col gap-5 justify-center">
        <div className="font-semibold">{`차근차근! 구경하고 싶은 내용을 둘러보세요 :)`}</div>
        <div className="flex flex-row gap-4 mb-4 w-full max-w-screen-sm">
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
                {category === "project"
                  ? "영헌님이 진행한 프로젝트에요!"
                  : "영헌님이 작성한 아티클이에요!"}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        {type === "project" ? (
          <FeedGrid projects={projects} />
        ) : (
          <ArticleList articles={articles} />
        )}
      </div>
    </section>
  );
}
