"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatProvider } from "../business/context/chat.context";
import { useChat } from "../business/hook/useChat";
import { ChatLog } from "./ChatLog";
import { SendMessageForm } from "./SendMessageForm";
import { SSEProvider } from "@/app/shared/sse/business/context/sseContext";
import { useSSE } from "@/app/shared/sse/business/hook/useSSE";
import WineRecommendCard from "@/app/feature/wine/ui/WineRecommendCard";

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
  chatAnswer,
}: {
  pairingList: PairingRecommendation[];
  chatAnswer: string;
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
    <section className="mt-3 flex flex-col gap-3">
      {chatAnswer && (
        <div className="rounded-2xl border border-mysom-secondary px-4 py-3 text-sm leading-6 text-slate-700 shadow">
          {chatAnswer}
        </div>
      )}

      <div className="overflow-visible">
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const RenderChatUI = () => {
  const { chattingRoom, sendMessage, receiveMessage, updateChat } = useChat();
  const { open, close } = useSSE();
  const activeChatIdRef = useRef<string | null>(null);
  const pairingListRef = useRef<PairingRecommendation[]>([]);
  const chatAnswerRef = useRef("");
  const [streamVersion, setStreamVersion] = useState(0);
  const [pairingList, setPairingList] = useState<PairingRecommendation[]>([]);
  const [chatAnswer, setChatAnswer] = useState("");

  useEffect(() => {
    pairingListRef.current = pairingList;
  }, [pairingList]);

  useEffect(() => {
    chatAnswerRef.current = chatAnswer;
  }, [chatAnswer]);

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
            setChatAnswer((prev) => prev + payload.data.content);
            return;
          }

          if (payload.type === "START") {
            setChatAnswer((prev) => prev + payload.data.message);
            return;
          }

          if (payload.type === "FINISH") {
            close();
            return;
          }

          if (payload.type !== "PAIRING") {
            return;
          }

          const nextChunk = payload.data;

          setPairingList((prev) => {
            const pairingByRank = new Map(
              prev.map((item) => [item.rank, item]),
            );
            const currentRecommendation =
              pairingByRank.get(nextChunk.rank) ??
              createEmptyRecommendation(nextChunk.rank);

            const nextRecommendation =
              nextChunk.type === "TITLE"
                ? {
                    ...currentRecommendation,
                    title: currentRecommendation.title + nextChunk.content,
                  }
                : nextChunk.type === "COMMENT"
                  ? {
                      ...currentRecommendation,
                      comment:
                        currentRecommendation.comment + nextChunk.content,
                    }
                  : {
                      ...currentRecommendation,
                      reason: currentRecommendation.reason + nextChunk.content,
                    };

            pairingByRank.set(nextChunk.rank, nextRecommendation);

            return Array.from(pairingByRank.values()).sort(
              (left, right) => left.rank - right.rank,
            );
          });
        },
      },
    ]);

    return () => {
      close();
      updateChat({
        chatId,
        message: "",
        isloading: false,
        infoPanel: (
          <PairingCardsPanel
            pairingList={pairingListRef.current}
            chatAnswer={chatAnswerRef.current}
          />
        ),
      });
    };
  }, [close, open, streamVersion, updateChat]);

  useEffect(() => {
    if (!activeChatIdRef.current) {
      return;
    }

    updateChat({
      chatId: activeChatIdRef.current,
      message: "",
      isloading: false,
      infoPanel: (
        <PairingCardsPanel pairingList={pairingList} chatAnswer={chatAnswer} />
      ),
    });
  }, [chatAnswer, pairingList, updateChat]);

  const handleSendMessage = ({ message }: { message: string }) => {
    const userChatId = uuid();
    const botChatId = uuid();

    close();
    activeChatIdRef.current = botChatId;
    setPairingList([]);
    setChatAnswer("");

    sendMessage({ message, chatId: userChatId });
    receiveMessage({
      chatId: botChatId,
      message: "",
      isloading: true,
      infoPanel: <PairingCardsPanel pairingList={[]} chatAnswer="" />,
    });

    setStreamVersion((prev) => prev + 1);
  };

  return (
    <div className="flex h-full flex-col">
      <ChatLog chats={chattingRoom.chats} />
      <div className="w-full shrink-0 p-1.5">
        <SendMessageForm onSend={handleSendMessage} />
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
