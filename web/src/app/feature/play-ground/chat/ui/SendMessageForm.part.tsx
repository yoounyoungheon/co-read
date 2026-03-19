"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/shared/ui/molecule/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
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

export const ActionButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative ml-2">
          <button
            type="button"
            className="flex shrink-0 items-center justify-center rounded-full bg-transparent text-2xl text-main-gray-800 transition focus:outline-none"
            aria-haspopup="menu"
          >
            +
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="bottom-0 left-0 right-0 top-auto h-[90%] w-full max-w-none translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none data-[state=open]:animate-bottom-sheet-in data-[state=closed]:animate-bottom-sheet-out">
        <div className="flex flex-col h-full gap-3">
          <DialogClose>
            <div className="flex justify-end text-xs text-main-gray-800">
              닫기
            </div>
          </DialogClose>
          <div className="flex h-[100%] justify-center bg-main-gray-800 p-3 text-white">
            커스텀 화면
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
