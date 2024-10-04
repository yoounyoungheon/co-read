'use client'

import Link from 'next/link';
import BookLogo from './ui/components/view/atom/book-logo';
import { lusitana } from './ui/components/util/fonts';
import { Wrapper } from './ui/components/view/atom/wrapper';
import { Form } from './ui/components/view/atom/form';
import { Input, SubmitInput } from './ui/components/view/atom/input';

export default function Home() {
  const onSubmit = ()=>{console.log('onSubmit!')}
  const onChange = ()=>{console.log('onChange!')}
  return (
  <main className="flex min-h-screen flex-col p-6">
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
      <BookLogo />
    </div>
    
    <Wrapper >
    <p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
      <strong> Welcome to <Link href ="/main-board" className="text-blue-500">Read us !</Link>! Check your dashboard. </strong>
    </p>
      <Form onSubmit={()=>onSubmit}>
        <Input input='name' onChange={onChange}/>
        <Input input='email' onChange={onChange}/>
        <Input input='password' onChange={onChange}/>
        <SubmitInput/>
      </Form>
    </Wrapper>
    
  </main>
  );
}