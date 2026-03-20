"use client";

import { WineRecommendView } from "./WineRecommendView";
import { ChatProvider } from "../business/context/chat.context";
import { useChat } from "../business/hook/useChat";
import { ChatLog } from "./ChatLog";
import { SendMessageForm } from "./SendMessageForm";

const RenderChatUI = () => {
  const { chattingRoom, sendMessage, receiveMessage, updateChat } = useChat();

  const handleSendMessage = ({ message }: { message: string }) => {
    sendMessage({ message, chatId: uuid() });

    requestMessage(message);
  };

  // TODO: sse handler 로직 구현 예정 (현재 mocking)
  const requestMessage = (message: string) => {
    const chatId = uuid();
    receiveMessage({ chatId, message: "", isloading: true });

    const messageArr: string[] = `${message}에 대한 결과입니다.`.split("");
    messageArr.forEach((delta, index) => {
      setTimeout(() => {
        const isLast = index === messageArr.length - 1;
        updateChat({
          chatId,
          message: delta,
          isloading: false,
          stream: true,
          ...(isLast && { infoPanel: <WineRecommendView /> }),
        });
      }, index * 50);
    });

    return { chatId, messageArr };
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
    <ChatProvider>
      <RenderChatUI />
    </ChatProvider>
  );
};

export default ChatUI;
function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
