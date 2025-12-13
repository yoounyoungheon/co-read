import Link from "next/link";

export function Nav() {
  return (
    <div className=" text-blue-950 px-4 py-2 sm:p-1">
      <nav className="flex justify-between items-center px-1">
        <div className="text-lg font-bold">
          <Link href="/" className="no-underline">
            iamyounghun
          </Link>
        </div>
      </nav>
    </div>
  );
}
