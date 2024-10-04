'use client'
import Link from 'next/link';
import BookLogo from '@/app/ui/components/view/atom/book-logo';
import { lusitana } from '@/app/ui/components/util/fonts';
import { Wrapper } from '@/app/ui/components/view/atom/wrapper';
import { SignUpInput, SubmitInput } from '@/app/ui/components/view/atom/auth-input';
import { SignIninForm } from '@/app/ui/components/view/molecule/auth-form';
import { useSignUp } from '@/app/business/hooks/auth/use-sign-up.hook';

export default function Home() {
  const {email, password, memberName, onChange, handleTranmition} = useSignUp();
  
  return (
  <main className="flex min-h-screen flex-col p-6">
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
      <BookLogo />
    </div>
    
    <Wrapper >
    <p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
      <strong> Welcome to CO-READ ! </strong>
    </p>
      <SignIninForm onSignIn={()=>{handleTranmition(email, password)}}>
        <SignUpInput email={email} password={password} memberName={memberName} onChange={onChange}/>
        <SubmitInput/>
      </SignIninForm>
      <Link href ="/routes/main-board" className="text-blue-500">Do you have no account?</Link>
    </Wrapper>
    
  </main>
  );
}