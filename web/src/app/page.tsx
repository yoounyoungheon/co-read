import Link from 'next/link';
import BookLogo from './ui/components/view/atom/book-logo';
import { lusitana } from './ui/components/util/fonts';

export default function Home() {
  return (
  <main className="flex min-h-screen flex-col p-6">
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
      <BookLogo />
    </div> <br/>
    <p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal`}>
      <strong>Welcome to <Link href ="/main-board" className="text-blue-500">Read us !</Link>! Check your dashboard. </strong>
    </p>
    
  </main>
  );
}