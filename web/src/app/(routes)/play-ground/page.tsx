import ChatUI from "@/app/feature/play-ground/chat/ui/ChatUI";
import BuildUI from "@/app/feature/play-ground/log/ui/BuildUI";
import { PageQueryProps } from "@/app/utils/type";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const type =
    typeof searchParams.type === "string" ? searchParams.type : undefined;

  if (!type) {
    return (
      <main className="flex flex-col gap-5 py-2 max-w-3xl">
        타입이 제공되지 않았습니다.
      </main>
    );
  }

  const renderContentByType = () => {
    switch (type) {
      case "AI_CHAT_STREAMING":
        return <ChatUI />;
      case "LOG_STREAMING":
        return <BuildUI />;
      case "WEB_RTC":
        return <div>프로젝트 콘텐츠</div>;
      case "CSS_ONLY":
        return <div>CSS ONLY 콘텐츠</div>;
      default:
        return <div>알 수 없는 타입입니다.</div>;
    }
  };

  return (
    <main className="flex flex-col gap-5 py-2 w-full items-center">
      {renderContentByType()}
    </main>
  );
}
