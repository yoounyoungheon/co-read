import ChatUI from "@/app/feature/play-ground/chat/ui/ChatUI";
import OnlyCssComponents from "@/app/feature/play-ground/css-only/ui/OnlyCssComponents";
import CodeGenUI from "@/app/feature/play-ground/code-gen/ui/CodeGenUI";
import BuildUI from "@/app/feature/play-ground/log/ui/BuildUI";
import RtcRoom from "@/app/feature/play-ground/rtc/ui/RtcRoom";
import { PageQueryProps } from "@/app/utils/type";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const type =
    typeof searchParams.type === "string" ? searchParams.type : undefined;
  const roomId =
    typeof searchParams.id === "string" ? searchParams.id : undefined;

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
      case "CODE_GEN_STREAM":
        return <CodeGenUI />;
      case "WEB_RTC":
        return roomId ? (
          <RtcRoom roomId={roomId} />
        ) : (
          <div>WEB_RTC에는 `id` 쿼리스트링이 필요합니다.</div>
        );
      case "CSS_ONLY":
        return <OnlyCssComponents />;
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
