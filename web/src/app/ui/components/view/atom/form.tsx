import { ReactNode } from "react";

export function Form({ children, onSubmit }: { children: ReactNode, onSubmit:()=>void }) {
  return (
    <form className="mt-12 mb-2 flex flex-col gap-2.5 w-full" onSubmit={onSubmit}>
      {children}
    </form>
  );
}