import { ReactNode } from "react";

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-[420px] py-12">
        {children}
      </div>
    </div>
  );
}