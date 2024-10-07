import { BookOpenIcon } from '@heroicons/react/24/outline';
import { lusitana } from '../../util/fonts';

// To-Do: resize book logo according to window
export default function BookLogo() {
  return (
    <div
      className={`${lusitana.className} flex items-center justify-start leading-none text-white min-w-[200px] md:min-w-[300px]`}
    >
      <BookOpenIcon className="h-10 w-10 rotate-[15deg] md:h-10 md:w-10 lg:h-10 lg:w-10"/>
      <p className="ml-2 text-[24px] md:text-[28px] lg:text-[28px]"> CO READ</p>
    </div>
  );
}