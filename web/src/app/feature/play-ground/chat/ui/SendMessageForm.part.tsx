"use client";
import { ArrowUp } from "lucide-react";

export const SendButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="submit"
    className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-main-purple-500 bg-main-purple-500 text-white transition hover:bg-main-purple-600 focus:outline-none"
    onClick={onClick}
    aria-label="메시지 전송"
  >
    <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
  </button>
);
