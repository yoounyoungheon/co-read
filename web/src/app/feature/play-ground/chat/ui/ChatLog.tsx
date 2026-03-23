import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Chat } from "../types/view.model";

type ChatLogProps = {
  chats: Chat[];
};

export const ChatLog = ({ chats }: ChatLogProps) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chats.length === 0) return;
    if (endRef.current) {
      endRef.current.scrollTo({
        top: endRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [chats]);

  return (
    <div
      className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      ref={endRef}
    >
      <div className="flex h-full flex-col gap-3">
        {chats.map((chat) => (
          <div key={chat.chatId}>
            {chat.message && (
              <div
                className={clsx(
                  "flex",
                  chat.isMine ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={clsx(
                    "w-fit rounded-2xl px-3 py-2 text-sm shadow",
                    "border border-mysom-secondary",
                    !chat.isMine && "max-w-[80%]",
                    chat.infoPanel && "mb-3",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {chat.message}
                  </p>
                </div>
              </div>
            )}

            {chat.infoPanel && <div className="w-full">{chat.infoPanel}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
