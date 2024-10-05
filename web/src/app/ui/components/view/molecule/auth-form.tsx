import { ReactNode } from "react";

export function SignInForm({ children, onSignIn, }: { children: ReactNode, onSignIn:()=>void }) {
  return (
    <form className="mt-12 mb-2 flex flex-col gap-2.5 w-full" onSubmit={onSignIn}>
    {children}
    </form>
  );
}