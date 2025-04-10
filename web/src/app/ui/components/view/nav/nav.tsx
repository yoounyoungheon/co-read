import Link from "next/link";

export function Nav(){
  return (
    <div className="bg-blue-950 text-white p-4">
      <nav className="flex justify-between items-center px-10">
        <div className="text-lg font-bold">YounghunLog</div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/project" className="hover:underline">
              Project
            </Link>
          </li>
          <li>
            <Link href="/article" className="hover:underline">
              Article
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}