import { ReactNode } from "react";

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col items-center w-[420px] py-12">
      {children}
    </div>
  );
}