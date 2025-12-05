import Link from "next/link";

export function Nav() {
  return (
    <div className=" text-blue-950 p-4 sm:p-1">
      <nav className="flex justify-between items-center px-1">
        <div className="text-lg font-bold hidden sm:block">YounghunLog</div>
        <ul className="flex space-x-6 font-semibold">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              Project
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              Article
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
