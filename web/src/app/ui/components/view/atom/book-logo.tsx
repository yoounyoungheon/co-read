import { BookOpenIcon } from '@heroicons/react/24/outline';
import { lusitana } from '../../util/fonts';

// To-Do: resize book logo according to window
export default function BookLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      {/* <BookOpenIcon className="h-5 w-5 rotate-[15deg]"/> */}
      <p className="text-[30px]"> CO READ</p>
    </div>
  );
}