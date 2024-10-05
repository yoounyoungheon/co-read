'use client'
import BookLogo from '@/app/ui/components/view/atom/book-logo';
import { lusitana } from '@/app/ui/components/util/fonts';
import { Wrapper } from '@/app/ui/components/view/atom/wrapper';
import { SignUpInput, SubmitInput } from '@/app/ui/components/view/atom/auth-input';
import { SignInForm, SignUpForm } from '@/app/ui/components/view/molecule/auth-form';
import { useSignUp } from '@/app/business/hooks/auth/use-sign-up.hook';

export default function SignUp() {
  const {email, password, memberName, onChange, handleTransmition} = useSignUp();
  
  return (
  <main className="flex min-h-screen flex-col p-6">
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
      <div className="h-full w-full flex justify-center items-center">
        <BookLogo />
      </div>
    </div>
    
    <Wrapper >
    <p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
      <strong> Welcome to CO-READ ! </strong>
    </p>
      <SignUpForm />
    </Wrapper>
  </main>
  );
}