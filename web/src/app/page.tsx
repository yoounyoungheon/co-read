'use client'
import Link from 'next/link';
import BookLogo from './ui/components/view/atom/book-logo';
import { lusitana } from './ui/components/util/fonts';
import { Wrapper } from './ui/components/view/atom/wrapper';
import { SignInInput, SubmitInput } from './ui/components/view/atom/auth-input';
import { SignInForm } from './ui/components/view/molecule/auth-form';
import { useSignIn } from './business/hooks/auth/use-sign-in.hook';

export default function Home() {
  const {email, password, onChange, handleAuthentication} = useSignIn();
  
  return (
  <main className="flex min-h-screen flex-col p-6">
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
      <div className="h-full w-full flex justify-center items-center"><BookLogo /></div>
    </div>
    
    <Wrapper >
    <p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
      <strong> Welcome to CO-READ ! </strong>
    </p>
      <SignInForm onSignIn={()=>{handleAuthentication(email, password)}}>
        <SignInInput email={email} password={password} onChange={onChange}/>
        <SubmitInput content='Sign In'/>
      </SignInForm>
      <Link href ="/routes/sign-up" className="text-blue-500">Do you have no account?</Link>
    </Wrapper>
    
  </main>
  );
}