"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatProvider } from "../business/context/chat.context";
import { useChat } from "../business/hook/useChat";
import { ChatLog } from "./ChatLog";
import { SendMessageForm } from "./SendMessageForm";
import { SSEProvider } from "@/app/shared/sse/business/context/sseContext";
import { useSSE } from "@/app/shared/sse/business/hook/useSSE";
import WineRecommendCard from "./WineRecommendCard";

type PairingChunkType = "TITLE" | "COMMENT" | "REASON";

type ChatSSEEvent =
  | {
      type: "CHAT";
      data: {
        content: string;
      };
    }
  | {
      type: "START";
      data: {
        type: "MESSAGE";
        message: string;
      };
    }
  | {
      type: "PAIRING";
      data: {
        type: PairingChunkType;
        rank: number;
        content: string;
      };
    }
  | {
      type: "FINISH";
      data: null;
    };

type PairingRecommendation = {
  rank: number;
  title: string;
  comment: string;
  reason: string;
};

const createEmptyRecommendation = (rank: number): PairingRecommendation => ({
  rank,
  title: "",
  comment: "",
  reason: "",
});

const isRecommendationComplete = (recommendation?: PairingRecommendation) =>
  Boolean(
    recommendation &&
    recommendation.title.trim() &&
    recommendation.comment.trim() &&
    recommendation.reason.trim(),
  );

const PairingCardsPanel = ({
  pairingList,
}: {
  pairingList: PairingRecommendation[];
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const visiblePairingList = useMemo(() => {
    const pairingByRank = new Map(pairingList.map((item) => [item.rank, item]));
    const nextVisibleList: PairingRecommendation[] = [];

    for (const rank of [1, 2, 3]) {
      const recommendation = pairingByRank.get(rank);
      const previousRecommendation =
        rank === 1 ? undefined : pairingByRank.get(rank - 1);

      if (rank === 1) {
        if (!recommendation) {
          break;
        }

        nextVisibleList.push(recommendation);
        continue;
      }

      if (
        !previousRecommendation ||
        !isRecommendationComplete(previousRecommendation)
      ) {
        break;
      }

      if (!recommendation) {
        nextVisibleList.push(createEmptyRecommendation(rank));
        continue;
      }

      nextVisibleList.push(recommendation);
    }

    return nextVisibleList;
  }, [pairingList]);

  useEffect(() => {
    if (!scrollContainerRef.current || visiblePairingList.length === 0) {
      return;
    }

    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [visiblePairingList.length]);

  return (
    <section className="mt-3 overflow-visible">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max gap-4 px-8 py-8">
          {visiblePairingList.map((pairing) => (
            <WineRecommendCard
              key={pairing.rank}
              image="/carrot4.jpeg"
              rank={pairing.rank}
              title={pairing.title}
              reason={pairing.reason}
              comment={pairing.comment}
              className="w-[250px] md:w-[280px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const RenderChatUI = () => {
  const { chattingRoom, sendMessage, receiveMessage, updateChat } = useChat();
  const { open, close } = useSSE();
  const activeChatIdRef = useRef<string | null>(null);
  const chatAnswerRef = useRef("");
  const pairingListRef = useRef<PairingRecommendation[]>([]);
  const [streamVersion, setStreamVersion] = useState(0);

  const buildInfoPanel = () => (
    <PairingCardsPanel pairingList={pairingListRef.current} />
  );

  useEffect(() => {
    if (!activeChatIdRef.current || streamVersion === 0) {
      return;
    }

    const chatId = activeChatIdRef.current;

    open("/api/streaming/chat", [
      {
        eventName: "message",
        handle: (event) => {
          let payload: ChatSSEEvent;

          try {
            payload = JSON.parse(event.data) as ChatSSEEvent;
          } catch {
            return;
          }

          if (payload.type === "CHAT") {
            chatAnswerRef.current += payload.data.content;
            updateChat({
              chatId,
              message: payload.data.content,
              isloading: false,
              infoPanel: buildInfoPanel(),
              stream: true,
            });
            return;
          }

          if (payload.type === "START") {
            chatAnswerRef.current += payload.data.message;
            updateChat({
              chatId,
              message: payload.data.message,
              isloading: false,
              infoPanel: buildInfoPanel(),
              stream: true,
            });
            return;
          }

          if (payload.type === "FINISH") {
            updateChat({
              chatId,
              message: "",
              isloading: false,
              infoPanel: buildInfoPanel(),
              stream: true,
            });
            close();
            return;
          }

          if (payload.type !== "PAIRING") {
            return;
          }

          const pairingByRank = new Map(
            pairingListRef.current.map((item) => [item.rank, item]),
          );
          const currentRecommendation =
            pairingByRank.get(payload.data.rank) ??
            createEmptyRecommendation(payload.data.rank);

          const nextRecommendation =
            payload.data.type === "TITLE"
              ? {
                  ...currentRecommendation,
                  title: currentRecommendation.title + payload.data.content,
                }
              : payload.data.type === "COMMENT"
                ? {
                    ...currentRecommendation,
                    comment:
                      currentRecommendation.comment + payload.data.content,
                  }
                : {
                    ...currentRecommendation,
                    reason: currentRecommendation.reason + payload.data.content,
                  };

          pairingByRank.set(payload.data.rank, nextRecommendation);
          pairingListRef.current = Array.from(pairingByRank.values()).sort(
            (left, right) => left.rank - right.rank,
          );

          updateChat({
            chatId,
            message: "",
            isloading: false,
            infoPanel: buildInfoPanel(),
            stream: true,
          });
        },
      },
    ]);

    return () => {
      close();
    };
  }, [close, open, streamVersion, updateChat]);

  const handleSendMessage = ({ message }: { message: string }) => {
    const userChatId = uuid();
    const botChatId = uuid();

    close();
    activeChatIdRef.current = botChatId;
    chatAnswerRef.current = "";
    pairingListRef.current = [];

    sendMessage({ message, chatId: userChatId });
    receiveMessage({
      chatId: botChatId,
      message: "",
      isloading: true,
    });

    setStreamVersion((prev) => prev + 1);
  };

  return (
    <div className="flex h-full w-full max-w-[800px] flex-col">
      <ChatLog chats={chattingRoom.chats} />
      <div className="w-full shrink-0">
        <SendMessageForm
          onSend={handleSendMessage}
          initialMessage="오늘 기분 꿀꿀한데 와인 추천 좀 해줘.."
        />
      </div>
    </div>
  );
};

const ChatUI = () => {
  return (
    <SSEProvider>
      <ChatProvider>
        <RenderChatUI />
      </ChatProvider>
    </SSEProvider>
  );
};

export default ChatUI;

function uuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
