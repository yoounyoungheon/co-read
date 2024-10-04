'use client'
import Link from 'next/link';
import BookLogo from './ui/components/view/atom/book-logo';
import { lusitana } from './ui/components/util/fonts';
import { Wrapper } from './ui/components/view/atom/wrapper';
import { LoginInput, SubmitInput } from './ui/components/view/atom/input';
import { authenticate } from './business/services/auth/auth.service';
import { Form } from './ui/components/view/molecule/form';
import { useLogin } from './business/hooks/useLogin';

export default function Home() {
  const {email, password, onChange} = useLogin();

  return (
  <main className="flex min-h-screen flex-col p-6">
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
      <BookLogo />
    </div>
    
    <Wrapper >
    <p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
      <strong> Welcome to <Link href ="/main-board" className="text-blue-500">Read us !</Link>! Check your dashboard. </strong>
    </p>
      <Form onSubmit={()=>{
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        authenticate(formData);
      }}>
        <input
          type='email'
          className="p-2.5 px-5 rounded-full w-full
            text-base cursor-pointer 
            bg-blue-100 text-black 
            hover:opacity-80 border-none"
          name="email"
          value={email}
          onChange={onChange}
          placeholder='email'
          required
        />
        <input 
          type='password'
          className="p-2.5 px-5 rounded-full w-full
            text-base cursor-pointer 
            bg-blue-100 text-black 
            hover:opacity-80 border-none" 
          name="password"
          value={password}
          onChange={onChange}
          placeholder='password'
          required
        />
        <SubmitInput/>
      </Form>
    </Wrapper>
    
  </main>
  );
}